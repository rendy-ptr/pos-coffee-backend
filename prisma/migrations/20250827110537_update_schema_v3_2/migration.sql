/*
  Warnings:

  - You are about to drop the column `description` on the `menus` table. All the data in the column will be lost.
  - Made the column `icon` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shiftStart` on table `kasir_profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shiftEnd` on table `kasir_profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "icon" SET NOT NULL;

-- AlterTable
ALTER TABLE "kasir_profiles" ALTER COLUMN "shiftStart" SET NOT NULL,
ALTER COLUMN "shiftEnd" SET NOT NULL;

-- AlterTable
ALTER TABLE "menus" DROP COLUMN "description";
