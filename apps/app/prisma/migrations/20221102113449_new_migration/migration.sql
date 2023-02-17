/*
  Warnings:

  - The values [Agent,Client] on the enum `PersonOnShowingRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `workspaceId` on the `PersonOnShowing` table. All the data in the column will be lost.
  - You are about to drop the column `placeId` on the `Showing` table. All the data in the column will be lost.
  - You are about to drop the `Place` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PersonToPlace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PlaceToTag` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `showingId` on table `PersonOnShowing` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PersonOnShowingRole_new" AS ENUM ('client', 'agent');
ALTER TABLE "PersonOnShowing" ALTER COLUMN "role" TYPE "PersonOnShowingRole_new" USING ("role"::text::"PersonOnShowingRole_new");
ALTER TYPE "PersonOnShowingRole" RENAME TO "PersonOnShowingRole_old";
ALTER TYPE "PersonOnShowingRole_new" RENAME TO "PersonOnShowingRole";
DROP TYPE "PersonOnShowingRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "PersonOnShowing" DROP CONSTRAINT "PersonOnShowing_showingId_fkey";

-- DropForeignKey
ALTER TABLE "PersonOnShowing" DROP CONSTRAINT "PersonOnShowing_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Showing" DROP CONSTRAINT "Showing_placeId_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToPlace" DROP CONSTRAINT "_PersonToPlace_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToPlace" DROP CONSTRAINT "_PersonToPlace_B_fkey";

-- DropForeignKey
ALTER TABLE "_PlaceToTag" DROP CONSTRAINT "_PlaceToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlaceToTag" DROP CONSTRAINT "_PlaceToTag_B_fkey";

-- AlterTable
ALTER TABLE "PersonOnShowing" DROP COLUMN "workspaceId",
ALTER COLUMN "showingId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Showing" DROP COLUMN "placeId";

-- DropTable
DROP TABLE "Place";

-- DropTable
DROP TABLE "_PersonToPlace";

-- DropTable
DROP TABLE "_PlaceToTag";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "viewd" BOOLEAN DEFAULT false,
    "viewedOn" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOnShowing" ADD CONSTRAINT "PersonOnShowing_showingId_fkey" FOREIGN KEY ("showingId") REFERENCES "Showing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
