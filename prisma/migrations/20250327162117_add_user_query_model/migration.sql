-- CreateTable
CREATE TABLE `UserQuery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` TEXT NOT NULL,
    `sqlQuery` TEXT NOT NULL,
    `result` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
