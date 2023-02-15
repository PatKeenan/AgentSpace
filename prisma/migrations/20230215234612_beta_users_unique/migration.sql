/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `BetaUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BetaUsers_email_key" ON "BetaUsers"("email");
