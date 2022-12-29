-- DropForeignKey
ALTER TABLE "ContactOnAppointment" DROP CONSTRAINT "ContactOnAppointment_profileId_fkey";

-- AlterTable
ALTER TABLE "ContactOnAppointment" ALTER COLUMN "profileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ContactOnAppointment" ADD CONSTRAINT "ContactOnAppointment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
