/*
  Warnings:

  - You are about to drop the `_ContactOnAppointmentToProfile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profileId` to the `ContactOnAppointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ContactOnAppointmentToProfile" DROP CONSTRAINT "_ContactOnAppointmentToProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContactOnAppointmentToProfile" DROP CONSTRAINT "_ContactOnAppointmentToProfile_B_fkey";

-- AlterTable
ALTER TABLE "ContactOnAppointment" ADD COLUMN     "profileId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ContactOnAppointmentToProfile";

-- AddForeignKey
ALTER TABLE "ContactOnAppointment" ADD CONSTRAINT "ContactOnAppointment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
