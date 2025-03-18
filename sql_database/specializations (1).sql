-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2025 at 11:19 AM
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
-- Table structure for table `specializations`
--

CREATE TABLE `specializations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `degree_type_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `specializations`
--

INSERT INTO `specializations` (`id`, `name`, `degree_type_id`, `created_at`, `updated_at`) VALUES
(1, 'Computer Science Engineering (CSE)', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(2, 'Information Technology (IT)', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(3, 'Mechanical Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(4, 'Civil Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(5, 'Electrical Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(6, 'Electronics and Communication Engineering (ECE)', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(7, 'Electrical and Electronics Engineering (EEE)', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(8, 'Aerospace Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(9, 'Automobile Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(10, 'Biotechnology', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(11, 'Chemical Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(12, 'Environmental Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(13, 'Petroleum Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(14, 'Mining Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(15, 'Production Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(16, 'Industrial Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(17, 'Instrumentation Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(18, 'Robotics Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(19, 'Software Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(20, 'Artificial Intelligence and Machine Learning (AI & ML)', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(21, 'Data Science and Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(22, 'Civil and Structural Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(23, 'Food Technology', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(24, 'Textile Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(25, 'Agricultural Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(26, 'Nanotechnology', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(27, 'Biomedical Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(28, 'Marine Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(29, 'Construction Technology', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(30, 'Renewable Energy Engineering', 3, '2025-03-05 06:53:34', '2025-03-05 06:53:34'),
(31, 'Computer Science Engineering (CSE)', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(32, 'Information Technology (IT)', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(33, 'Software Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(34, 'Data Science and Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(35, 'Artificial Intelligence (AI)', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(36, 'Machine Learning (ML)', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(37, 'Cybersecurity', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(38, 'Networking and Communication', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(39, 'VLSI Design (Very-Large-Scale Integration)', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(40, 'Embedded Systems', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(41, 'Electrical Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(42, 'Power Systems', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(43, 'Control Systems', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(44, 'Electronics and Communication Engineering (ECE)', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(45, 'Signal Processing', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(46, 'Wireless Communication', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(47, 'Robotics Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(48, 'Mechanical Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(49, 'Thermal Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(50, 'Manufacturing Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(51, 'Automobile Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(52, 'Structural Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(53, 'Geotechnical Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(54, 'Transportation Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(55, 'Construction Engineering and Management', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(56, 'Civil Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(57, 'Environmental Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(58, 'Water Resources Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(59, 'Chemical Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(60, 'Biotechnology', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(61, 'Biomedical Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(62, 'Nanotechnology', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(63, 'Materials Science and Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(64, 'Aerospace Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(65, 'Agricultural Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(66, 'Renewable Energy Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(67, 'Food Technology', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(68, 'Industrial Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(69, 'Engineering Design', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(70, 'Petroleum Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(71, 'Mining Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(72, 'Instrumentation Engineering', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(73, 'Structural and Construction Management', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47'),
(74, 'Cyber-Physical Systems', 5, '2025-03-05 06:53:47', '2025-03-05 06:53:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `specializations`
--
ALTER TABLE `specializations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `specializations`
--
ALTER TABLE `specializations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
