/*
  Warnings:

  - You are about to drop the column `archieved` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "archieved",
ADD COLUMN     "archived" BOOLEAN DEFAULT false;
