import { prisma } from "../../lib/prisma";
import { documentQueue } from "../queues/queue";

export const uploadDocument = async (
  file: Express.Multer.File
) => {

  const document = await prisma.document.create({
    data: {
      filename: file.originalname,
      status: "PROCESSING",
    },
  });

  await documentQueue.add(
    "process-document",
    {
      documentId: document.id,
      filePath: file.path,
    }
  );

  return {
    documentId: document.id,
    status: document.status,
  };
};