-- CreateTable
CREATE TABLE `photo_air_occcurrences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `occurrence_air_id` INTEGER NOT NULL,
    `path` VARCHAR(255) NOT NULL,

    INDEX `occurrence_air_id`(`occurrence_air_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photos_land_occurrences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `occurrence_land_id` INTEGER NOT NULL,
    `path` VARCHAR(255) NOT NULL,

    INDEX `occurrence_land_id`(`occurrence_land_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `occurrence_air` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_time` DATETIME(0) NOT NULL,
    `date_time_completion` DATETIME(0) NULL,
    `pilot_id` INTEGER NOT NULL,
    `address` TEXT NOT NULL,
    `zip_code` VARCHAR(20) NOT NULL,
    `street_direction` ENUM('Nordeste', 'Sudoeste', 'Sudeste', 'Noroeste') NOT NULL,
    `type` ENUM('Drenagem', 'BuracoNaRua', 'CalcadaIrregular', 'FioEmaranhado', 'MeioFio') NOT NULL,
    `zone` ENUM('Norte', 'Sul', 'Leste', 'Oeste', 'Centro', 'Expansao', 'SantaMaria') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('Pendente', 'Resolvido', 'EmAnalise', 'EmAndamento', 'EmFila') NOT NULL,
    `photo_start` VARCHAR(255) NOT NULL,
    `photo_final` VARCHAR(255) NULL,
    `latitude_coordinate` DECIMAL(10, 6) NOT NULL,
    `longitude_coordinate` DECIMAL(10, 6) NOT NULL,
    `description` TEXT NOT NULL,
    `is_active` INTEGER NOT NULL DEFAULT 1,
    `neighborhood` ENUM('Centro', 'Getúlio_Vargas', 'Cirurgia', 'Pereira_Lobo', 'Suíssa', 'Salgado_Filho', 'Treze_de_Julho', 'Dezoito_do_Forte', 'Palestina', 'Santo_Antônio', 'Industrial', 'Santos_Dumont', 'José_Conrado_de_Araújo', 'Novo_Paraíso', 'América', 'Siqueira_Campos', 'Soledade', 'Lamarão', 'Cidade_Nova', 'Japãozinho', 'Porto_Dantas', 'Bugio', 'Jardim_Centenário', 'Olaria', 'Capucho', 'Jabotiana', 'Ponto_Novo', 'Luzia', 'Grageru', 'Jardins', 'Inácio_Barbosa', 'São_Conrado', 'Farolândia', 'Coroa_do_Meio', 'Aeroporto', 'Atalaia', 'Santa_Maria', 'Zona_de_Expansão', 'São_José') NOT NULL,
    `width` DECIMAL(10, 2) NULL,
    `length` DECIMAL(10, 2) NULL,
    `observation` TEXT NULL,

    INDEX `pilot_id`(`pilot_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `occurrence_land` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_time` DATETIME(0) NOT NULL,
    `date_time_completion` DATETIME(0) NULL,
    `pilot_id` INTEGER NOT NULL,
    `address` TEXT NOT NULL,
    `zip_code` VARCHAR(20) NOT NULL,
    `street_direction` ENUM('Nordeste', 'Sudoeste', 'Sudeste', 'Noroeste') NOT NULL,
    `type` ENUM('Drenagem', 'BuracoNaRua', 'CalcadaIrregular', 'FioEmaranhado', 'MeioFio') NOT NULL,
    `zone` ENUM('Norte', 'Sul', 'Leste', 'Oeste', 'Centro', 'Expansao', 'SantaMaria') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('Pendente', 'Resolvido', 'EmAnalise', 'EmAndamento', 'EmFila') NOT NULL,
    `photo_start` VARCHAR(255) NOT NULL,
    `photo_final` VARCHAR(255) NULL,
    `latitude_coordinate` DECIMAL(10, 6) NOT NULL,
    `longitude_coordinate` DECIMAL(10, 6) NOT NULL,
    `description` TEXT NOT NULL,
    `is_active` INTEGER NOT NULL DEFAULT 1,
    `neighborhood` ENUM('Centro', 'Getúlio_Vargas', 'Cirurgia', 'Pereira_Lobo', 'Suíssa', 'Salgado_Filho', 'Treze_de_Julho', 'Dezoito_do_Forte', 'Palestina', 'Santo_Antônio', 'Industrial', 'Santos_Dumont', 'José_Conrado_de_Araújo', 'Novo_Paraíso', 'América', 'Siqueira_Campos', 'Soledade', 'Lamarão', 'Cidade_Nova', 'Japãozinho', 'Porto_Dantas', 'Bugio', 'Jardim_Centenário', 'Olaria', 'Capucho', 'Jabotiana', 'Ponto_Novo', 'Luzia', 'Grageru', 'Jardins', 'Inácio_Barbosa', 'São_Conrado', 'Farolândia', 'Coroa_do_Meio', 'Aeroporto', 'Atalaia', 'Santa_Maria', 'Zona_de_Expansão', 'São_José') NOT NULL,
    `observation` TEXT NULL,

    INDEX `pilot_id`(`pilot_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NOT NULL,
    `occurrence_air_id` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pilot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('Pendente', 'Resolvida', 'EmAnalise', 'EmAndamento') NOT NULL,
    `date_time` DATETIME(0) NOT NULL,
    `pilot_id` INTEGER NOT NULL,
    `land_occurrence_id` INTEGER NULL,
    `air_occurrence_id` INTEGER NULL,
    `occurrence_type` ENUM('Solo', 'Aerea') NOT NULL,
    `occurrence_type_land` ENUM('Drenagem', 'BuracoNaRua', 'CalcadaIrregular', 'FioEmaranhado', 'MeioFio') NULL,
    `occurrence_type_air` ENUM('BuracoNaRua', 'CalcadaIrregular', 'FioEmaranhado', 'MeioFio') NULL,
    `responsible_id` INTEGER NULL,
    `responsible_assigned_at` DATETIME(3) NULL,
    `random_code` INTEGER NULL,

    UNIQUE INDEX `service_order_random_code_key`(`random_code`),
    INDEX `idx_air_occurrence`(`air_occurrence_id`),
    INDEX `idx_land_occurrence`(`land_occurrence_id`),
    INDEX `pilot_id`(`pilot_id`),
    INDEX `idx_responsible`(`responsible_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `role` VARCHAR(100) NOT NULL,
    `avatar` VARCHAR(255) NULL,
    `is_active` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OTP` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `OTP_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reason` TEXT NOT NULL,
    `occurredAt` DATETIME(0) NOT NULL,
    `action` TEXT NOT NULL,
    `userId` INTEGER NULL,
    `ip` VARCHAR(45) NOT NULL,
    `route` VARCHAR(255) NOT NULL,
    `method` VARCHAR(10) NOT NULL,

    INDEX `idx_user`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `route` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pilotId` INTEGER NOT NULL,
    `latitude` DECIMAL(10, 6) NOT NULL,
    `longitude` DECIMAL(10, 6) NOT NULL,
    `date` DATETIME(0) NOT NULL,

    INDEX `idx_pilot`(`pilotId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photo_in_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `occurrence_air_id` INTEGER NULL,
    `path` VARCHAR(255) NOT NULL,
    `occurrence_land_id` INTEGER NULL,

    INDEX `occurrence_air_id`(`occurrence_air_id`),
    INDEX `occurrence_land_id`(`occurrence_land_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `photo_air_occcurrences` ADD CONSTRAINT `photo_air_occcurrences_occurrence_air_id_fkey` FOREIGN KEY (`occurrence_air_id`) REFERENCES `occurrence_air`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photos_land_occurrences` ADD CONSTRAINT `photos_land_occurrences_occurrence_land_id_fkey` FOREIGN KEY (`occurrence_land_id`) REFERENCES `occurrence_land`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `occurrence_air` ADD CONSTRAINT `occurrence_air_ibfk_1` FOREIGN KEY (`pilot_id`) REFERENCES `pilot`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `occurrence_land` ADD CONSTRAINT `occurrence_land_ibfk_1` FOREIGN KEY (`pilot_id`) REFERENCES `pilot`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `video` ADD CONSTRAINT `video_occurrence_air_id_fkey` FOREIGN KEY (`occurrence_air_id`) REFERENCES `occurrence_air`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_order` ADD CONSTRAINT `service_order_ibfk_1` FOREIGN KEY (`pilot_id`) REFERENCES `pilot`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `service_order` ADD CONSTRAINT `service_order_ibfk_2` FOREIGN KEY (`land_occurrence_id`) REFERENCES `occurrence_land`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `service_order` ADD CONSTRAINT `service_order_ibfk_3` FOREIGN KEY (`air_occurrence_id`) REFERENCES `occurrence_air`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `service_order` ADD CONSTRAINT `service_order_responsible_id_fkey` FOREIGN KEY (`responsible_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OTP` ADD CONSTRAINT `OTP_email_fkey` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `log_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `route` ADD CONSTRAINT `route_pilotId_fkey` FOREIGN KEY (`pilotId`) REFERENCES `pilot`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `photo_in_progress` ADD CONSTRAINT `photo_in_progress_occurrence_air_id_fkey` FOREIGN KEY (`occurrence_air_id`) REFERENCES `occurrence_air`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photo_in_progress` ADD CONSTRAINT `photo_in_progress_occurrence_land_id_fkey` FOREIGN KEY (`occurrence_land_id`) REFERENCES `occurrence_land`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
