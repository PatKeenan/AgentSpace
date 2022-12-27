/*
  Warnings:

  - You are about to alter the column `notes` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(1000);
