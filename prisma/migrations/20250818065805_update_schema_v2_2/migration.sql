/*
  Warnings:

  - Added the required column `icon` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "icon" TEXT NOT NULL;
