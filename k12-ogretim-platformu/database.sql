-- K12 Öğretim Platformu Veritabanı
-- Tarih: 2025-10-18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `k12_platform` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `k12_platform`;

-- Tablo: schools
CREATE TABLE `schools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `schools` (`id`, `name`, `city`) VALUES
(1, 'Ankara Fen Lisesi', 'Ankara'),
(2, 'Atatürk Anadolu Lisesi', 'Ankara'),
(3, 'Gazi Anadolu Lisesi', 'Ankara'),
(4, 'Mehmet Emin Resulzade Anadolu Lisesi', 'Ankara'),
(5, 'Dr. Binnaz Ege-Dr. Rıdvan Ege Anadolu Lisesi', 'Ankara'),
(6, 'Cumhuriyet Fen Lisesi', 'Ankara'),
(7, 'Betül Can Anadolu Lisesi', 'Ankara'),
(8, 'Yenimahalle Fen Lisesi', 'Ankara');
(9, 'Hacı Ömer Tarman Anadolu Lisesi', 'Ankara');

-- Tablo: users
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','teacher','admin') NOT NULL DEFAULT 'student',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `school_id` (`school_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `school_id`, `fullname`, `email`, `password`, `role`) VALUES
(1, 1, 'Ali Veli', 'ali.veli@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');

-- Tablo: exams
CREATE TABLE `exams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `exam_date` date NOT NULL,
  `total_questions` int(11) DEFAULT 120,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `exams` (`id`, `name`, `exam_date`, `total_questions`) VALUES
(1, 'ÖZDEBİR - TG TYT - İLK PROVA', '2025-10-03', 120),
(2, 'TOPRAK - TYT - 1', '2025-09-15', 120);

-- Tablo: exam_results
CREATE TABLE `exam_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `total_net` decimal(5,2) NOT NULL,
  `total_score` decimal(7,3) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `exam_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exam_results_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `exam_results` (`user_id`, `exam_id`, `total_net`, `total_score`) VALUES
(1, 1, '84.00', '453.630'),
(1, 2, '55.50', '369.430');

COMMIT;
