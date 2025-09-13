/*
  Warnings:

  - You are about to drop the column `profitMargin` on the `menus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `menus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "menus" DROP COLUMN "profitMargin",
ADD COLUMN     "profit" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "menus_name_key" ON "menus"("name");
