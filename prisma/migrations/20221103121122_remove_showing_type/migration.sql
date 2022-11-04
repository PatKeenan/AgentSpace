/*
  Warnings:

  - You are about to drop the column `type` on the `ShowingGroup` table. All the data in the column will be lost.
  - Added the required column `address` to the `Showing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Showing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Showing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_name` to the `Showing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Showing" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "latitude" INTEGER NOT NULL,
ADD COLUMN     "longitude" INTEGER NOT NULL,
ADD COLUMN     "place_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShowingGroup" DROP COLUMN "type";
