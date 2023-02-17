/*
  Warnings:

  - You are about to drop the column `personId` on the `ReferralConnection` table. All the data in the column will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonMeta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonOnShowing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PersonToTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[contactId]` on the table `ReferralConnection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contactId` to the `ReferralConnection` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContactOnShowingRole" AS ENUM ('CLIENT', 'AGENT', 'OTHER');

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "PersonMeta" DROP CONSTRAINT "PersonMeta_personId_fkey";

-- DropForeignKey
ALTER TABLE "PersonOnShowing" DROP CONSTRAINT "PersonOnShowing_personId_fkey";

-- DropForeignKey
ALTER TABLE "PersonOnShowing" DROP CONSTRAINT "PersonOnShowing_showingId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralConnection" DROP CONSTRAINT "ReferralConnection_personId_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToTag" DROP CONSTRAINT "_PersonToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToTag" DROP CONSTRAINT "_PersonToTag_B_fkey";

-- DropIndex
DROP INDEX "ReferralConnection_personId_key";

-- AlterTable
ALTER TABLE "ReferralConnection" DROP COLUMN "personId",
ADD COLUMN     "contactId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Person";

-- DropTable
DROP TABLE "PersonMeta";

-- DropTable
DROP TABLE "PersonOnShowing";

-- DropTable
DROP TABLE "_PersonToTag";

-- DropEnum
DROP TYPE "PersonOnShowingRole";

-- CreateTable
CREATE TABLE "ContactOnShowing" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "role" "ContactOnShowingRole" NOT NULL,
    "showingId" TEXT NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ContactOnShowing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMeta" (
    "id" TEXT NOT NULL,
    "isPrimaryContact" BOOLEAN NOT NULL DEFAULT false,
    "contactId" TEXT NOT NULL,
    "social" JSONB,
    "primaryEmail" TEXT,
    "secondaryEmail" TEXT,
    "primaryPhone" TEXT,
    "secondaryPhone" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "firstName" TEXT,
    "lastName" TEXT,

    CONSTRAINT "ContactMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContactToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactMeta_contactId_key" ON "ContactMeta"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToTag_AB_unique" ON "_ContactToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToTag_B_index" ON "_ContactToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralConnection_contactId_key" ON "ReferralConnection"("contactId");

-- AddForeignKey
ALTER TABLE "ContactOnShowing" ADD CONSTRAINT "ContactOnShowing_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactOnShowing" ADD CONSTRAINT "ContactOnShowing_showingId_fkey" FOREIGN KEY ("showingId") REFERENCES "Showing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMeta" ADD CONSTRAINT "ContactMeta_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralConnection" ADD CONSTRAINT "ReferralConnection_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToTag" ADD CONSTRAINT "_ContactToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToTag" ADD CONSTRAINT "_ContactToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
