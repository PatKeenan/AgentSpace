/*
  Warnings:

  - You are about to drop the `ProfileMeta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileMeta" DROP CONSTRAINT "ProfileMeta_profileId_fkey";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "metafFields" JSONB;

-- DropTable
DROP TABLE "ProfileMeta";
