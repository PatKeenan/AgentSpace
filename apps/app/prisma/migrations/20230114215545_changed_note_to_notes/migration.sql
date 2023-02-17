/*
  Warnings:

  - You are about to drop the column `note` on the `SubContact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubContact" DROP COLUMN "note",
ADD COLUMN     "notes" TEXT;
