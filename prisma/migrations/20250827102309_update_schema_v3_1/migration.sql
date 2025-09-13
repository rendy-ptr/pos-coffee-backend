/*
  Warnings:

  - You are about to drop the column `loyaltyPoints` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneAdmin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneCustomer` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneKasir` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `shiftEnd` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `shiftStart` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "icon" DROP NOT NULL;

-- AlterTable
ALTER TABLE "menus" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paymentMethod" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "loyaltyPoints",
DROP COLUMN "phoneAdmin",
DROP COLUMN "phoneCustomer",
DROP COLUMN "phoneKasir",
DROP COLUMN "shiftEnd",
DROP COLUMN "shiftStart",
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "customer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kasir_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shiftStart" TEXT,
    "shiftEnd" TEXT,
    "todaySales" INTEGER NOT NULL DEFAULT 0,
    "todayOrder" INTEGER NOT NULL DEFAULT 0,
    "totalOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "kasir_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "admin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_userId_key" ON "customer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "kasir_profiles_userId_key" ON "kasir_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_userId_key" ON "admin_profiles"("userId");

-- AddForeignKey
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kasir_profiles" ADD CONSTRAINT "kasir_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_profiles" ADD CONSTRAINT "admin_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
