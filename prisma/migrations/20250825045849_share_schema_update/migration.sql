-- AlterTable
ALTER TABLE "public"."Share" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isExpired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxShares" INTEGER,
ADD COLUMN     "sharedWith" TEXT,
ADD COLUMN     "totalShares" INTEGER NOT NULL DEFAULT 0;
