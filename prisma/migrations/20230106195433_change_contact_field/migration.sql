/*
  Warnings:

  - You are about to drop the column `displayName` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the `ContactMeta` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContactMeta" DROP CONSTRAINT "ContactMeta_contactId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "displayName",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "social" JSONB;

-- DropTable
DROP TABLE "ContactMeta";

-- CreateTable
CREATE TABLE "SubContact" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactId" TEXT NOT NULL,
    "social" JSONB,
    "email" TEXT,
    "phoneNumber" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "note" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SubContact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubContact" ADD CONSTRAINT "SubContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
