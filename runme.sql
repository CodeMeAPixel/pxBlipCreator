CREATE TABLE IF NOT EXISTS `pxBlipCreator` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',
    `data` LONGTEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
    PRIMARY KEY (`id`) USING BTREE,
    INDEX `idx_name` (`name`)
) COLLATE='utf8mb4_unicode_ci' ENGINE=InnoDB;
