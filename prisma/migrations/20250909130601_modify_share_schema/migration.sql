/*
  Warnings:

  - You are about to drop the column `isActive` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the column `isExpired` on the `Share` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Share" DROP COLUMN "isActive",
DROP COLUMN "isExpired";
