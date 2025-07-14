/*
  Warnings:

  - A unique constraint covering the columns `[anonId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "anonId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_anonId_key" ON "User"("anonId");
