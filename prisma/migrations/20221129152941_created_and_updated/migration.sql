/*
  Warnings:

  - You are about to drop the column `viewd` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ContactMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ContactOnAppointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ReferralConnection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SubscriptionOnWorkspace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserOnWorkspace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ContactMeta" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ContactOnAppointment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "viewd";

-- AlterTable
ALTER TABLE "ReferralConnection" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionOnWorkspace" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserOnWorkspace" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
