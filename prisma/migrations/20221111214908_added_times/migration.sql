-- AlterTable
ALTER TABLE "Showing" ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "startTime" TEXT,
ALTER COLUMN "weight" SET DEFAULT 0;
