-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 11, 2025 at 06:04 AM
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
-- Table structure for table `student_education`
--

CREATE TABLE `student_education` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `degree_type_id` bigint(20) UNSIGNED NOT NULL,
  `specialization_id` bigint(20) UNSIGNED NOT NULL,
  `other_specialization` varchar(255) DEFAULT NULL,
  `percentage_cgpa` decimal(8,2) NOT NULL,
  `institute_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `duration_from` varchar(255) NOT NULL,
  `duration_to` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_education`
--

INSERT INTO `student_education` (`id`, `user_id`, `degree_type_id`, `specialization_id`, `other_specialization`, `percentage_cgpa`, `institute_name`, `location`, `duration_from`, `duration_to`, `created_at`, `updated_at`) VALUES
(1, 70, 3, 7, 'AI Engineering', 85.50, 'MIT', 'Boston', '2020-09-01', '2024-06-30', '2025-03-05 07:13:23', '2025-03-06 06:20:38'),
(6, 70, 3, 1, NULL, 85.50, 'du university', 'delhi', '2020-06-01', '2024-05-31', '2025-03-05 10:25:22', '2025-03-05 10:25:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `student_education`
--
ALTER TABLE `student_education`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `student_education`
--
ALTER TABLE `student_education`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
