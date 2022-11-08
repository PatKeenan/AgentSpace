/*
  Warnings:

  - The values [client,agent] on the enum `PersonOnShowingRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `showingGroupId` on the `Showing` table. All the data in the column will be lost.
  - You are about to drop the `ShowingGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShowingGroupToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PersonOnShowingRole_new" AS ENUM ('CLIENT', 'AGENT', 'OTHER');
ALTER TABLE "PersonOnShowing" ALTER COLUMN "role" TYPE "PersonOnShowingRole_new" USING ("role"::text::"PersonOnShowingRole_new");
ALTER TYPE "PersonOnShowingRole" RENAME TO "PersonOnShowingRole_old";
ALTER TYPE "PersonOnShowingRole_new" RENAME TO "PersonOnShowingRole";
DROP TYPE "PersonOnShowingRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Showing" DROP CONSTRAINT "Showing_showingGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ShowingGroup" DROP CONSTRAINT "ShowingGroup_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ShowingGroup" DROP CONSTRAINT "ShowingGroup_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "_ShowingGroupToTag" DROP CONSTRAINT "_ShowingGroupToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShowingGroupToTag" DROP CONSTRAINT "_ShowingGroupToTag_B_fkey";

-- AlterTable
ALTER TABLE "PersonOnShowing" ADD COLUMN     "deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Showing" DROP COLUMN "showingGroupId";

-- DropTable
DROP TABLE "ShowingGroup";

-- DropTable
DROP TABLE "_ShowingGroupToTag";

-- DropEnum
DROP TYPE "ShowingGroupType";
