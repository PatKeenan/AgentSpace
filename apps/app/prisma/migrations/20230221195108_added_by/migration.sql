-- AlterTable
ALTER TABLE "BetaUsers" ADD COLUMN     "addedBy_id" TEXT;

-- AddForeignKey
ALTER TABLE "BetaUsers" ADD CONSTRAINT "BetaUsers_addedBy_id_fkey" FOREIGN KEY ("addedBy_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
