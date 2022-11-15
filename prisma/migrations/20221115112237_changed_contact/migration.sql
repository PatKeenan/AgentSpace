/*
  Warnings:

  - You are about to drop the column `name` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `primaryEmail` on the `ContactMeta` table. All the data in the column will be lost.
  - You are about to drop the column `primaryPhone` on the `ContactMeta` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryEmail` on the `ContactMeta` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryPhone` on the `ContactMeta` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "name",
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "ContactMeta" DROP COLUMN "primaryEmail",
DROP COLUMN "primaryPhone",
DROP COLUMN "secondaryEmail",
DROP COLUMN "secondaryPhone",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phoneNumber" TEXT;
