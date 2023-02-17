/*
  Warnings:

  - You are about to drop the column `stopNumber` on the `Showing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Showing" DROP COLUMN "stopNumber",
ADD COLUMN     "weight" INTEGER;
