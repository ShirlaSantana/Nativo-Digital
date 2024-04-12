/*
  Warnings:

  - You are about to drop the column `hospitalID` on the `patient` table. All the data in the column will be lost.
  - Added the required column `IDHospital` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `patient` DROP FOREIGN KEY `Patient_hospitalID_fkey`;

-- AlterTable
ALTER TABLE `patient` DROP COLUMN `hospitalID`,
    ADD COLUMN `IDHospital` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_IDHospital_fkey` FOREIGN KEY (`IDHospital`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
