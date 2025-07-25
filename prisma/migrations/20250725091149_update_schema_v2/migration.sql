/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `AdminProfile` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `CustomerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `KasirProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdminProfile" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "CustomerProfile" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "KasirProfile" DROP COLUMN "isDeleted";
