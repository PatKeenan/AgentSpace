/*
  Warnings:

  - You are about to drop the column `socail` on the `PersonMeta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PersonMeta" DROP COLUMN "socail",
ADD COLUMN     "social" JSONB;
