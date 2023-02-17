/*
  Warnings:

  - You are about to drop the column `place_name` on the `Showing` table. All the data in the column will be lost.
  - Added the required column `placeName` to the `Showing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Showing" DROP COLUMN "place_name",
ADD COLUMN     "placeName" TEXT NOT NULL;
