/*
  Warnings:

  - You are about to drop the column `shareId` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "Share_shareId_key";

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "shareId";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";
