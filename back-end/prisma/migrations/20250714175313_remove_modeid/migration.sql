/*
  Warnings:

  - You are about to drop the column `modeId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the `Mode` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mode` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModeType" AS ENUM ('SOCRATIC', 'DEBATE', 'EVIDENCE', 'SPEECH');

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_modeId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "modeId",
ADD COLUMN     "mode" "ModeType" NOT NULL;

-- DropTable
DROP TABLE "Mode";
