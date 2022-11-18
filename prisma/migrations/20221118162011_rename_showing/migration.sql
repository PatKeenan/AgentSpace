/*
  Warnings:

  - You are about to drop the `ContactOnShowing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Showing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShowingToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('NO_STATUS', 'CONFIRMED', 'CANCELED', 'RESCHEDULED', 'PENDING', 'DENIED');

-- DropForeignKey
ALTER TABLE "ContactOnShowing" DROP CONSTRAINT "ContactOnShowing_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactOnShowing" DROP CONSTRAINT "ContactOnShowing_showingId_fkey";

-- DropForeignKey
ALTER TABLE "Showing" DROP CONSTRAINT "Showing_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "Showing" DROP CONSTRAINT "Showing_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Showing" DROP CONSTRAINT "Showing_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "_ShowingToTag" DROP CONSTRAINT "_ShowingToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShowingToTag" DROP CONSTRAINT "_ShowingToTag_B_fkey";

-- DropTable
DROP TABLE "ContactOnShowing";

-- DropTable
DROP TABLE "Showing";

-- DropTable
DROP TABLE "_ShowingToTag";

-- DropEnum
DROP TYPE "ShowingStatus";

-- CreateTable
CREATE TABLE "ContactOnAppointment" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "role" "ContactOnShowingRole" NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ContactOnAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'NO_STATUS',
    "startTime" TEXT,
    "endTime" TEXT,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "assignedToId" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "weight" INTEGER DEFAULT 0,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AppointmentToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AppointmentToTag_AB_unique" ON "_AppointmentToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_AppointmentToTag_B_index" ON "_AppointmentToTag"("B");

-- AddForeignKey
ALTER TABLE "ContactOnAppointment" ADD CONSTRAINT "ContactOnAppointment_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactOnAppointment" ADD CONSTRAINT "ContactOnAppointment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "UserOnWorkspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToTag" ADD CONSTRAINT "_AppointmentToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToTag" ADD CONSTRAINT "_AppointmentToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
