-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "primaryMetaId" TEXT;

-- AlterTable
ALTER TABLE "PersonMeta" ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT;

-- CreateTable
CREATE TABLE "ReferralConnection" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "referalNotes" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ReferralConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralConnection_personId_key" ON "ReferralConnection"("personId");

-- AddForeignKey
ALTER TABLE "ReferralConnection" ADD CONSTRAINT "ReferralConnection_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
