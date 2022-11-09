-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "PersonMeta" DROP CONSTRAINT "PersonMeta_personId_fkey";

-- DropForeignKey
ALTER TABLE "PersonOnShowing" DROP CONSTRAINT "PersonOnShowing_personId_fkey";

-- DropForeignKey
ALTER TABLE "PersonOnShowing" DROP CONSTRAINT "PersonOnShowing_showingId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralConnection" DROP CONSTRAINT "ReferralConnection_personId_fkey";

-- DropForeignKey
ALTER TABLE "Showing" DROP CONSTRAINT "Showing_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Showing" DROP CONSTRAINT "Showing_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnWorkspace" DROP CONSTRAINT "UserOnWorkspace_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnWorkspace" DROP CONSTRAINT "UserOnWorkspace_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "PersonOnShowing" ADD CONSTRAINT "PersonOnShowing_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOnShowing" ADD CONSTRAINT "PersonOnShowing_showingId_fkey" FOREIGN KEY ("showingId") REFERENCES "Showing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showing" ADD CONSTRAINT "Showing_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showing" ADD CONSTRAINT "Showing_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonMeta" ADD CONSTRAINT "PersonMeta_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralConnection" ADD CONSTRAINT "ReferralConnection_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnWorkspace" ADD CONSTRAINT "UserOnWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnWorkspace" ADD CONSTRAINT "UserOnWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
