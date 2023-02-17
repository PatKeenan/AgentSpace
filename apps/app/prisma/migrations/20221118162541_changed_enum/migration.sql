/*
  Warnings:

  - Changed the type of `role` on the `ContactOnAppointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContactOnAppointmentRole" AS ENUM ('CLIENT', 'AGENT', 'CONTRACTOR', 'INSPECTOR', 'OTHER');

-- AlterTable
ALTER TABLE "ContactOnAppointment" DROP COLUMN "role",
ADD COLUMN     "role" "ContactOnAppointmentRole" NOT NULL;

-- DropEnum
DROP TYPE "ContactOnShowingRole";
