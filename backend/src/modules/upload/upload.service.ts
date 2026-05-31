import { prisma } from "../../lib/prisma";
import { documentQueue } from "../queues/queue";
import fs from 'fs';
import path from 'path';

export const uploadDocument = async (
  file: Express.Multer.File
) => {

  const safeName =
    file.originalname.replace(
      /\s+/g,
      "-"
    );

  const fileName =
    `${Date.now()}-${safeName}`;

  const absoluteFilePath =
    path.resolve(
      process.cwd(),
      "../uploads",
      fileName
    );

  console.log(
    "CWD:",
    process.cwd()
  );

  console.log(
    "TEMP FILE:",
    file.path
  );

  console.log(
    "FINAL FILE:",
    absoluteFilePath
  );

  fs.renameSync(
    file.path,
    absoluteFilePath
  );

  const document =
    await prisma.document.create({
      data: {
        filename: file.originalname,
        filePath: fileName,
        status: "PROCESSING",
      },
    });

  await documentQueue.add(
    "process-document",
    {
      documentId: document.id,
      filePath: absoluteFilePath,
    }
  );

  return {
    documentId: document.id,
    status: document.status,
  };
};