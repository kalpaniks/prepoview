-- CreateTable
CREATE TABLE "public"."ViewerSession" (
    "id" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ViewerSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ViewerSession_shareId_expiresAt_idx" ON "public"."ViewerSession"("shareId", "expiresAt");

-- AddForeignKey
ALTER TABLE "public"."ViewerSession" ADD CONSTRAINT "ViewerSession_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "public"."Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;
