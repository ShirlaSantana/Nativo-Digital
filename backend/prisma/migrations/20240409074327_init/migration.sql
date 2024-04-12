-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `second_surname` VARCHAR(50) NOT NULL,
    `sex` ENUM('M', 'F') NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `cityOfOrigin` VARCHAR(191) NOT NULL,
    `enrollmentDate` DATETIME(3) NOT NULL,
    `hospitalID` INTEGER NOT NULL,
    `guardianFullName` VARCHAR(100) NOT NULL,
    `guardianPhone` VARCHAR(191) NOT NULL,
    
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hospital` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_hospitalID_fkey` FOREIGN KEY (`hospitalID`) REFERENCES `Hospital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
