-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2025 at 05:57 AM
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
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `total_marks` int(11) NOT NULL DEFAULT 0,
  `max_attempts` int(11) NOT NULL DEFAULT 10,
  `instructions` text DEFAULT NULL,
  `starts_at` varchar(255) NOT NULL,
  `ends_at` varchar(255) NOT NULL,
  `exam_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `immediate_result` tinyint(1) NOT NULL,
  `batch_id` bigint(20) UNSIGNED NOT NULL,
  `invigilators` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`invigilators`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `curriculums` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`curriculums`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `title`, `total_marks`, `max_attempts`, `instructions`, `starts_at`, `ends_at`, `exam_date`, `immediate_result`, `batch_id`, `invigilators`, `created_at`, `updated_at`, `curriculums`) VALUES
(1, 'test', 3, 1, 'hi', '16:20', '16:25', '2025-03-18 10:45:23', 1, 27, '[{\"name\":\"tutor\",\"id\":3,\"phone\":\"9876543210\",\"email\":\"tutor@mylearning.live\"}]', '2025-03-18 10:45:05', '2025-03-18 10:45:23', NULL),
(2, 'test exam', 3, 1, 'testing', '11:45', '11:50', '2025-03-19 10:19:11', 1, 27, '[{\"name\":\"NIshant Tutor\",\"id\":10,\"phone\":\"9876543210\",\"email\":\"nishant+tutor@theargusconsulting.com\"}]', '2025-03-19 06:15:08', '2025-03-19 06:15:21', '[{\"id\":62,\"name\":\"SL_Test\"},{\"id\":80,\"name\":\"CMOS Fundamentals (CF)\"}]'),
(3, 'how', 0, 1, 'ok', '17:35', '18:40', '2025-03-19 10:18:59', 1, 27, '[{\"name\":\"tutor\",\"id\":3,\"phone\":\"9876543210\",\"email\":\"tutor@mylearning.live\"}]', '2025-03-19 06:52:46', '2025-03-19 06:52:46', '[{\"id\":62,\"name\":\"SL_Test\"},{\"id\":80,\"name\":\"CMOS Fundamentals (CF)\"}]'),
(4, 'work', 0, 1, 'work', '00:00', '01:00', '2025-03-18 18:30:00', 1, 27, '[{\"name\":\"tutor\",\"id\":3,\"phone\":\"9876543210\",\"email\":\"tutor@mylearning.live\"}]', '2025-03-19 09:41:25', '2025-03-19 09:41:25', '[{\"id\":62,\"name\":\"SL_Test\"},{\"id\":80,\"name\":\"CMOS Fundamentals (CF)\"}]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `exams_title_batch_id_unique` (`title`,`batch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
