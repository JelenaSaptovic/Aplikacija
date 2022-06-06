-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.24-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for piivt_app
DROP DATABASE IF EXISTS `piivt_app`;
CREATE DATABASE IF NOT EXISTS `piivt_app` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `piivt_app`;

-- Dumping structure for table piivt_app.ad
DROP TABLE IF EXISTS `ad`;
CREATE TABLE IF NOT EXISTS `ad` (
  `ad_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `price` decimal(10,2) unsigned NOT NULL DEFAULT 0.00,
  `flower_kind` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `country` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `life_span` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ad_id`),
  KEY `fk_ad_user_id` (`user_id`),
  CONSTRAINT `fk_ad_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table piivt_app.ad: ~8 rows (approximately)
INSERT INTO `ad` (`ad_id`, `title`, `description`, `expires_at`, `price`, `flower_kind`, `color`, `country`, `life_span`, `user_id`) VALUES
	(1, 'Prodajem sobni kaktus', 'Kaktusi su sukulentne biljke, to znači da imaju mesnate delove koji imaju funkciju čuvanja vode. Ne zahtevaju mnogo nege i veoma su laki za održavanje. ', '2022-06-01 20:50:17', 500.00, 'kaktus', 'zelena', 'Amerika', 'U zavisnosti od vrste mogu da žive od 10 do 200 godina.', 1),
	(2, 'Srećni bambus', '', '2022-06-01 20:54:27', 430.00, 'babmus', 'zelena', 'Kina', 'Prosečan bambus može da živi do 15 godina.', 2),
	(4, 'Prodajem fikus', 'Težina: 5.5kg', '2022-06-01 20:56:19', 8000.00, 'fikus', 'zelena', '/', 'Ako se pravilno održava, fikus može da živi i do 20 godina.', 4),
	(5, 'Sobna biljka - kafa', 'Kafa voli dosta indirektnog svetla, možete je postaviti na istočnu stranu gde će imati malo direktnog jutarnjeg sunca. Tokom leta može biti u dvorištu ili na terasi, u hladovini, a tokom zime bi najbolje bilo da bude na temperaturi od 16 do 18°C. Voli visoku vlažnost vazduha, a zalivanje umereno.', '2022-06-01 20:58:04', 550.00, 'kafa', 'svetlo zelena', 'Etiopija', 'Iako mogu da dožive i 100 godina, najproduktivnije su u dobi izmedju 7 i 20 godina.', 5),
	(6, 'Mozaik biljka / Fitonija', 'Potrebno je redovno umereno zalivanje destilovanom vodom, kišnicom ili odstajalom vodom koja treba da bude meka i sobne temperature. Zemlja između dva zalivanje ne treba da se potpuno osuši, već samo gornji sloj. Leti se zaliva dva do tri puta nedeljno, a zimi jednom. ', '2022-06-01 20:58:16', 300.00, 'fitonija', 'zelena/crvena', '/', '/', 5),
	(7, 'Livistona palma', ' ', '2022-06-01 21:00:49', 1000.00, 'palma', 'zelena', 'Zemlje tropske i subtropske klime.', 'Između 7 i 8 decenija.', 6),
	(8, 'Vestacko drvece', ' ', '2022-06-01 20:11:33', 3500.00, 'vestacko drvece', 'zelena', '', '', 1),
	(10, 'Primer 1', 'Primer 1', '2022-06-01 23:01:13', 580.00, 'skkasnkfank', 'primeeer', 'fnklnflkan', 'asmfklmaslkdmas', 7);

-- Dumping structure for table piivt_app.photo
DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `file_path` text COLLATE utf8_unicode_ci NOT NULL,
  `ad_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_file_path` (`file_path`) USING HASH,
  KEY `fk_photo_ad_id` (`ad_id`),
  CONSTRAINT `fk_photo_ad_id` FOREIGN KEY (`ad_id`) REFERENCES `ad` (`ad_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table piivt_app.photo: ~0 rows (approximately)

-- Dumping structure for table piivt_app.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `forename` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `activation_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_username` (`username`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_activation_code` (`activation_code`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table piivt_app.user: ~8 rows (approximately)
INSERT INTO `user` (`user_id`, `username`, `email`, `password_hash`, `forename`, `surname`, `is_active`, `activation_code`) VALUES
	(1, 'ekuzodia', 'jelena@gmail.com', '12345', 'Jelena', 'Šaptović', 1, '123-456'),
	(2, 'velika_s', 'fmisic@yahoo.com', 'padasneg', 'Filip', 'Mišić', 1, '789-562'),
	(4, 'choda', 'damljan@mail.com', 'ringring789', 'Damljan', 'Bojović', 1, '222-888'),
	(5, 'Milos456', 'milos.markovic11@gmail.com', '$2b$10$z1.lx3j651vA/z50U6zhbO2rZrUInJ1NEKHUk5J7nLijrUUy9Kyvy', 'Miloš', 'Marković', 0, '456-896'),
	(6, 'sofija_', 'sdjordjevic@mail.com', 'Qwerty', 'Sofija', 'Đorđević', 1, '012-856'),
	(7, 'zemin', 'dvdtmtjvc@mail.com', '$2b$10$eUT8g6Q57KuSYHe.sjiR7ufMWct.yMplpSj9xN/iPrGw4vogpFzu.', 'David', 'Timotijević', 0, '541-349'),
	(10, 'Igor111', 'uskokovic.igor@gmail.com', '$2b$10$UH.c2Wtl3.aDSaNB6U7F/OqOyBF25j47ZlgXqInsGXWEcn84topt6', 'Igor', 'Uskoković', 0, '741-963'),
	(12, 'flower_lover', 'milica.m@mail.com', '$2b$10$39i8yp1VHhllIZ7SayYPteiBklx2hc2BZatIH1Ld4Tj5WlJJODfKy', 'Milica', 'Milosavljević', 1, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
