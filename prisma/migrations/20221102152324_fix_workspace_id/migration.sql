/*
  Warnings:

  - Made the column `workspaceId` on table `UserOnWorkspace` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserOnWorkspace" DROP CONSTRAINT "UserOnWorkspace_workspaceId_fkey";

-- AlterTable
ALTER TABLE "UserOnWorkspace" ALTER COLUMN "workspaceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "UserOnWorkspace" ADD CONSTRAINT "UserOnWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
