import { Worker } from "bullmq";
import { createHash } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { extractPdfText } from "../../services/pdf/extractPdfText";
import { chunkText } from "../../utils/chunkText";
import { generateEmbedding } from "../../services/embedding/generateEmbedding";
import { ensureQdrantCollection } from "../../lib/qdrant";

const COLLECTION_NAME = "documents";

const buildPointId = (
  documentId: string,
  chunkIndex: number
) => {
  // Generate a deterministic UUID so retries upsert the same point IDs.
  const hex = createHash("sha256")
    .update(`${documentId}:${chunkIndex}`)
    .digest("hex");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `a${hex.slice(17, 20)}`,
    hex.slice(20, 32),
  ].join("-");
};

new Worker(
  "document-processing",
  async (job) => {
    const {
      documentId,
      filePath
    } = job.data;

    try {
      // Mark the document as actively being processed.
      await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          status: "PROCESSING",
        },
      });

      // Extract the raw text from the uploaded PDF.
      const extracted = await extractPdfText(filePath);

      // Split the extracted text into chunks sized for embedding.
      const chunks = chunkText(extracted.text);

      if (!chunks.length) {
        throw new Error("No text chunks were generated from the document");
      }

      // Ensure the vector collection exists before deleting or writing points.
      const qdrant = await ensureQdrantCollection(COLLECTION_NAME);

      // Clear previous relational chunks so retries replace old results.
      await prisma.chunk.deleteMany({
        where: {
          documentId,
        },
      });

      // Clear previous vectors for this document to keep ingest idempotent.
      await qdrant.delete(COLLECTION_NAME, {
        filter: {
          must: [
            {
              key: "documentId",
              match: {
                value: documentId,
              },
            },
          ],
        },
      });

      // Embed each chunk and prepare the Qdrant point payloads.
      const points = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (!chunk) {
          continue;
        }

        const embedding = await generateEmbedding(chunk);
        points.push({
          id: buildPointId(documentId, i),
          vector: embedding,
          payload: {
            documentId,
            text: chunk,
            chunkIndex: i,
          },
        });
        console.log(i);
      }

      console.log("TOTAL CHUNKS:", chunks.length);

      // Store all embeddings in Qdrant in a single batch write.
      await qdrant.upsert(COLLECTION_NAME, {
        points,
      });

      // Persist the text chunks in Postgres for tracking and later lookup.
      await prisma.chunk.createMany({
        data: chunks.map((chunk, chunkIndex) => ({
          documentId,
          text: chunk,
          chunkIndex,
        })),
      });

      // Mark the document as completed once both stores are updated.
      await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          status: "COMPLETED",
        },
      });
      console.log("DONE");
    } catch (error) {
      // Log the worker failure so API and queue issues are easier to debug.
      console.error("Document processing failed", {
        documentId,
        error,
      });

      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error
      ) {
        console.error("Qdrant error details", (error as { data: unknown }).data);
      }

      // Persist the failure state so clients can see that processing stopped.
      await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          status: "FAILED",
        }
      });

      throw error;
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
