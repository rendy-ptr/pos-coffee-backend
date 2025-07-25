/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `customerProfileId` on the `Voucher` table. All the data in the column will be lost.
  - Made the column `expiresAt` on table `Voucher` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minPurchase` on table `Voucher` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('customer', 'kasir', 'admin');

-- DropForeignKey
ALTER TABLE "Voucher" DROP CONSTRAINT "Voucher_customerProfileId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'customer';

-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "customerProfileId",
ALTER COLUMN "expiresAt" SET NOT NULL,
ALTER COLUMN "minPurchase" SET NOT NULL;

-- CreateTable
CREATE TABLE "_CustomerProfileToVoucher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CustomerProfileToVoucher_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CustomerProfileToVoucher_B_index" ON "_CustomerProfileToVoucher"("B");

-- AddForeignKey
ALTER TABLE "_CustomerProfileToVoucher" ADD CONSTRAINT "_CustomerProfileToVoucher_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerProfileToVoucher" ADD CONSTRAINT "_CustomerProfileToVoucher_B_fkey" FOREIGN KEY ("B") REFERENCES "Voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
