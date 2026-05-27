/*
  Warnings:

  - Added the required column `chunkIndex` to the `Chunk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chunk" ADD COLUMN     "chunkIndex" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "pageNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "originalUrl" TEXT;
