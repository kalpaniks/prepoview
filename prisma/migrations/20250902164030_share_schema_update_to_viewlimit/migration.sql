/*
  Warnings:

  - You are about to drop the column `maxShares` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the column `totalShares` on the `Share` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Share" DROP COLUMN "maxShares",
DROP COLUMN "totalShares",
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewLimit" INTEGER;
