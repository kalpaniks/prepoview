/*
  Warnings:

  - You are about to drop the column `accessToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "accessToken";

-- CreateIndex
CREATE INDEX "Account_userId_provider_idx" ON "public"."Account"("userId", "provider");
