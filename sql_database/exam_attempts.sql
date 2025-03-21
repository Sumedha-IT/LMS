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
-- Table structure for table `exam_attempts`
--

CREATE TABLE `exam_attempts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `exam_id` bigint(20) UNSIGNED NOT NULL,
  `attempt_count` int(11) NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL,
  `ends_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `score` varchar(255) DEFAULT NULL,
  `report` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`report`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_attempts`
--

INSERT INTO `exam_attempts` (`id`, `student_id`, `exam_id`, `attempt_count`, `status`, `ends_at`, `score`, `report`, `created_at`, `updated_at`) VALUES
(1, 70, 1, 1, 'completed', '2025-03-18 10:51:10', '-1', '{\"aggregateReport\":{\"totalMarksObtained\":-1,\"totalQuestions\":3,\"maxMarks\":3,\"totalAttemptedCount\":3,\"notAnswered\":0,\"answeredAndMarkForReview\":0,\"markForReview\":0,\"wrong\":2,\"correct\":0,\"skippedQuestions\":0,\"accuracy\":0,\"percentage\":-33.33333333333333,\"grade\":\"F\"},\"partWiseReport\":[{\"partId\":\"1742294706102\",\"marksObtained\":-1,\"totalQuestions\":3,\"maxMarksForSection\":3,\"totalAttempedCount\":3,\"notAnswered\":0,\"answeredAndMarkForReview\":0,\"markForReview\":0,\"wrong\":2,\"correct\":0,\"skippedQuestions\":0}],\"timeTaken\":\"00:00\"}', '2025-03-18 10:50:29', '2025-03-18 10:51:10'),
(2, 70, 2, 1, 'completed', '2025-03-19 06:16:24', '-1', '{\"aggregateReport\":{\"totalMarksObtained\":-1,\"totalQuestions\":3,\"maxMarks\":3,\"totalAttemptedCount\":3,\"notAnswered\":0,\"answeredAndMarkForReview\":0,\"markForReview\":0,\"wrong\":2,\"correct\":0,\"skippedQuestions\":0,\"accuracy\":0,\"percentage\":-33.33333333333333,\"grade\":\"F\"},\"partWiseReport\":[{\"partId\":\"1742364909113\",\"marksObtained\":-1,\"totalQuestions\":3,\"maxMarksForSection\":3,\"totalAttempedCount\":3,\"notAnswered\":0,\"answeredAndMarkForReview\":0,\"markForReview\":0,\"wrong\":2,\"correct\":0,\"skippedQuestions\":0}],\"timeTaken\":\"00:00\"}', '2025-03-19 06:15:55', '2025-03-19 06:16:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exam_attempts`
--
ALTER TABLE `exam_attempts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exam_attempts`
--
ALTER TABLE `exam_attempts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
