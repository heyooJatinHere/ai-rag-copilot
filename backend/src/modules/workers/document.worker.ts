import { Worker } from "bullmq";
import { prisma } from "../../lib/prisma";
import { extractPdfText } from "../../services/pdf/extractPdfText";
import { chunkText } from "../../utils/chunkText";


new Worker(
  "document-processing",
  async (job) => {

    const {
      documentId,
      filePath
    } = job.data;

    try{
      await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          status: "PROCESSING",
        },
      });
      
      const extracted = await extractPdfText(filePath)

      console.log(extracted.text.slice(0, 1000));

      const chunks = chunkText(extracted.text)

      console.log("TOTAL CHUNKS:", chunks.length);
      console.log(chunks[73]);


      for (
        let i=0;
        i<chunks.length;
        i++
      ){
        await prisma.chunk.create({
          data: {
            documentId,
            text: chunks[i],
            chunkIndex: i,
          }
        })
      }
      await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          status: "COMPLETED",
        },
      });
      console.log("DONE");
    } catch(error){
      await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          status: "FAILED",
        }
      });
    }

  },
  { connection: {
      host: "localhost",
      port: 6379,
    }, }
);