/*
  Warnings:

  - You are about to drop the column `primaryMetaId` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the `PersonCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PersonToPersonCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PersonCategory" DROP CONSTRAINT "PersonCategory_createdById_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToPersonCategory" DROP CONSTRAINT "_PersonToPersonCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToPersonCategory" DROP CONSTRAINT "_PersonToPersonCategory_B_fkey";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "primaryMetaId";

-- AlterTable
ALTER TABLE "PersonMeta" ADD COLUMN     "isPrimaryContact" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "PersonCategory";

-- DropTable
DROP TABLE "_PersonToPersonCategory";
