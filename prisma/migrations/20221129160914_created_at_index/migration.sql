-- DropIndex
DROP INDEX "ContactMeta_id_idx";

-- CreateIndex
CREATE INDEX "ContactMeta_createdAt_idx" ON "ContactMeta"("createdAt" ASC);
