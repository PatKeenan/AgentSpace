/*
  Warnings:

  - The values [LANDLORD] on the enum `PROFILE_TYPES` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `name` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PROFILE_TYPES_new" AS ENUM ('BUYER', 'SELLER', 'RENTER', 'RENTAL', 'AGENT', 'VENDOR', 'OTHER');
ALTER TABLE "Profile" ALTER COLUMN "type" TYPE "PROFILE_TYPES_new" USING ("type"::text::"PROFILE_TYPES_new");
ALTER TYPE "PROFILE_TYPES" RENAME TO "PROFILE_TYPES_old";
ALTER TYPE "PROFILE_TYPES_new" RENAME TO "PROFILE_TYPES";
DROP TYPE "PROFILE_TYPES_old";
COMMIT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "name" TEXT NOT NULL;
