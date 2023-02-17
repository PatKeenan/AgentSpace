/*
  Warnings:

  - The values [RENTAL] on the enum `PROFILE_TYPES` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PROFILE_TYPES_new" AS ENUM ('BUYER', 'SELLER', 'RENTER', 'RENTEE', 'AGENT', 'VENDOR', 'OTHER');
ALTER TABLE "Profile" ALTER COLUMN "type" TYPE "PROFILE_TYPES_new" USING ("type"::text::"PROFILE_TYPES_new");
ALTER TYPE "PROFILE_TYPES" RENAME TO "PROFILE_TYPES_old";
ALTER TYPE "PROFILE_TYPES_new" RENAME TO "PROFILE_TYPES";
DROP TYPE "PROFILE_TYPES_old";
COMMIT;
