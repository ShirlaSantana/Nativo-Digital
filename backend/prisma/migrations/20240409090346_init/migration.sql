/*
  Warnings:

  - Added the required column `zipCode` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hospital` ADD COLUMN `zipCode` VARCHAR(191) NOT NULL;
