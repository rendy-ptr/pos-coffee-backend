/*
  Warnings:

  - The primary key for the `tables` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `number` on the `tables` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tables" DROP CONSTRAINT "tables_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "number",
ADD COLUMN     "number" INTEGER NOT NULL,
ADD CONSTRAINT "tables_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tables_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "tables_number_key" ON "tables"("number");
