"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const node_crypto_1 = require("node:crypto");
const prisma_1 = require("../../lib/prisma");
const extractPdfText_1 = require("../../services/pdf/extractPdfText");
const chunkText_1 = require("../../utils/chunkText");
const generateEmbedding_1 = require("../../services/embedding/generateEmbedding");
const qdrant_1 = require("../../lib/qdrant");
const COLLECTION_NAME = "documents";
const buildPointId = (documentId, chunkIndex) => {
    const hex = (0, node_crypto_1.createHash)("sha256")
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
new bullmq_1.Worker("document-processing", async (job) => {
    const { documentId, filePath } = job.data;
    try {
        await prisma_1.prisma.document.update({
            where: {
                id: documentId,
            },
            data: {
                status: "PROCESSING",
            },
        });
        const extracted = await (0, extractPdfText_1.extractPdfText)(filePath);
        const chunks = (0, chunkText_1.chunkText)(extracted.text);
        if (!chunks.length) {
            throw new Error("No text chunks were generated from the document");
        }
        const qdrant = await (0, qdrant_1.ensureQdrantCollection)(COLLECTION_NAME);
        await prisma_1.prisma.chunk.deleteMany({
            where: {
                documentId,
            },
        });
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
        const points = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (!chunk) {
                continue;
            }
            const embedding = await (0, generateEmbedding_1.generateEmbedding)(chunk);
            points.push({
                id: buildPointId(documentId, i),
                vector: embedding,
                payload: {
                    documentId,
                    text: chunk,
                    chunkIndex: i,
                },
            });
        }
        console.log("TOTAL CHUNKS:", chunks.length);
        await qdrant.upsert(COLLECTION_NAME, {
            points,
        });
        await prisma_1.prisma.chunk.createMany({
            data: chunks.map((chunk, chunkIndex) => ({
                documentId,
                text: chunk,
                chunkIndex,
            })),
        });
        await prisma_1.prisma.document.update({
            where: {
                id: documentId,
            },
            data: {
                status: "COMPLETED",
            },
        });
        console.log("DONE");
    }
    catch (error) {
        console.error("Document processing failed", {
            documentId,
            error,
        });
        if (typeof error === "object" &&
            error !== null &&
            "data" in error) {
            console.error("Qdrant error details", error.data);
        }
        await prisma_1.prisma.document.update({
            where: {
                id: documentId,
            },
            data: {
                status: "FAILED",
            }
        });
        throw error;
    }
}, { connection: {
        host: "localhost",
        port: 6379,
    }, });
//# sourceMappingURL=document.worker.js.map