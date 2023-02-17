/*
  Warnings:

  - You are about to drop the `WorkspaceMeta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkspaceMeta" DROP CONSTRAINT "WorkspaceMeta_workspaceId_fkey";

-- DropTable
DROP TABLE "WorkspaceMeta";
