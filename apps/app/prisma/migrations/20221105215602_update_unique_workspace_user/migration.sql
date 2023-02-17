/*
  Warnings:

  - A unique constraint covering the columns `[userId,workspaceId]` on the table `UserOnWorkspace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserOnWorkspace_userId_workspaceId_key" ON "UserOnWorkspace"("userId", "workspaceId");
