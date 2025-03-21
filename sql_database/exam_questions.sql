-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2025 at 05:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `exam_questions`
--

CREATE TABLE `exam_questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `part_id` varchar(255) NOT NULL,
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `question_bank_id` bigint(20) UNSIGNED NOT NULL,
  `question` varchar(255) DEFAULT NULL,
  `exam_id` bigint(20) UNSIGNED NOT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `score` decimal(8,2) NOT NULL DEFAULT 0.00,
  `negative_score` decimal(8,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_questions`
--

INSERT INTO `exam_questions` (`id`, `part_id`, `question_id`, `question_bank_id`, `question`, `exam_id`, `meta`, `score`, `negative_score`, `created_at`, `updated_at`) VALUES
(1, '1742294706102', 5, 3, '<p>Consider the following statements which explains the enhancement n-type MOSFET. Which of the following is/are correct?</p>', 1, '{\"options\":[{\"id\":16,\"question_id\":5,\"option\":\"<p><br>Substrate is of p-type and is of single crystal silicon wafer<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:17:04.000000Z\",\"updated_at\":\"2024-06-03T01:17:04.000000Z\"},{\"id\":17,\"question_id\":5,\"option\":\"<p><br>Substrate is of p-type and is of single crystal silicon wafer<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:17:04.000000Z\",\"updated_at\":\"2024-06-03T01:17:04.000000Z\"},{\"id\":18,\"question_id\":5,\"option\":\"<p><br>Substrate is of p-type and type b<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:17:04.000000Z\",\"updated_at\":\"2024-06-03T01:17:04.000000Z\"}],\"correctOption\":null,\"questionMeta\":{\"audioFile\":null,\"paragraph\":null,\"hint\":null,\"explanation\":null}}', 1.00, 0.50, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, '1742294706102', 6, 3, '<p>Consider the enhancement n-type MOSFET.Which of the following is/are correct with regards to channel formation?</p>', 1, '{\"options\":[{\"id\":19,\"question_id\":6,\"option\":\"<p><br>The induced n-region forms a channel in a p-type substrate<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:18:01.000000Z\",\"updated_at\":\"2024-06-03T01:18:01.000000Z\"},{\"id\":20,\"question_id\":6,\"option\":\"<p><br>The induced n-region forms a channel&nbsp;<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:18:01.000000Z\",\"updated_at\":\"2024-06-03T01:18:01.000000Z\"},{\"id\":21,\"question_id\":6,\"option\":\"<p>&nbsp;a channel in a p-type substrate<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:18:01.000000Z\",\"updated_at\":\"2024-06-03T01:18:01.000000Z\"}],\"correctOption\":null,\"questionMeta\":{\"audioFile\":null,\"paragraph\":null,\"hint\":null,\"explanation\":null}}', 1.00, 0.00, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, '1742294706102', 7, 3, '<p>The current in the enhancement n type MOSFET can be found by</p>', 1, '{\"options\":[{\"id\":22,\"question_id\":7,\"option\":\"<p><br>multiplying the charge per unit length by the electron drift velocity<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:19:18.000000Z\",\"updated_at\":\"2024-06-03T01:19:18.000000Z\"},{\"id\":23,\"question_id\":7,\"option\":\"<p><br>Adding the charge per unit length by the electron drift velocity<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:19:18.000000Z\",\"updated_at\":\"2024-06-03T01:19:18.000000Z\"},{\"id\":24,\"question_id\":7,\"option\":\"<p><br>dividing the charge per unit length by the electron drift velocity<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:19:18.000000Z\",\"updated_at\":\"2024-06-03T01:19:18.000000Z\"}],\"correctOption\":null,\"questionMeta\":{\"audioFile\":null,\"paragraph\":null,\"hint\":null,\"explanation\":null}}', 1.00, 0.50, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, '1742364909113', 5, 3, '<p>Consider the following statements which explains the enhancement n-type MOSFET. Which of the following is/are correct?</p>', 2, '{\"options\":[{\"id\":16,\"question_id\":5,\"option\":\"<p><br>Substrate is of p-type and is of single crystal silicon wafer<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:17:04.000000Z\",\"updated_at\":\"2024-06-03T01:17:04.000000Z\"},{\"id\":17,\"question_id\":5,\"option\":\"<p><br>Substrate is of p-type and is of single crystal silicon wafer<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:17:04.000000Z\",\"updated_at\":\"2024-06-03T01:17:04.000000Z\"},{\"id\":18,\"question_id\":5,\"option\":\"<p><br>Substrate is of p-type and type b<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:17:04.000000Z\",\"updated_at\":\"2024-06-03T01:17:04.000000Z\"}],\"correctOption\":null,\"questionMeta\":{\"audioFile\":null,\"paragraph\":null,\"hint\":null,\"explanation\":null}}', 1.00, 0.50, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, '1742364909113', 6, 3, '<p>Consider the enhancement n-type MOSFET.Which of the following is/are correct with regards to channel formation?</p>', 2, '{\"options\":[{\"id\":19,\"question_id\":6,\"option\":\"<p><br>The induced n-region forms a channel in a p-type substrate<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:18:01.000000Z\",\"updated_at\":\"2024-06-03T01:18:01.000000Z\"},{\"id\":20,\"question_id\":6,\"option\":\"<p><br>The induced n-region forms a channel&nbsp;<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:18:01.000000Z\",\"updated_at\":\"2024-06-03T01:18:01.000000Z\"},{\"id\":21,\"question_id\":6,\"option\":\"<p>&nbsp;a channel in a p-type substrate<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:18:01.000000Z\",\"updated_at\":\"2024-06-03T01:18:01.000000Z\"}],\"correctOption\":null,\"questionMeta\":{\"audioFile\":null,\"paragraph\":null,\"hint\":null,\"explanation\":null}}', 1.00, 0.00, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, '1742364909113', 7, 3, '<p>The current in the enhancement n type MOSFET can be found by</p>', 2, '{\"options\":[{\"id\":22,\"question_id\":7,\"option\":\"<p><br>multiplying the charge per unit length by the electron drift velocity<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:19:18.000000Z\",\"updated_at\":\"2024-06-03T01:19:18.000000Z\"},{\"id\":23,\"question_id\":7,\"option\":\"<p><br>Adding the charge per unit length by the electron drift velocity<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:19:18.000000Z\",\"updated_at\":\"2024-06-03T01:19:18.000000Z\"},{\"id\":24,\"question_id\":7,\"option\":\"<p><br>dividing the charge per unit length by the electron drift velocity<\\/p>\",\"is_correct\":0,\"created_at\":\"2024-06-03T01:19:18.000000Z\",\"updated_at\":\"2024-06-03T01:19:18.000000Z\"}],\"correctOption\":null,\"questionMeta\":{\"audioFile\":null,\"paragraph\":null,\"hint\":null,\"explanation\":null}}', 1.00, 0.50, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `exam_questions_exam_id_question_id_unique` (`exam_id`,`question_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exam_questions`
--
ALTER TABLE `exam_questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
