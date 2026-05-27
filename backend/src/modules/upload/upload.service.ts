import { prisma } from "../../lib/prisma";

export const uploadDocument = async (
  file: Express.Multer.File
) => {

  const document = await prisma.document.create({
    data: {
      filename: file.originalname,
      status: "PROCESSING",
    },
  });

  return {
    documentId: document.id,
  };
};