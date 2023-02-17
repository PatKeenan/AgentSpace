/*
  Warnings:

  - You are about to drop the column `profileId` on the `ContactOnAppointment` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `ContactOnAppointment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContactOnAppointment" DROP CONSTRAINT "ContactOnAppointment_profileId_fkey";

-- AlterTable
ALTER TABLE "ContactOnAppointment" DROP COLUMN "profileId",
DROP COLUMN "role";

-- CreateTable
CREATE TABLE "_ContactOnAppointmentToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContactOnAppointmentToProfile_AB_unique" ON "_ContactOnAppointmentToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactOnAppointmentToProfile_B_index" ON "_ContactOnAppointmentToProfile"("B");

-- AddForeignKey
ALTER TABLE "_ContactOnAppointmentToProfile" ADD CONSTRAINT "_ContactOnAppointmentToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "ContactOnAppointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactOnAppointmentToProfile" ADD CONSTRAINT "_ContactOnAppointmentToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
