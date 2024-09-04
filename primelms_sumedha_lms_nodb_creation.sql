-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 04, 2024 at 09:04 PM
-- Server version: 10.6.18-MariaDB-cll-lve
-- PHP Version: 8.1.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `primelms_sumedha_lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `visibility` varchar(255) NOT NULL,
  `audience` varchar(255) NOT NULL,
  `team_id` bigint(20) NOT NULL DEFAULT 1,
  `course_id` bigint(20) DEFAULT NULL,
  `batch_ids` text DEFAULT NULL,
  `schedule_at` datetime DEFAULT NULL,
  `sent` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `description`, `image`, `visibility`, `audience`, `team_id`, `course_id`, `batch_ids`, `schedule_at`, `sent`, `created_at`, `updated_at`) VALUES
(1, 'First Announcement', 'Loren Ipsum...Loren Ipsum...Loren Ipsum...Loren Ipsum...Loren Ipsum...Loren Ipsum...', '01HYG2JM43AGWPDA6NP1ED82XE.jpg', 'existing_user', 'all', 1, NULL, NULL, '2024-05-22 11:20:42', 1, '2024-05-22 05:50:52', '2024-05-22 06:27:23'),
(2, 'hello', 'why ', NULL, 'existing_user', 'all', 1, NULL, NULL, '2024-05-22 17:38:30', 1, '2024-05-22 06:37:34', '2024-05-22 12:09:04'),
(3, 'hello', 'test1', NULL, 'existing_user', 'all', 1, NULL, NULL, '2024-05-22 12:10:14', 1, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
(4, 'Happy Kanuma', 'Happy Sankranthi', '01HYJA1TCWN71J46NVDW7TCVZP.png', 'existing_user', 'all', 1, NULL, NULL, '2024-05-23 14:20:00', 1, '2024-05-23 03:14:16', '2024-05-23 08:50:04'),
(5, 'Happy thursday', '1', '01HYJADR7N1GXSA4TVYS5F1HD4.png', 'existing_user', 'all', 1, NULL, NULL, '2024-05-23 15:30:29', 1, '2024-05-23 03:22:32', '2024-05-23 10:01:05'),
(6, 'test', 'testing', NULL, 'both', 'course_wise', 1, 4, '1,11', '2024-05-27 11:45:05', 1, '2024-05-27 06:16:46', '2024-05-27 06:16:46'),
(7, 'Test 2805 - V', 'Test 2805 - V Desc', '01HYYXNGN2KSF4SAXWSBTKWEMK.jpg', 'existing_user', 'all', 1, NULL, NULL, '2024-05-28 18:18:13', 1, '2024-05-28 00:49:41', '2024-05-28 12:49:04'),
(8, 'Test 0506', 'Test announcement', '01HZKW307K4R3XFZ8EV3CQVG66.jpg', 'existing_user', 'all', 1, NULL, NULL, '2024-06-05 09:35:24', 1, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
(9, 'Test 0606', 'Test 0606', '01HZKW5F59NQAWJX06C7E4984E.jpg', 'existing_user', 'all', 1, NULL, NULL, '2024-06-06 09:37:01', 1, '2024-06-05 04:07:30', '2024-06-06 04:07:04');

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `attendance_by` bigint(20) NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `date`, `user_id`, `attendance_by`, `team_id`, `created_at`, `updated_at`) VALUES
(1, '2024-05-07', 1, 1, 1, '2024-05-07 06:55:40', '2024-05-07 06:55:40'),
(3, '2024-05-09', 4, 1, 1, '2024-05-09 03:05:04', '2024-05-09 03:05:04'),
(5, '2024-05-11', 40, 1, 1, '2024-05-10 06:47:12', '2024-05-10 06:47:12'),
(7, '2024-06-15', 61, 61, 1, '2024-06-15 01:49:43', '2024-06-15 01:49:43'),
(8, '2024-06-15', 60, 61, 1, '2024-06-15 02:32:32', '2024-06-15 02:32:32');

-- --------------------------------------------------------

--
-- Table structure for table `authentication_log`
--

CREATE TABLE `authentication_log` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `authenticatable_type` varchar(255) NOT NULL,
  `authenticatable_id` bigint(20) UNSIGNED NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `login_at` timestamp NULL DEFAULT NULL,
  `login_successful` tinyint(1) NOT NULL DEFAULT 0,
  `logout_at` timestamp NULL DEFAULT NULL,
  `cleared_by_user` tinyint(1) NOT NULL DEFAULT 0,
  `location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `authentication_log`
--

INSERT INTO `authentication_log` (`id`, `authenticatable_type`, `authenticatable_id`, `ip_address`, `user_agent`, `login_at`, `login_successful`, `logout_at`, `cleared_by_user`, `location`, `team_id`) VALUES
(1, 'App\\Models\\User', 1, '106.213.172.159', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', NULL, 0, '2024-03-28 22:26:06', 0, NULL, NULL),
(2, 'App\\Models\\User', 1, '106.213.172.159', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-03-28 22:26:09', 1, '2024-03-28 22:26:37', 0, NULL, NULL),
(3, 'App\\Models\\User', 1, '106.213.172.159', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-03-28 22:27:26', 1, '2024-03-28 22:28:26', 0, NULL, NULL),
(4, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-03-29 03:12:04', 1, NULL, 0, NULL, NULL),
(5, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-01 12:11:50', 1, NULL, 0, NULL, NULL),
(6, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-01 12:13:14', 1, '2024-04-01 12:13:25', 0, NULL, NULL),
(7, 'App\\Models\\User', 1, '122.161.51.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-01 13:45:45', 1, NULL, 0, NULL, NULL),
(8, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-02 13:31:25', 1, NULL, 0, NULL, NULL),
(9, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-02 15:36:57', 1, NULL, 0, NULL, NULL),
(10, 'App\\Models\\User', 1, '81.17.122.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-02 16:24:38', 1, NULL, 0, NULL, NULL),
(11, 'App\\Models\\User', 1, '122.161.51.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-02 19:26:59', 1, NULL, 0, NULL, NULL),
(12, 'App\\Models\\User', 1, '81.17.122.64', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-03 02:33:42', 1, NULL, 0, NULL, NULL),
(13, 'App\\Models\\User', 11, '81.17.122.64', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-03 05:40:11', 1, NULL, 0, NULL, NULL),
(14, 'App\\Models\\User', 1, '81.17.122.64', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-03 05:44:44', 1, NULL, 0, NULL, NULL),
(15, 'App\\Models\\User', 1, '81.17.122.64', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-04 03:04:22', 1, NULL, 0, NULL, NULL),
(16, 'App\\Models\\User', 1, '122.161.51.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-05 11:43:10', 1, NULL, 0, NULL, NULL),
(17, 'App\\Models\\User', 1, '146.70.238.187', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-06 12:49:51', 1, NULL, 0, NULL, NULL),
(18, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-06 18:43:24', 1, NULL, 0, NULL, NULL),
(19, 'App\\Models\\User', 1, '122.161.51.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-08 12:15:48', 1, '2024-04-08 13:25:25', 0, NULL, NULL),
(20, 'App\\Models\\User', 1, '122.161.51.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-08 13:25:35', 1, '2024-04-08 13:26:12', 0, NULL, NULL),
(21, 'App\\Models\\User', 1, '122.161.51.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-08 13:26:23', 0, NULL, 0, NULL, NULL),
(22, 'App\\Models\\User', 1, '122.161.51.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-08 13:26:31', 1, NULL, 0, NULL, NULL),
(23, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-09 13:35:30', 1, NULL, 0, NULL, NULL),
(24, 'App\\Models\\User', 11, '103.85.11.169', 'PostmanRuntime/7.37.0', '2024-04-09 13:40:21', 1, NULL, 0, NULL, NULL),
(25, 'App\\Models\\User', 11, '103.85.11.169', 'PostmanRuntime/7.37.0', '2024-04-09 13:53:33', 1, NULL, 0, NULL, NULL),
(26, 'App\\Models\\User', 11, '49.36.189.48', 'PostmanRuntime/7.37.0', '2024-04-09 13:57:20', 1, NULL, 0, NULL, NULL),
(27, 'App\\Models\\User', 11, '152.58.35.22', 'PostmanRuntime/7.37.3', '2024-04-09 19:10:01', 1, NULL, 0, NULL, NULL),
(28, 'App\\Models\\User', 11, '152.58.35.22', 'PostmanRuntime/7.37.3', '2024-04-09 19:11:01', 1, NULL, 0, NULL, NULL),
(29, 'App\\Models\\User', 1, '106.195.79.6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-10 19:50:47', 1, NULL, 0, NULL, NULL),
(30, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-04-10 23:08:54', 1, NULL, 0, NULL, NULL),
(31, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-04-10 23:09:47', 1, NULL, 0, NULL, NULL),
(32, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-04-10 23:10:30', 1, NULL, 0, NULL, NULL),
(33, 'App\\Models\\User', 11, '49.36.189.48', 'PostmanRuntime/7.37.3', '2024-04-10 23:11:37', 1, NULL, 0, NULL, NULL),
(34, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-04-10 23:12:27', 1, NULL, 0, NULL, NULL),
(35, 'App\\Models\\User', 11, '49.36.189.48', 'PostmanRuntime/7.37.3', '2024-04-10 23:12:41', 1, NULL, 0, NULL, NULL),
(36, 'App\\Models\\User', 11, '49.36.189.48', 'PostmanRuntime/7.37.3', '2024-04-10 23:12:45', 1, NULL, 0, NULL, NULL),
(37, 'App\\Models\\User', 11, '49.36.189.48', 'PostmanRuntime/7.37.3', '2024-04-10 23:12:47', 1, NULL, 0, NULL, NULL),
(38, 'App\\Models\\User', 11, '49.36.189.48', 'PostmanRuntime/7.37.3', '2024-04-10 23:12:50', 1, NULL, 0, NULL, NULL),
(39, 'App\\Models\\User', 11, '49.36.189.48', 'PostmanRuntime/7.37.3', '2024-04-10 23:12:52', 1, NULL, 0, NULL, NULL),
(40, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-04-10 23:12:58', 1, NULL, 0, NULL, NULL),
(41, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-04-10 23:30:40', 1, NULL, 0, NULL, NULL),
(42, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-04-10 23:35:54', 1, NULL, 0, NULL, NULL),
(43, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-04-10 23:36:02', 1, NULL, 0, NULL, NULL),
(44, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-04-11 11:21:00', 1, NULL, 0, NULL, NULL),
(45, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-04-11 11:23:15', 1, NULL, 0, NULL, NULL),
(46, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-11 12:04:42', 1, NULL, 0, NULL, NULL),
(47, 'App\\Models\\User', 1, '103.248.94.160', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-11 12:17:23', 1, NULL, 0, NULL, NULL),
(48, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-04-11 14:28:15', 1, NULL, 0, NULL, NULL),
(49, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-11 14:50:56', 1, NULL, 0, NULL, NULL),
(50, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-04-11 15:01:33', 0, NULL, 0, NULL, NULL),
(51, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-04-11 15:01:38', 1, NULL, 0, NULL, NULL),
(52, 'App\\Models\\User', 1, '81.17.122.145', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-11 23:53:57', 1, NULL, 0, NULL, NULL),
(53, 'App\\Models\\User', 1, '106.205.212.153', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-16 01:13:32', 1, '2024-04-16 01:15:04', 0, NULL, NULL),
(54, 'App\\Models\\User', 1, '106.205.212.153', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-16 01:15:09', 1, '2024-04-16 01:38:22', 0, NULL, NULL),
(55, 'App\\Models\\User', 11, '106.205.212.153', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-16 01:39:59', 1, NULL, 0, NULL, NULL),
(56, 'App\\Models\\User', 11, '49.36.189.168', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36', '2024-04-16 07:07:19', 1, NULL, 0, NULL, NULL),
(57, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-16 08:52:14', 1, NULL, 0, NULL, NULL),
(58, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-16 08:52:30', 1, NULL, 0, NULL, NULL),
(59, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-16 12:18:36', 1, NULL, 0, NULL, NULL),
(60, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-16 12:35:23', 1, NULL, 0, NULL, NULL),
(61, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-16 23:33:57', 1, '2024-04-17 00:02:50', 0, NULL, NULL),
(62, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-17 00:03:05', 1, '2024-04-17 00:10:00', 0, NULL, NULL),
(63, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-17 00:10:04', 1, '2024-04-17 00:13:43', 0, NULL, NULL),
(64, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-17 00:13:46', 1, NULL, 0, NULL, NULL),
(65, 'App\\Models\\User', 11, '49.36.189.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0', '2024-04-17 00:34:33', 1, NULL, 0, NULL, NULL),
(66, 'App\\Models\\User', 11, '49.36.189.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-17 05:11:55', 1, NULL, 0, NULL, NULL),
(67, 'App\\Models\\User', 11, '49.36.189.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-17 23:14:04', 1, NULL, 0, NULL, NULL),
(68, 'App\\Models\\User', 1, '49.47.71.144', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-17 23:50:00', 1, NULL, 0, NULL, NULL),
(69, 'App\\Models\\User', 1, '103.106.21.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-18 01:54:03', 1, NULL, 0, NULL, NULL),
(70, 'App\\Models\\User', 11, '223.179.128.194', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-18 02:56:15', 1, '2024-04-18 02:57:02', 0, NULL, NULL),
(71, 'App\\Models\\User', 1, '223.179.128.194', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-18 02:57:16', 1, NULL, 0, NULL, NULL),
(72, 'App\\Models\\User', 11, '103.85.11.169', 'PostmanRuntime/7.37.3', '2024-04-18 22:55:51', 1, NULL, 0, NULL, NULL),
(73, 'App\\Models\\User', 11, '103.85.11.169', 'PostmanRuntime/7.37.3', '2024-04-18 23:06:30', 1, NULL, 0, NULL, NULL),
(74, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-18 23:08:14', 1, NULL, 0, NULL, NULL),
(75, 'App\\Models\\User', 11, '49.36.189.168', 'PostmanRuntime/7.37.3', '2024-04-18 23:29:21', 1, NULL, 0, NULL, NULL),
(76, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36', '2024-04-19 00:24:26', 1, NULL, 0, NULL, NULL),
(77, 'App\\Models\\User', 11, '49.36.189.168', 'PostmanRuntime/7.37.3', '2024-04-19 00:34:12', 1, NULL, 0, NULL, NULL),
(78, 'App\\Models\\User', 1, '152.58.115.154', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-19 01:43:59', 1, NULL, 0, NULL, NULL),
(79, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-04-19 02:19:54', 1, NULL, 0, NULL, NULL),
(80, 'App\\Models\\User', 11, '103.106.21.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-19 05:39:17', 1, NULL, 0, NULL, NULL),
(81, 'App\\Models\\User', 11, '106.208.21.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-19 05:42:02', 1, NULL, 0, NULL, NULL),
(82, 'App\\Models\\User', 11, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-20 04:54:01', 1, NULL, 0, NULL, NULL),
(83, 'App\\Models\\User', 1, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-21 22:18:05', 1, NULL, 0, NULL, NULL),
(84, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 00:11:20', 1, NULL, 0, NULL, NULL),
(85, 'App\\Models\\User', 1, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 00:27:41', 1, '2024-04-22 01:03:20', 0, NULL, NULL),
(86, 'App\\Models\\User', 40, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 01:03:33', 1, '2024-04-22 01:10:40', 0, NULL, NULL),
(87, 'App\\Models\\User', 1, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 01:11:55', 1, '2024-04-22 01:21:09', 0, NULL, NULL),
(88, 'App\\Models\\User', 40, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 01:15:48', 1, '2024-04-22 01:29:34', 0, NULL, NULL),
(89, 'App\\Models\\User', 11, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 01:21:34', 1, '2024-04-22 01:22:23', 0, NULL, NULL),
(90, 'App\\Models\\User', 1, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 01:22:44', 1, NULL, 0, NULL, NULL),
(91, 'App\\Models\\User', 1, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 01:30:18', 1, NULL, 0, NULL, NULL),
(92, 'App\\Models\\User', 11, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 01:38:43', 1, NULL, 0, NULL, NULL),
(93, 'App\\Models\\User', 11, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 01:58:44', 1, '2024-04-22 01:59:23', 0, NULL, NULL),
(94, 'App\\Models\\User', 40, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 01:59:35', 1, NULL, 0, NULL, NULL),
(95, 'App\\Models\\User', 11, '146.70.238.182', 'PostmanRuntime/7.37.3', '2024-04-22 02:06:42', 1, NULL, 0, NULL, NULL),
(96, 'App\\Models\\User', 11, '49.36.189.168', 'PostmanRuntime/7.37.3', '2024-04-22 02:07:25', 1, NULL, 0, NULL, NULL),
(97, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-04-22 02:08:31', 1, NULL, 0, NULL, NULL),
(98, 'App\\Models\\User', 40, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 02:38:51', 1, NULL, 0, NULL, NULL),
(99, 'App\\Models\\User', 11, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 04:23:06', 1, '2024-04-22 04:24:20', 0, NULL, NULL),
(100, 'App\\Models\\User', 1, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 04:26:14', 0, NULL, 0, NULL, NULL),
(101, 'App\\Models\\User', 1, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 04:26:20', 0, NULL, 0, NULL, NULL),
(102, 'App\\Models\\User', 1, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 04:29:12', 1, NULL, 0, NULL, NULL),
(103, 'App\\Models\\User', 11, '49.206.57.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 05:08:43', 1, NULL, 0, NULL, NULL),
(104, 'App\\Models\\User', 1, '49.206.57.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 05:24:45', 1, NULL, 0, NULL, NULL),
(105, 'App\\Models\\User', 1, '49.47.68.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 09:34:45', 1, NULL, 0, NULL, NULL),
(106, 'App\\Models\\User', 1, '146.70.238.166', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-22 23:55:22', 1, NULL, 0, NULL, NULL),
(107, 'App\\Models\\User', 11, '49.36.191.74', 'okhttp/4.9.2', '2024-04-23 00:57:36', 1, NULL, 0, NULL, NULL),
(108, 'App\\Models\\User', 11, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-23 04:14:22', 1, NULL, 0, NULL, NULL),
(109, 'App\\Models\\User', 1, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-23 04:14:46', 1, NULL, 0, NULL, NULL),
(110, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-23 04:19:41', 1, '2024-04-23 06:12:35', 0, NULL, NULL),
(111, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-04-23 06:12:43', 1, '2024-04-23 06:13:06', 0, NULL, NULL),
(112, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-23 15:56:15', 1, NULL, 0, NULL, NULL),
(113, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-04-23 23:43:33', 1, NULL, 0, NULL, NULL),
(114, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-23 23:49:56', 1, '2024-04-23 23:50:34', 0, NULL, NULL),
(115, 'App\\Models\\User', 1, '49.36.191.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0', '2024-04-23 23:50:57', 1, NULL, 0, NULL, NULL),
(116, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-23 23:50:58', 1, NULL, 0, NULL, NULL),
(117, 'App\\Models\\User', 1, '49.47.70.98', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-23 23:51:10', 1, '2024-04-24 01:12:13', 0, NULL, NULL),
(118, 'App\\Models\\User', 11, '49.47.70.98', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-24 01:13:01', 1, '2024-04-24 01:15:30', 0, NULL, NULL),
(119, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-04-24 01:42:00', 1, NULL, 0, NULL, NULL),
(120, 'App\\Models\\User', 11, '49.36.191.74', 'okhttp/4.9.2', '2024-04-24 02:27:30', 1, NULL, 0, NULL, NULL),
(121, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-04-24 02:37:40', 1, NULL, 0, NULL, NULL),
(122, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-04-24 05:17:47', 1, NULL, 0, NULL, NULL),
(123, 'App\\Models\\User', 11, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-24 06:39:57', 1, '2024-04-24 06:46:14', 0, NULL, NULL),
(124, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-24 06:46:17', 1, NULL, 0, NULL, NULL),
(125, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-25 04:07:28', 1, NULL, 0, NULL, NULL),
(126, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-25 07:14:16', 1, NULL, 0, NULL, NULL),
(127, 'App\\Models\\User', 11, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-25 23:31:29', 1, NULL, 0, NULL, NULL),
(128, 'App\\Models\\User', 11, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-26 00:39:48', 1, NULL, 0, NULL, NULL),
(129, 'App\\Models\\User', 1, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-26 00:40:21', 0, NULL, 0, NULL, NULL),
(130, 'App\\Models\\User', 1, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-26 00:40:26', 1, NULL, 0, NULL, NULL),
(131, 'App\\Models\\User', 11, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-26 00:42:11', 1, NULL, 0, NULL, NULL),
(132, 'App\\Models\\User', 11, '183.82.3.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-26 00:42:28', 1, NULL, 0, NULL, NULL),
(133, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-26 01:52:01', 1, NULL, 0, NULL, NULL),
(134, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-04-26 04:25:27', 1, NULL, 0, NULL, NULL),
(135, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-04-26 04:29:23', 1, NULL, 0, NULL, NULL),
(136, 'App\\Models\\User', 1, '49.47.69.110', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-28 06:03:45', 1, NULL, 0, NULL, NULL),
(137, 'App\\Models\\User', 11, '49.36.191.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-28 23:23:40', 1, NULL, 0, NULL, NULL),
(138, 'App\\Models\\User', 1, '82.197.77.218', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-29 00:37:29', 1, NULL, 0, NULL, NULL),
(139, 'App\\Models\\User', 1, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-29 02:18:58', 1, NULL, 0, NULL, NULL),
(140, 'App\\Models\\User', 11, '49.36.191.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-29 06:08:26', 1, NULL, 0, NULL, NULL),
(141, 'App\\Models\\User', 1, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-29 22:42:15', 1, NULL, 0, NULL, NULL),
(142, 'App\\Models\\User', 11, '49.36.191.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-29 23:59:37', 1, NULL, 0, NULL, NULL),
(143, 'App\\Models\\User', 11, '49.36.191.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0', '2024-04-30 00:37:10', 1, NULL, 0, NULL, NULL),
(144, 'App\\Models\\User', 1, '103.106.21.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-30 05:34:46', 1, NULL, 0, NULL, NULL),
(145, 'App\\Models\\User', 11, '49.36.191.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-30 06:07:32', 1, NULL, 0, NULL, NULL),
(146, 'App\\Models\\User', 1, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-30 23:35:45', 1, '2024-04-30 23:36:12', 0, NULL, NULL),
(147, 'App\\Models\\User', 11, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-30 23:36:18', 1, '2024-04-30 23:37:37', 0, NULL, NULL),
(148, 'App\\Models\\User', 1, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-30 23:37:50', 1, '2024-04-30 23:39:08', 0, NULL, NULL),
(149, 'App\\Models\\User', 11, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-30 23:39:58', 1, '2024-04-30 23:50:37', 0, NULL, NULL),
(150, 'App\\Models\\User', 1, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-30 23:50:50', 1, NULL, 0, NULL, NULL),
(151, 'App\\Models\\User', 1, '49.36.191.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-04-30 23:55:16', 1, NULL, 0, NULL, NULL),
(152, 'App\\Models\\User', 1, '103.106.21.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-01 07:13:39', 1, NULL, 0, NULL, NULL),
(153, 'App\\Models\\User', 1, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-01 23:05:14', 1, '2024-05-02 03:23:04', 0, NULL, NULL),
(154, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-01 23:34:16', 1, NULL, 0, NULL, NULL),
(155, 'App\\Models\\User', 11, '49.47.71.244', 'PostmanRuntime/7.37.3', '2024-05-02 00:07:35', 1, NULL, 0, NULL, NULL),
(156, 'App\\Models\\User', 40, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-02 03:23:25', 1, '2024-05-02 03:24:07', 0, NULL, NULL),
(157, 'App\\Models\\User', 11, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-02 03:24:19', 1, '2024-05-02 03:25:00', 0, NULL, NULL),
(158, 'App\\Models\\User', 1, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-02 03:25:09', 0, NULL, 0, NULL, NULL),
(159, 'App\\Models\\User', 1, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-02 03:25:25', 1, '2024-05-02 04:51:43', 0, NULL, NULL),
(160, 'App\\Models\\User', 1, '103.106.21.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-02 04:24:35', 1, NULL, 0, NULL, NULL),
(161, 'App\\Models\\User', 11, '49.47.71.244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-02 04:51:55', 1, NULL, 0, NULL, NULL),
(162, 'App\\Models\\User', 1, '223.179.141.46', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-02 06:44:11', 1, NULL, 0, NULL, NULL),
(163, 'App\\Models\\User', 1, '223.179.141.46', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-02 23:19:50', 1, NULL, 0, NULL, NULL),
(164, 'App\\Models\\User', 11, '49.47.70.36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-03 02:28:31', 1, '2024-05-03 04:36:06', 0, NULL, NULL),
(165, 'App\\Models\\User', 1, '49.47.70.36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-03 04:36:15', 1, '2024-05-03 06:44:17', 0, NULL, NULL),
(166, 'App\\Models\\User', 11, '49.47.70.36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-03 06:44:28', 1, NULL, 0, NULL, NULL),
(167, 'App\\Models\\User', 1, '49.47.70.36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-05 00:12:20', 1, NULL, 0, NULL, NULL),
(168, 'App\\Models\\User', 1, '49.47.69.84', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-05 22:57:01', 1, '2024-05-06 00:55:10', 0, NULL, NULL),
(169, 'App\\Models\\User', 1, '122.160.30.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-06 00:20:12', 1, NULL, 0, NULL, NULL),
(170, 'App\\Models\\User', 11, '49.47.69.84', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-06 00:55:22', 1, '2024-05-06 03:19:20', 0, NULL, NULL),
(171, 'App\\Models\\User', 1, '49.36.191.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-06 01:03:22', 1, NULL, 0, NULL, NULL),
(172, 'App\\Models\\User', 1, '103.106.21.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-06 01:33:31', 1, NULL, 0, NULL, NULL),
(173, 'App\\Models\\User', 1, '49.47.69.84', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-06 03:19:41', 1, NULL, 0, NULL, NULL),
(174, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-06 04:05:22', 1, NULL, 0, NULL, NULL),
(175, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-06 16:00:15', 1, NULL, 0, NULL, NULL),
(176, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-06 17:06:56', 1, '2024-05-06 17:11:03', 0, NULL, NULL),
(177, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-07 00:54:19', 1, NULL, 0, NULL, NULL),
(178, 'App\\Models\\User', 11, '122.161.48.85', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-07 02:03:04', 0, NULL, 0, NULL, NULL),
(179, 'App\\Models\\User', 1, '122.161.48.85', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-07 02:03:24', 1, NULL, 0, NULL, NULL),
(180, 'App\\Models\\User', 1, '49.47.70.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-07 02:15:21', 1, NULL, 0, NULL, NULL),
(181, 'App\\Models\\User', 11, '122.175.11.103', 'okhttp/4.9.2', '2024-05-07 03:35:29', 0, NULL, 0, NULL, NULL),
(182, 'App\\Models\\User', 11, '122.175.11.103', 'okhttp/4.9.2', '2024-05-07 03:35:42', 1, NULL, 0, NULL, NULL),
(183, 'App\\Models\\User', 1, '103.106.21.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-07 06:01:11', 1, '2024-05-07 06:06:43', 0, NULL, NULL),
(184, 'App\\Models\\User', 11, '103.106.21.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-07 06:06:49', 1, '2024-05-07 06:08:11', 0, NULL, NULL),
(185, 'App\\Models\\User', 1, '103.106.21.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-07 06:08:14', 1, '2024-05-07 06:11:26', 0, NULL, NULL),
(186, 'App\\Models\\User', 11, '103.106.21.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-07 06:11:33', 0, NULL, 0, NULL, NULL),
(187, 'App\\Models\\User', 11, '103.106.21.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-07 06:11:37', 1, '2024-05-07 06:12:34', 0, NULL, NULL),
(188, 'App\\Models\\User', 1, '103.106.21.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-07 06:12:37', 1, '2024-05-07 07:03:35', 0, NULL, NULL),
(189, 'App\\Models\\User', 1, '122.161.48.85', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0', '2024-05-07 08:43:40', 1, NULL, 0, NULL, NULL),
(190, 'App\\Models\\User', 11, '49.47.70.121', 'PostmanRuntime/7.38.0', '2024-05-07 23:57:23', 1, NULL, 0, NULL, NULL),
(191, 'App\\Models\\User', 1, '122.161.48.79', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-08 01:24:59', 1, NULL, 0, NULL, NULL),
(192, 'App\\Models\\User', 1, '49.47.70.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-08 02:37:41', 1, NULL, 0, NULL, NULL),
(193, 'App\\Models\\User', 1, '122.161.52.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0', '2024-05-08 05:11:50', 1, NULL, 0, NULL, NULL),
(194, 'App\\Models\\User', 1, '103.106.21.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-08 06:10:13', 1, NULL, 0, NULL, NULL),
(195, 'App\\Models\\User', 1, '49.47.70.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-08 09:00:41', 1, NULL, 0, NULL, NULL),
(196, 'App\\Models\\User', 1, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-08 23:25:56', 1, '2024-05-09 02:49:56', 0, NULL, NULL),
(197, 'App\\Models\\User', 11, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-09 00:27:45', 1, NULL, 0, NULL, NULL),
(198, 'App\\Models\\User', 1, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 02:29:47', 1, '2024-05-09 02:33:58', 0, NULL, NULL),
(199, 'App\\Models\\User', 11, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 02:34:08', 1, '2024-05-09 02:42:52', 0, NULL, NULL),
(200, 'App\\Models\\User', 1, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 02:43:04', 1, NULL, 0, NULL, NULL),
(201, 'App\\Models\\User', 11, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 02:49:51', 1, '2024-05-09 02:50:44', 0, NULL, NULL),
(202, 'App\\Models\\User', 40, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 02:50:58', 0, NULL, 0, NULL, NULL),
(203, 'App\\Models\\User', 40, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 02:51:04', 1, NULL, 0, NULL, NULL),
(204, 'App\\Models\\User', 11, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 02:51:27', 0, NULL, 0, NULL, NULL),
(205, 'App\\Models\\User', 11, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 02:51:40', 0, NULL, 0, NULL, NULL),
(206, 'App\\Models\\User', 11, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 02:51:52', 1, '2024-05-09 03:01:11', 0, NULL, NULL),
(207, 'App\\Models\\User', 1, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 03:01:14', 1, '2024-05-09 03:03:25', 0, NULL, NULL),
(208, 'App\\Models\\User', 11, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 03:03:52', 1, '2024-05-09 03:04:36', 0, NULL, NULL),
(209, 'App\\Models\\User', 1, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 03:04:40', 1, '2024-05-09 03:05:12', 0, NULL, NULL),
(210, 'App\\Models\\User', 11, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 03:05:31', 1, '2024-05-09 03:05:51', 0, NULL, NULL),
(211, 'App\\Models\\User', 1, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 03:06:01', 1, '2024-05-09 03:06:29', 0, NULL, NULL),
(212, 'App\\Models\\User', 11, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 03:07:05', 1, '2024-05-09 03:09:04', 0, NULL, NULL),
(213, 'App\\Models\\User', 1, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 03:09:07', 1, '2024-05-09 03:34:02', 0, NULL, NULL),
(214, 'App\\Models\\User', 11, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 03:34:22', 1, '2024-05-09 03:37:56', 0, NULL, NULL),
(215, 'App\\Models\\User', 1, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 03:38:00', 1, NULL, 0, NULL, NULL),
(216, 'App\\Models\\User', 1, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 05:23:59', 1, '2024-05-09 06:44:05', 0, NULL, NULL),
(217, 'App\\Models\\User', 40, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-09 06:27:14', 1, NULL, 0, NULL, NULL),
(218, 'App\\Models\\User', 1, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-09 06:44:28', 1, NULL, 0, NULL, NULL),
(219, 'App\\Models\\User', 1, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 06:45:10', 1, NULL, 0, NULL, NULL),
(220, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 12:52:00', 1, NULL, 0, NULL, NULL),
(221, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 23:38:08', 1, NULL, 0, NULL, NULL),
(222, 'App\\Models\\User', 1, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-09 23:38:30', 1, NULL, 0, NULL, NULL),
(223, 'App\\Models\\User', 1, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-09 23:38:32', 1, '2024-05-10 03:05:51', 0, NULL, NULL),
(224, 'App\\Models\\User', 11, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-10 00:08:21', 1, NULL, 0, NULL, NULL),
(225, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-10 01:45:13', 1, NULL, 0, NULL, NULL),
(226, 'App\\Models\\User', 11, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-10 03:06:34', 1, '2024-05-10 03:09:39', 0, NULL, NULL),
(227, 'App\\Models\\User', 1, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-10 03:09:43', 1, '2024-05-10 03:10:04', 0, NULL, NULL),
(228, 'App\\Models\\User', 1, '122.161.48.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-10 03:10:08', 1, NULL, 0, NULL, NULL),
(229, 'App\\Models\\User', 40, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-10 03:43:53', 1, NULL, 0, NULL, NULL),
(230, 'App\\Models\\User', 40, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-10 03:49:48', 1, NULL, 0, NULL, NULL),
(231, 'App\\Models\\User', 1, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-10 05:48:43', 1, NULL, 0, NULL, NULL),
(232, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-11 10:10:30', 0, NULL, 0, NULL, NULL),
(233, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-11 10:10:42', 1, NULL, 0, NULL, NULL),
(234, 'App\\Models\\User', 1, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-12 10:51:11', 1, NULL, 0, NULL, NULL),
(235, 'App\\Models\\User', 40, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-12 23:34:30', 1, NULL, 0, NULL, NULL),
(236, 'App\\Models\\User', 40, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-12 23:35:37', 1, NULL, 0, NULL, NULL),
(237, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-12 23:36:50', 1, NULL, 0, NULL, NULL),
(238, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-12 23:37:31', 1, NULL, 0, NULL, NULL),
(239, 'App\\Models\\User', 11, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-12 23:43:11', 0, NULL, 0, NULL, NULL),
(240, 'App\\Models\\User', 11, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-12 23:43:24', 0, NULL, 0, NULL, NULL),
(241, 'App\\Models\\User', 11, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-12 23:43:46', 0, NULL, 0, NULL, NULL),
(242, 'App\\Models\\User', 1, '122.161.50.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-12 23:43:55', 1, '2024-05-13 02:54:54', 0, NULL, NULL),
(243, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-12 23:45:24', 1, NULL, 0, NULL, NULL),
(244, 'App\\Models\\User', 40, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-12 23:46:25', 1, NULL, 0, NULL, NULL),
(245, 'App\\Models\\User', 40, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-12 23:47:13', 1, NULL, 0, NULL, NULL),
(246, 'App\\Models\\User', 40, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-12 23:47:41', 1, NULL, 0, NULL, NULL),
(247, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-12 23:48:21', 1, NULL, 0, NULL, NULL),
(248, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-12 23:48:31', 0, NULL, 0, NULL, NULL),
(249, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-12 23:49:08', 1, NULL, 0, NULL, NULL),
(250, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-12 23:49:08', 0, NULL, 0, NULL, NULL),
(251, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-12 23:49:31', 1, NULL, 0, NULL, NULL),
(252, 'App\\Models\\User', 11, '103.85.11.169', 'PostmanRuntime/7.38.0', '2024-05-12 23:49:44', 1, NULL, 0, NULL, NULL),
(253, 'App\\Models\\User', 11, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-12 23:49:50', 1, NULL, 0, NULL, NULL),
(254, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-12 23:52:32', 1, NULL, 0, NULL, NULL),
(255, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-12 23:56:53', 1, NULL, 0, NULL, NULL),
(256, 'App\\Models\\User', 1, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-12 23:57:27', 1, NULL, 0, NULL, NULL),
(257, 'App\\Models\\User', 40, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-13 00:18:12', 0, NULL, 0, NULL, NULL),
(258, 'App\\Models\\User', 56, '49.47.70.13', 'PostmanRuntime/7.38.0', '2024-05-13 00:20:39', 1, NULL, 0, NULL, NULL),
(259, 'App\\Models\\User', 40, '49.36.191.74', 'okhttp/4.9.2', '2024-05-13 00:50:12', 0, NULL, 0, NULL, NULL),
(260, 'App\\Models\\User', 40, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-13 00:50:37', 1, NULL, 0, NULL, NULL),
(261, 'App\\Models\\User', 40, '49.36.191.74', 'okhttp/4.9.2', '2024-05-13 00:50:48', 1, NULL, 0, NULL, NULL),
(262, 'App\\Models\\User', 40, '49.36.191.74', 'okhttp/4.9.2', '2024-05-13 01:13:13', 0, NULL, 0, NULL, NULL),
(263, 'App\\Models\\User', 40, '49.36.191.74', 'okhttp/4.9.2', '2024-05-13 01:13:36', 1, NULL, 0, NULL, NULL),
(264, 'App\\Models\\User', 11, '122.161.50.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-13 02:55:14', 1, '2024-05-13 02:55:48', 0, NULL, NULL),
(265, 'App\\Models\\User', 1, '122.161.50.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-13 02:55:59', 1, '2024-05-13 09:39:57', 0, NULL, NULL),
(266, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', NULL, 0, '2024-05-13 04:21:47', 0, NULL, NULL),
(267, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-13 04:22:58', 1, NULL, 0, NULL, NULL);
INSERT INTO `authentication_log` (`id`, `authenticatable_type`, `authenticatable_id`, `ip_address`, `user_agent`, `login_at`, `login_successful`, `logout_at`, `cleared_by_user`, `location`, `team_id`) VALUES
(268, 'App\\Models\\User', 1, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0', '2024-05-13 07:41:38', 1, NULL, 0, NULL, NULL),
(269, 'App\\Models\\User', 1, '122.161.50.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-13 10:43:12', 1, NULL, 0, NULL, NULL),
(270, 'App\\Models\\User', 1, '49.47.70.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-14 01:05:02', 1, '2024-05-14 04:12:23', 0, NULL, NULL),
(271, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-14 01:12:04', 1, NULL, 0, NULL, NULL),
(272, 'App\\Models\\User', 1, '122.161.49.183', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-14 03:58:51', 1, '2024-05-14 03:59:50', 0, NULL, NULL),
(273, 'App\\Models\\User', 1, '122.161.49.183', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-14 04:00:08', 1, '2024-05-14 04:02:41', 0, NULL, NULL),
(274, 'App\\Models\\User', 1, '122.161.49.183', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0', '2024-05-14 04:00:16', 1, '2024-05-14 04:03:03', 0, NULL, NULL),
(275, 'App\\Models\\User', 1, '122.161.49.183', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-14 04:02:48', 1, '2024-05-14 04:03:25', 0, NULL, NULL),
(276, 'App\\Models\\User', 1, '122.161.49.183', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0', '2024-05-14 04:03:15', 1, '2024-05-14 04:03:47', 0, NULL, NULL),
(277, 'App\\Models\\User', 1, '122.161.49.183', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-14 04:03:33', 1, '2024-05-14 04:04:03', 0, NULL, NULL),
(278, 'App\\Models\\User', 1, '122.161.49.183', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0', '2024-05-14 04:03:53', 1, NULL, 0, NULL, NULL),
(279, 'App\\Models\\User', 1, '122.161.49.183', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-14 04:04:37', 1, '2024-05-14 04:59:30', 0, NULL, NULL),
(280, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-14 04:59:22', 1, '2024-05-14 04:59:34', 0, NULL, NULL),
(281, 'App\\Models\\User', 1, '122.161.49.183', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-14 06:38:57', 1, NULL, 0, NULL, NULL),
(282, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-14 16:04:28', 1, '2024-05-14 16:04:49', 0, NULL, NULL),
(283, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-14 16:04:57', 1, NULL, 0, NULL, NULL),
(284, 'App\\Models\\User', 1, '122.161.51.203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-15 00:43:03', 1, '2024-05-15 03:25:36', 0, NULL, NULL),
(285, 'App\\Models\\User', 11, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 03:22:13', 1, NULL, 0, NULL, NULL),
(286, 'App\\Models\\User', 11, '122.161.51.203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-15 03:26:07', 1, '2024-05-15 03:26:40', 0, NULL, NULL),
(287, 'App\\Models\\User', 11, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 03:26:14', 1, NULL, 0, NULL, NULL),
(288, 'App\\Models\\User', 11, '122.161.51.203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-15 03:27:04', 1, '2024-05-15 03:29:14', 0, NULL, NULL),
(289, 'App\\Models\\User', 40, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 03:27:37', 0, NULL, 0, NULL, NULL),
(290, 'App\\Models\\User', 40, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 03:27:51', 0, NULL, 0, NULL, NULL),
(291, 'App\\Models\\User', 40, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 03:28:35', 0, NULL, 0, NULL, NULL),
(292, 'App\\Models\\User', 40, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 03:28:44', 0, NULL, 0, NULL, NULL),
(293, 'App\\Models\\User', 40, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 03:28:52', 0, NULL, 0, NULL, NULL),
(294, 'App\\Models\\User', 40, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 03:29:00', 0, NULL, 0, NULL, NULL),
(295, 'App\\Models\\User', 1, '122.161.51.203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-15 03:29:18', 1, '2024-05-15 03:37:01', 0, NULL, NULL),
(296, 'App\\Models\\User', 1, '49.36.191.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-15 03:33:21', 1, '2024-05-15 03:40:17', 0, NULL, NULL),
(297, 'App\\Models\\User', 1, '122.161.51.203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-15 03:37:06', 1, '2024-05-15 03:45:48', 0, NULL, NULL),
(298, 'App\\Models\\User', 1, '49.36.191.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-15 03:40:24', 1, NULL, 0, NULL, NULL),
(299, 'App\\Models\\User', 57, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 03:42:12', 1, NULL, 0, NULL, NULL),
(300, 'App\\Models\\User', 1, '122.161.51.203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-15 03:45:54', 1, '2024-05-15 06:42:57', 0, NULL, NULL),
(301, 'App\\Models\\User', 11, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 04:47:02', 1, NULL, 0, NULL, NULL),
(302, 'App\\Models\\User', 57, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 04:52:07', 1, NULL, 0, NULL, NULL),
(303, 'App\\Models\\User', 11, '49.36.191.74', 'okhttp/4.9.2', '2024-05-15 05:04:52', 1, NULL, 0, NULL, NULL),
(304, 'App\\Models\\User', 1, '49.47.69.110', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-15 05:32:21', 1, '2024-05-15 07:23:27', 0, NULL, NULL),
(305, 'App\\Models\\User', 11, '49.47.69.110', 'PostmanRuntime/7.38.0', '2024-05-15 05:35:47', 1, NULL, 0, NULL, NULL),
(306, 'App\\Models\\User', 56, '49.47.69.110', 'PostmanRuntime/7.38.0', '2024-05-15 06:29:36', 1, NULL, 0, NULL, NULL),
(307, 'App\\Models\\User', 11, '49.36.191.74', 'PostmanRuntime/7.37.3', '2024-05-15 06:39:23', 1, NULL, 0, NULL, NULL),
(308, 'App\\Models\\User', 11, '49.47.69.110', 'PostmanRuntime/7.38.0', '2024-05-15 07:14:28', 1, NULL, 0, NULL, NULL),
(309, 'App\\Models\\User', 1, '122.161.51.203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-15 07:19:39', 1, '2024-05-15 07:36:38', 0, NULL, NULL),
(310, 'App\\Models\\User', 1, '49.47.69.110', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-15 07:23:49', 1, '2024-05-15 07:49:08', 0, NULL, NULL),
(311, 'App\\Models\\User', 56, '49.47.69.110', 'PostmanRuntime/7.38.0', '2024-05-15 07:25:41', 1, NULL, 0, NULL, NULL),
(312, 'App\\Models\\User', 11, '49.47.69.110', 'PostmanRuntime/7.38.0', '2024-05-15 07:35:58', 1, NULL, 0, NULL, NULL),
(313, 'App\\Models\\User', 1, '122.161.51.203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-15 07:39:49', 1, '2024-05-15 09:27:57', 0, NULL, NULL),
(314, 'App\\Models\\User', 1, '49.47.69.110', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-15 09:26:48', 1, NULL, 0, NULL, NULL),
(315, 'App\\Models\\User', 1, '49.47.69.110', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-15 23:42:38', 1, '2024-05-16 02:21:48', 0, NULL, NULL),
(316, 'App\\Models\\User', 1, '122.161.49.118', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-16 02:07:22', 1, '2024-05-16 03:10:24', 0, NULL, NULL),
(317, 'App\\Models\\User', 11, '122.161.49.118', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-16 03:10:43', 1, NULL, 0, NULL, NULL),
(318, 'App\\Models\\User', 1, '49.47.69.110', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-16 04:15:37', 1, NULL, 0, NULL, NULL),
(319, 'App\\Models\\User', 11, '49.47.69.110', 'PostmanRuntime/7.39.0', '2024-05-16 07:17:24', 1, NULL, 0, NULL, NULL),
(320, 'App\\Models\\User', 1, '49.47.69.110', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-16 13:59:58', 1, NULL, 0, NULL, NULL),
(321, 'App\\Models\\User', 1, '49.47.69.110', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-16 23:28:40', 1, NULL, 0, NULL, NULL),
(322, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-16 23:34:43', 1, NULL, 0, NULL, NULL),
(323, 'App\\Models\\User', 1, '122.161.49.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-17 04:09:35', 1, '2024-05-17 06:56:48', 0, NULL, NULL),
(324, 'App\\Models\\User', 1, '152.58.233.177', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', NULL, 0, '2024-05-17 04:19:06', 0, NULL, NULL),
(325, 'App\\Models\\User', 1, '49.47.69.110', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-17 05:57:55', 1, '2024-05-17 07:52:13', 0, NULL, NULL),
(326, 'App\\Models\\User', 1, '122.161.49.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-17 07:03:22', 1, NULL, 0, NULL, NULL),
(327, 'App\\Models\\User', 57, '49.36.191.174', 'okhttp/4.9.2', '2024-05-19 00:26:15', 1, NULL, 0, NULL, NULL),
(328, 'App\\Models\\User', 11, '49.36.191.174', 'okhttp/4.9.2', '2024-05-19 00:39:00', 1, NULL, 0, NULL, NULL),
(329, 'App\\Models\\User', 57, '49.36.191.174', 'okhttp/4.9.2', '2024-05-19 00:45:07', 1, NULL, 0, NULL, NULL),
(330, 'App\\Models\\User', 1, '49.36.191.174', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-19 00:50:23', 1, NULL, 0, NULL, NULL),
(331, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36', '2024-05-19 11:34:36', 1, NULL, 0, NULL, NULL),
(332, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-19 12:56:58', 1, NULL, 0, NULL, NULL),
(333, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-20 00:08:01', 1, '2024-05-20 02:18:05', 0, NULL, NULL),
(334, 'App\\Models\\User', 11, '49.47.71.247', 'PostmanRuntime/7.39.0', '2024-05-20 01:13:29', 1, NULL, 0, NULL, NULL),
(335, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-20 02:07:43', 1, '2024-05-20 02:49:24', 0, NULL, NULL),
(336, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-20 02:27:44', 1, NULL, 0, NULL, NULL),
(337, 'App\\Models\\User', 1, '122.161.48.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-20 04:39:22', 1, '2024-05-20 07:18:40', 0, NULL, NULL),
(338, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-20 07:00:08', 1, NULL, 0, NULL, NULL),
(339, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-20 22:12:11', 1, NULL, 0, NULL, NULL),
(340, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-20 22:13:07', 1, NULL, 0, NULL, NULL),
(341, 'App\\Models\\User', 1, '122.161.48.48', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-21 05:19:23', 1, NULL, 0, NULL, NULL),
(342, 'App\\Models\\User', 1, '122.161.48.180', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', NULL, 0, '2024-05-21 06:59:56', 0, NULL, NULL),
(343, 'App\\Models\\User', 11, '122.161.48.180', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-21 07:00:16', 1, '2024-05-21 07:00:59', 0, NULL, NULL),
(344, 'App\\Models\\User', 1, '122.161.48.180', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-21 07:01:03', 1, NULL, 0, NULL, NULL),
(345, 'App\\Models\\User', 1, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-21 13:07:51', 1, '2024-05-21 15:19:09', 0, NULL, NULL),
(346, 'App\\Models\\User', 11, '103.85.11.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-21 15:19:15', 1, NULL, 0, NULL, NULL),
(347, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-22 01:53:10', 1, '2024-05-22 02:18:53', 0, NULL, NULL),
(348, 'App\\Models\\User', 1, '122.161.48.180', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-22 02:11:06', 1, '2024-05-22 02:39:31', 0, NULL, NULL),
(349, 'App\\Models\\User', 11, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 02:14:17', 1, NULL, 0, NULL, NULL),
(350, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 02:16:17', 0, NULL, 0, NULL, NULL),
(351, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 02:16:20', 1, '2024-05-22 02:16:53', 0, NULL, NULL),
(352, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-05-22 02:16:48', 1, NULL, 0, NULL, NULL),
(353, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 02:17:32', 1, '2024-05-22 02:42:00', 0, NULL, NULL),
(354, 'App\\Models\\User', 1, '122.161.48.180', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-22 02:41:47', 1, '2024-05-22 02:57:31', 0, NULL, NULL),
(355, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 02:55:25', 0, NULL, 0, NULL, NULL),
(356, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 02:55:27', 1, '2024-05-22 03:04:17', 0, NULL, NULL),
(357, 'App\\Models\\User', 1, '122.161.48.180', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-22 03:01:35', 1, '2024-05-22 03:05:55', 0, NULL, NULL),
(358, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 03:04:26', 1, '2024-05-22 03:13:50', 0, NULL, NULL),
(359, 'App\\Models\\User', 1, '122.161.48.180', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-22 03:05:58', 1, '2024-05-22 03:18:32', 0, NULL, NULL),
(360, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 03:16:53', 1, '2024-05-22 03:22:55', 0, NULL, NULL),
(361, 'App\\Models\\User', 1, '122.161.48.180', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-22 03:20:31', 1, '2024-05-22 03:28:32', 0, NULL, NULL),
(362, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 03:23:05', 1, '2024-05-22 05:57:51', 0, NULL, NULL),
(363, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-22 05:48:50', 1, '2024-05-22 05:56:51', 0, NULL, NULL),
(364, 'App\\Models\\User', 11, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-22 05:56:57', 1, '2024-05-22 06:26:29', 0, NULL, NULL),
(365, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-22 05:58:11', 1, NULL, 0, NULL, NULL),
(366, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-22 06:26:32', 1, '2024-05-22 06:28:09', 0, NULL, NULL),
(367, 'App\\Models\\User', 11, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-22 06:28:19', 1, '2024-05-22 06:28:59', 0, NULL, NULL),
(368, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-22 06:29:09', 1, '2024-05-22 06:31:55', 0, NULL, NULL),
(369, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-22 06:32:48', 1, '2024-05-22 06:33:11', 0, NULL, NULL),
(370, 'App\\Models\\User', 11, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-22 06:32:58', 1, NULL, 0, NULL, NULL),
(371, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-22 06:34:24', 1, '2024-05-22 06:35:38', 0, NULL, NULL),
(372, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 06:35:29', 1, '2024-05-22 07:10:51', 0, NULL, NULL),
(373, 'App\\Models\\User', 11, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 06:43:32', 1, '2024-05-22 06:53:51', 0, NULL, NULL),
(374, 'App\\Models\\User', 11, '49.206.47.131', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 06:45:14', 1, '2024-05-22 06:45:31', 0, NULL, NULL),
(375, 'App\\Models\\User', 1, '49.206.47.131', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 06:45:43', 1, NULL, 0, NULL, NULL),
(376, 'App\\Models\\User', 1, '124.123.175.199', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-22 23:41:43', 1, NULL, 0, NULL, NULL),
(377, 'App\\Models\\User', 59, '152.58.197.93', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1', '2024-05-23 00:10:47', 1, NULL, 0, NULL, NULL),
(378, 'App\\Models\\User', 59, '124.123.175.199', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-23 00:12:36', 1, NULL, 0, NULL, NULL),
(379, 'App\\Models\\User', 11, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-23 23:32:58', 1, '2024-05-23 23:33:26', 0, NULL, NULL),
(380, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-23 23:33:36', 1, '2024-05-24 00:12:55', 0, NULL, NULL),
(381, 'App\\Models\\User', 11, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-23 23:46:59', 1, NULL, 0, NULL, NULL),
(382, 'App\\Models\\User', 1, '124.123.171.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-24 00:12:42', 1, '2024-05-24 01:34:08', 0, NULL, NULL),
(383, 'App\\Models\\User', 11, '124.123.171.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-24 00:13:54', 1, '2024-05-24 00:14:14', 0, NULL, NULL),
(384, 'App\\Models\\User', 59, '124.123.171.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-24 00:18:02', 0, NULL, 0, NULL, NULL),
(385, 'App\\Models\\User', 59, '124.123.171.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-24 00:18:22', 1, NULL, 0, NULL, NULL),
(386, 'App\\Models\\User', 1, '49.47.71.247', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-24 01:11:39', 1, '2024-05-24 01:36:18', 0, NULL, NULL),
(387, 'App\\Models\\User', 1, '124.123.171.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-24 01:35:56', 1, '2024-05-24 04:12:01', 0, NULL, NULL),
(388, 'App\\Models\\User', 1, '122.161.53.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-24 03:46:25', 1, NULL, 0, NULL, NULL),
(389, 'App\\Models\\User', 1, '49.206.39.223', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-25 01:15:58', 0, NULL, 0, NULL, NULL),
(390, 'App\\Models\\User', 1, '49.206.39.223', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-25 01:16:05', 1, NULL, 0, NULL, NULL),
(391, 'App\\Models\\User', 1, '49.206.39.223', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-25 01:46:17', 1, '2024-05-25 01:48:26', 0, NULL, NULL),
(392, 'App\\Models\\User', 11, '49.47.70.208', 'PostmanRuntime/7.39.0', '2024-05-26 23:04:22', 1, NULL, 0, NULL, NULL),
(393, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-26 23:33:34', 1, NULL, 0, NULL, NULL),
(394, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-27 03:18:37', 1, '2024-05-27 04:54:36', 0, NULL, NULL),
(395, 'App\\Models\\User', 11, '49.47.70.208', 'PostmanRuntime/7.39.0', '2024-05-27 04:47:39', 1, NULL, 0, NULL, NULL),
(396, 'App\\Models\\User', 1, '49.47.70.208', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-27 04:54:14', 1, '2024-05-27 07:51:16', 0, NULL, NULL),
(397, 'App\\Models\\User', 11, '49.47.70.208', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-27 06:20:51', 1, '2024-05-27 06:21:46', 0, NULL, NULL),
(398, 'App\\Models\\User', 56, '49.47.70.208', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-27 06:22:05', 0, NULL, 0, NULL, NULL),
(399, 'App\\Models\\User', 56, '49.47.70.208', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-27 06:22:08', 1, NULL, 0, NULL, NULL),
(400, 'App\\Models\\User', 57, '49.36.189.8', 'PostmanRuntime/7.39.0', '2024-05-27 06:46:30', 1, NULL, 0, NULL, NULL),
(401, 'App\\Models\\User', 57, '49.36.189.8', 'PostmanRuntime/7.39.0', '2024-05-27 06:51:41', 1, NULL, 0, NULL, NULL),
(402, 'App\\Models\\User', 57, '49.36.189.8', 'PostmanRuntime/7.39.0', '2024-05-27 06:59:30', 1, NULL, 0, NULL, NULL),
(403, 'App\\Models\\User', 57, '49.36.189.8', 'PostmanRuntime/7.39.0', '2024-05-27 07:02:47', 1, NULL, 0, NULL, NULL),
(404, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-27 07:26:29', 1, NULL, 0, NULL, NULL),
(405, 'App\\Models\\User', 1, '49.47.70.208', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-27 11:58:10', 1, NULL, 0, NULL, NULL),
(406, 'App\\Models\\User', 11, '49.47.70.208', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-27 11:58:40', 1, NULL, 0, NULL, NULL),
(407, 'App\\Models\\User', 57, '49.36.189.8', 'PostmanRuntime/7.39.0', '2024-05-27 23:36:13', 1, NULL, 0, NULL, NULL),
(408, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-28 00:04:10', 1, '2024-05-28 00:46:34', 0, NULL, NULL),
(409, 'App\\Models\\User', 11, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-28 00:46:40', 1, NULL, 0, NULL, NULL),
(410, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-28 00:48:03', 1, NULL, 0, NULL, NULL),
(411, 'App\\Models\\User', 1, '49.47.70.208', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-28 07:31:37', 1, NULL, 0, NULL, NULL),
(412, 'App\\Models\\User', 11, '49.36.189.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-29 02:01:16', 1, NULL, 0, NULL, NULL),
(413, 'App\\Models\\User', 11, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-29 02:04:54', 1, NULL, 0, NULL, NULL),
(414, 'App\\Models\\User', 1, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-29 02:07:53', 1, '2024-05-29 04:24:34', 0, NULL, NULL),
(415, 'App\\Models\\User', 11, '49.36.189.8', 'okhttp/4.9.2', '2024-05-29 02:25:58', 1, NULL, 0, NULL, NULL),
(416, 'App\\Models\\User', 11, '49.36.189.8', 'PostmanRuntime/7.39.0', '2024-05-29 02:26:17', 1, NULL, 0, NULL, NULL),
(417, 'App\\Models\\User', 11, '49.36.189.8', 'PostmanRuntime/7.39.0', '2024-05-29 02:26:48', 1, NULL, 0, NULL, NULL),
(418, 'App\\Models\\User', 11, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-29 03:21:34', 1, NULL, 0, NULL, NULL),
(419, 'App\\Models\\User', 11, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-29 04:15:53', 0, NULL, 0, NULL, NULL),
(420, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-29 04:15:59', 1, '2024-05-29 04:16:34', 0, NULL, NULL),
(421, 'App\\Models\\User', 11, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-29 04:16:39', 0, NULL, 0, NULL, NULL),
(422, 'App\\Models\\User', 11, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-29 04:16:42', 1, '2024-05-29 10:07:01', 0, NULL, NULL),
(423, 'App\\Models\\User', 1, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-29 04:27:25', 1, '2024-05-29 10:17:44', 0, NULL, NULL),
(424, 'App\\Models\\User', 1, '103.106.21.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-29 10:07:05', 1, NULL, 0, NULL, NULL),
(425, 'App\\Models\\User', 1, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-29 23:40:35', 1, '2024-05-30 05:12:32', 0, NULL, NULL),
(426, 'App\\Models\\User', 1, '103.106.21.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-30 04:47:58', 1, '2024-05-30 06:18:37', 0, NULL, NULL),
(427, 'App\\Models\\User', 11, '49.36.187.119', 'PostmanRuntime/7.39.0', '2024-05-30 05:21:20', 1, NULL, 0, NULL, NULL),
(428, 'App\\Models\\User', 1, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-30 06:11:20', 1, '2024-05-30 06:14:08', 0, NULL, NULL),
(429, 'App\\Models\\User', 56, '49.36.187.119', 'PostmanRuntime/7.39.0', '2024-05-30 06:13:03', 1, NULL, 0, NULL, NULL),
(430, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-30 06:13:30', 1, '2024-05-30 06:14:31', 0, NULL, NULL),
(431, 'App\\Models\\User', 1, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-30 06:14:21', 1, '2024-05-30 06:15:13', 0, NULL, NULL),
(432, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-30 06:15:13', 1, NULL, 0, NULL, NULL),
(433, 'App\\Models\\User', 11, '49.36.189.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-30 06:27:41', 1, NULL, 0, NULL, NULL),
(434, 'App\\Models\\User', 1, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-30 12:11:08', 1, NULL, 0, NULL, NULL),
(435, 'App\\Models\\User', 3, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '2024-05-30 12:21:33', 1, NULL, 0, NULL, NULL),
(436, 'App\\Models\\User', 1, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-31 01:57:40', 1, '2024-05-31 04:05:13', 0, NULL, NULL),
(437, 'App\\Models\\User', 1, '122.161.52.91', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-05-31 03:58:44', 1, '2024-05-31 04:07:41', 0, NULL, NULL),
(438, 'App\\Models\\User', 1, '49.36.187.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-05-31 04:05:23', 1, NULL, 0, NULL, NULL),
(439, 'App\\Models\\User', 57, '49.36.191.174', 'okhttp/4.9.2', '2024-06-01 04:58:41', 1, NULL, 0, NULL, NULL),
(440, 'App\\Models\\User', 57, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-01 05:12:48', 1, NULL, 0, NULL, NULL),
(441, 'App\\Models\\User', 57, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-01 12:32:25', 0, NULL, 0, NULL, NULL),
(442, 'App\\Models\\User', 57, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-01 12:32:32', 1, NULL, 0, NULL, NULL),
(443, 'App\\Models\\User', 57, '49.36.191.174', 'okhttp/4.9.2', '2024-06-01 12:32:57', 1, NULL, 0, NULL, NULL),
(444, 'App\\Models\\User', 1, '49.36.185.233', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-02 11:50:34', 1, NULL, 0, NULL, NULL),
(445, 'App\\Models\\User', 1, '103.238.107.41', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-02 13:11:46', 1, NULL, 0, NULL, NULL),
(446, 'App\\Models\\User', 11, '103.238.107.41', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-02 13:14:27', 1, NULL, 0, NULL, NULL),
(447, 'App\\Models\\User', 11, '103.238.107.41', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-02 13:32:57', 1, NULL, 0, NULL, NULL),
(448, 'App\\Models\\User', 1, '103.238.107.41', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-02 21:37:50', 1, NULL, 0, NULL, NULL),
(449, 'App\\Models\\User', 1, '103.238.107.41', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-02 21:39:42', 1, '2024-06-02 21:40:52', 0, NULL, NULL),
(450, 'App\\Models\\User', 1, '103.238.107.41', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-02 22:05:10', 1, NULL, 0, NULL, NULL),
(451, 'App\\Models\\User', 1, '49.36.185.233', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-03 00:28:25', 1, NULL, 0, NULL, NULL),
(452, 'App\\Models\\User', 57, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-03 00:38:07', 1, NULL, 0, NULL, NULL),
(453, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-03 00:38:36', 1, NULL, 0, NULL, NULL),
(454, 'App\\Models\\User', 11, '49.36.191.174', 'okhttp/4.9.2', '2024-06-03 00:39:44', 1, NULL, 0, NULL, NULL),
(455, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-03 02:35:38', 1, NULL, 0, NULL, NULL),
(456, 'App\\Models\\User', 11, '49.36.185.233', 'PostmanRuntime/7.39.0', '2024-06-03 02:46:53', 1, NULL, 0, NULL, NULL),
(457, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-03 05:51:44', 1, NULL, 0, NULL, NULL),
(458, 'App\\Models\\User', 11, '49.36.185.233', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-03 06:55:29', 1, NULL, 0, NULL, NULL),
(459, 'App\\Models\\User', 1, '152.59.0.173', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-03 23:40:27', 1, '2024-06-03 23:41:16', 0, NULL, NULL),
(460, 'App\\Models\\User', 1, '49.36.185.233', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-03 23:40:57', 1, '2024-06-03 23:48:27', 0, NULL, NULL),
(461, 'App\\Models\\User', 1, '152.59.0.173', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-03 23:47:33', 1, '2024-06-03 23:49:15', 0, NULL, NULL),
(462, 'App\\Models\\User', 1, '49.36.185.233', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-03 23:48:51', 1, '2024-06-03 23:49:33', 0, NULL, NULL),
(463, 'App\\Models\\User', 1, '152.59.0.173', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-03 23:49:21', 1, '2024-06-03 23:58:10', 0, NULL, NULL),
(464, 'App\\Models\\User', 1, '49.36.185.233', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-03 23:52:35', 1, '2024-06-04 03:21:19', 0, NULL, NULL),
(465, 'App\\Models\\User', 11, '49.36.185.233', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-04 00:14:14', 1, '2024-06-04 02:43:10', 0, NULL, NULL),
(466, 'App\\Models\\User', 11, '49.36.185.233', 'PostmanRuntime/7.39.0', '2024-06-04 02:40:01', 1, NULL, 0, NULL, NULL),
(467, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-04 03:11:52', 1, NULL, 0, NULL, NULL),
(468, 'App\\Models\\User', 1, '103.106.21.17', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-04 03:20:57', 1, '2024-06-04 04:26:02', 0, NULL, NULL),
(469, 'App\\Models\\User', 1, '49.36.185.233', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-04 04:24:44', 1, '2024-06-04 04:39:48', 0, NULL, NULL),
(470, 'App\\Models\\User', 1, '103.106.21.17', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-04 04:34:45', 1, '2024-06-04 08:27:02', 0, NULL, NULL),
(471, 'App\\Models\\User', 11, '49.36.185.233', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-04 04:51:29', 1, NULL, 0, NULL, NULL),
(472, 'App\\Models\\User', 1, '49.36.185.233', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-04 08:00:02', 1, NULL, 0, NULL, NULL),
(473, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-04 22:59:34', 1, NULL, 0, NULL, NULL),
(474, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-04 23:00:22', 1, NULL, 0, NULL, NULL),
(475, 'App\\Models\\User', 11, '49.36.185.233', 'PostmanRuntime/7.39.0', '2024-06-04 23:00:37', 1, NULL, 0, NULL, NULL),
(476, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-04 23:18:18', 1, NULL, 0, NULL, NULL),
(477, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 00:07:39', 1, '2024-06-05 02:14:18', 0, NULL, NULL),
(478, 'App\\Models\\User', 1, '122.161.51.3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-05 02:12:12', 1, '2024-06-05 02:32:32', 0, NULL, NULL),
(479, 'App\\Models\\User', 11, '122.161.51.3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-05 02:32:50', 1, '2024-06-05 02:34:26', 0, NULL, NULL),
(480, 'App\\Models\\User', 1, '122.161.51.3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-05 02:34:28', 1, '2024-06-05 02:35:07', 0, NULL, NULL),
(481, 'App\\Models\\User', 11, '122.161.51.3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-05 02:35:23', 1, '2024-06-05 02:35:54', 0, NULL, NULL),
(482, 'App\\Models\\User', 1, '122.161.51.3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-05 02:35:57', 1, '2024-06-05 03:47:32', 0, NULL, NULL),
(483, 'App\\Models\\User', 1, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 03:33:25', 1, '2024-06-05 03:35:39', 0, NULL, NULL),
(484, 'App\\Models\\User', 11, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 03:35:46', 1, '2024-06-05 03:37:49', 0, NULL, NULL),
(485, 'App\\Models\\User', 1, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 03:37:52', 1, '2024-06-05 03:39:00', 0, NULL, NULL),
(486, 'App\\Models\\User', 11, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 03:39:07', 0, NULL, 0, NULL, NULL),
(487, 'App\\Models\\User', 11, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 03:39:16', 1, '2024-06-05 04:14:10', 0, NULL, NULL),
(488, 'App\\Models\\User', 1, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 03:41:09', 1, '2024-06-05 03:48:39', 0, NULL, NULL),
(489, 'App\\Models\\User', 3, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 03:48:43', 1, '2024-06-05 03:50:47', 0, NULL, NULL),
(490, 'App\\Models\\User', 1, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 03:50:51', 1, NULL, 0, NULL, NULL),
(491, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-05 04:14:00', 1, NULL, 0, NULL, NULL),
(492, 'App\\Models\\User', 1, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 04:14:38', 1, '2024-06-05 04:16:52', 0, NULL, NULL),
(493, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-05 04:15:07', 1, NULL, 0, NULL, NULL),
(494, 'App\\Models\\User', 1, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 04:19:20', 1, '2024-06-05 04:22:31', 0, NULL, NULL),
(495, 'App\\Models\\User', 11, '103.106.21.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-05 04:22:40', 1, NULL, 0, NULL, NULL),
(496, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-05 06:01:05', 1, NULL, 0, NULL, NULL),
(497, 'App\\Models\\User', 11, '49.36.185.233', 'PostmanRuntime/7.39.0', '2024-06-05 06:01:52', 1, NULL, 0, NULL, NULL),
(498, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-05 06:52:48', 1, NULL, 0, NULL, NULL),
(499, 'App\\Models\\User', 1, '122.161.51.3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-05 07:41:58', 1, NULL, 0, NULL, NULL),
(500, 'App\\Models\\User', 11, '152.58.117.60', 'PostmanRuntime/7.39.0', '2024-06-05 23:25:28', 1, NULL, 0, NULL, NULL),
(501, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-05 23:29:56', 1, NULL, 0, NULL, NULL),
(502, 'App\\Models\\User', 11, '152.59.20.17', 'PostmanRuntime/7.39.0', '2024-06-06 02:17:31', 0, NULL, 0, NULL, NULL),
(503, 'App\\Models\\User', 11, '152.59.20.17', 'PostmanRuntime/7.39.0', '2024-06-06 02:17:40', 1, NULL, 0, NULL, NULL),
(504, 'App\\Models\\User', 11, '152.59.20.17', 'PostmanRuntime/7.39.0', '2024-06-06 02:26:30', 1, NULL, 0, NULL, NULL),
(505, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-06 02:35:29', 1, NULL, 0, NULL, NULL),
(506, 'App\\Models\\User', 11, '49.36.185.233', 'PostmanRuntime/7.39.0', '2024-06-06 02:39:30', 1, NULL, 0, NULL, NULL),
(507, 'App\\Models\\User', 11, '49.36.185.233', 'PostmanRuntime/7.39.0', '2024-06-06 02:46:34', 1, NULL, 0, NULL, NULL),
(508, 'App\\Models\\User', 11, '49.36.191.174', 'okhttp/4.9.2', '2024-06-06 02:47:45', 1, NULL, 0, NULL, NULL),
(509, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-06 02:49:21', 1, NULL, 0, NULL, NULL),
(510, 'App\\Models\\User', 57, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-06 02:50:25', 1, NULL, 0, NULL, NULL),
(511, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-06 02:51:06', 1, NULL, 0, NULL, NULL),
(512, 'App\\Models\\User', 57, '49.36.191.174', 'okhttp/4.9.2', '2024-06-06 02:51:37', 0, NULL, 0, NULL, NULL),
(513, 'App\\Models\\User', 57, '49.36.191.174', 'okhttp/4.9.2', '2024-06-06 02:51:40', 0, NULL, 0, NULL, NULL),
(514, 'App\\Models\\User', 57, '49.36.191.174', 'okhttp/4.9.2', '2024-06-06 02:51:50', 1, NULL, 0, NULL, NULL),
(515, 'App\\Models\\User', 11, '49.36.191.174', 'okhttp/4.9.2', '2024-06-06 02:53:20', 0, NULL, 0, NULL, NULL),
(516, 'App\\Models\\User', 11, '49.36.191.174', 'okhttp/4.9.2', '2024-06-06 02:53:26', 1, NULL, 0, NULL, NULL),
(517, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-06 03:52:22', 1, NULL, 0, NULL, NULL),
(518, 'App\\Models\\User', 1, '152.59.23.50', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-06 03:57:32', 1, NULL, 0, NULL, NULL),
(519, 'App\\Models\\User', 57, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-06 23:02:37', 0, NULL, 0, NULL, NULL),
(520, 'App\\Models\\User', 57, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-06 23:03:06', 1, NULL, 0, NULL, NULL),
(521, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-06 23:03:20', 1, NULL, 0, NULL, NULL),
(522, 'App\\Models\\User', 11, '49.36.185.233', 'PostmanRuntime/7.39.0', '2024-06-06 23:05:44', 1, NULL, 0, NULL, NULL),
(523, 'App\\Models\\User', 11, '103.238.107.217', 'PostmanRuntime/7.39.0', '2024-06-06 23:06:03', 1, NULL, 0, NULL, NULL),
(524, 'App\\Models\\User', 11, '103.238.107.217', 'PostmanRuntime/7.39.0', '2024-06-06 23:07:50', 1, NULL, 0, NULL, NULL),
(525, 'App\\Models\\User', 11, '103.238.107.217', 'PostmanRuntime/7.39.0', '2024-06-06 23:08:08', 1, NULL, 0, NULL, NULL),
(526, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-06 23:09:16', 1, NULL, 0, NULL, NULL),
(527, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-07 00:11:52', 1, NULL, 0, NULL, NULL),
(528, 'App\\Models\\User', 11, '49.36.191.174', 'PostmanRuntime/7.39.0', '2024-06-07 00:28:03', 1, NULL, 0, NULL, NULL),
(529, 'App\\Models\\User', 11, '124.123.168.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-07 00:38:05', 1, '2024-06-07 00:44:34', 0, NULL, NULL),
(530, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-07 00:39:27', 0, NULL, 0, NULL, NULL),
(531, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-07 00:39:33', 1, '2024-06-07 06:33:07', 0, NULL, NULL),
(532, 'App\\Models\\User', 60, '124.123.168.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-07 00:45:15', 1, NULL, 0, NULL, NULL),
(533, 'App\\Models\\User', 1, '103.106.21.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-07 06:32:47', 1, NULL, 0, NULL, NULL),
(534, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 06:38:58', 1, NULL, 0, NULL, NULL),
(535, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 06:57:07', 1, NULL, 0, NULL, NULL),
(536, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:00:34', 1, NULL, 0, NULL, NULL),
(537, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:01:40', 1, NULL, 0, NULL, NULL);
INSERT INTO `authentication_log` (`id`, `authenticatable_type`, `authenticatable_id`, `ip_address`, `user_agent`, `login_at`, `login_successful`, `logout_at`, `cleared_by_user`, `location`, `team_id`) VALUES
(538, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:03:43', 1, NULL, 0, NULL, NULL),
(539, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:05:56', 1, NULL, 0, NULL, NULL),
(540, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:06:46', 1, NULL, 0, NULL, NULL),
(541, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:07:21', 1, NULL, 0, NULL, NULL),
(542, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:07:36', 1, NULL, 0, NULL, NULL),
(543, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:08:23', 1, NULL, 0, NULL, NULL),
(544, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:11:34', 1, NULL, 0, NULL, NULL),
(545, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:49:21', 1, NULL, 0, NULL, NULL),
(546, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:50:01', 1, NULL, 0, NULL, NULL),
(547, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:54:47', 1, NULL, 0, NULL, NULL),
(548, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:55:22', 1, NULL, 0, NULL, NULL),
(549, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 07:56:53', 1, NULL, 0, NULL, NULL),
(550, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 08:00:49', 1, NULL, 0, NULL, NULL),
(551, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 08:04:33', 1, NULL, 0, NULL, NULL),
(552, 'App\\Models\\User', 11, '103.106.21.23', 'PostmanRuntime/7.39.0', '2024-06-07 08:11:04', 1, NULL, 0, NULL, NULL),
(553, 'App\\Models\\User', 1, '103.238.107.217', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-07 13:56:20', 1, NULL, 0, NULL, NULL),
(554, 'App\\Models\\User', 1, '49.36.185.185', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-09 23:35:23', 1, '2024-06-10 02:25:44', 0, NULL, NULL),
(555, 'App\\Models\\User', 11, '49.36.185.185', 'PostmanRuntime/7.39.0', '2024-06-09 23:37:04', 1, NULL, 0, NULL, NULL),
(556, 'App\\Models\\User', 11, '103.106.21.26', 'PostmanRuntime/7.39.0', '2024-06-10 00:00:25', 1, NULL, 0, NULL, NULL),
(557, 'App\\Models\\User', 1, '103.106.21.26', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 02:15:52', 1, '2024-06-10 02:55:54', 0, NULL, NULL),
(558, 'App\\Models\\User', 1, '122.161.53.187', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-10 02:52:22', 1, '2024-06-10 03:57:21', 0, NULL, NULL),
(559, 'App\\Models\\User', 3, '103.106.21.26', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 02:56:05', 1, '2024-06-10 06:30:59', 0, NULL, NULL),
(560, 'App\\Models\\User', 11, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:36:15', 1, '2024-06-10 03:36:25', 0, NULL, NULL),
(561, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:36:46', 1, '2024-06-10 06:31:05', 0, NULL, NULL),
(562, 'App\\Models\\User', 11, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:37:20', 1, '2024-06-10 03:38:40', 0, NULL, NULL),
(563, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:39:19', 0, NULL, 0, NULL, NULL),
(564, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:39:25', 0, NULL, 0, NULL, NULL),
(565, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:39:41', 0, NULL, 0, NULL, NULL),
(566, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:39:47', 0, NULL, 0, NULL, NULL),
(567, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:40:10', 0, NULL, 0, NULL, NULL),
(568, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:40:23', 0, NULL, 0, NULL, NULL),
(569, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:40:49', 0, NULL, 0, NULL, NULL),
(570, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:41:25', 0, NULL, 0, NULL, NULL),
(571, 'App\\Models\\User', 60, '124.123.167.149', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-10 03:46:36', 1, '2024-06-10 03:53:21', 0, NULL, NULL),
(572, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:47:32', 0, NULL, 0, NULL, NULL),
(573, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:47:39', 0, NULL, 0, NULL, NULL),
(574, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 03:48:00', 1, NULL, 0, NULL, NULL),
(575, 'App\\Models\\User', 11, '103.106.21.26', 'PostmanRuntime/7.39.0', '2024-06-10 05:03:39', 1, NULL, 0, NULL, NULL),
(576, 'App\\Models\\User', 1, '103.106.21.26', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 06:31:04', 1, NULL, 0, NULL, NULL),
(577, 'App\\Models\\User', 11, '49.36.191.102', 'okhttp/4.9.2', '2024-06-10 06:33:49', 1, NULL, 0, NULL, NULL),
(578, 'App\\Models\\User', 1, '103.106.21.26', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 07:59:45', 1, '2024-06-10 08:02:31', 0, NULL, NULL),
(579, 'App\\Models\\User', 11, '103.106.21.26', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 07:59:56', 1, NULL, 0, NULL, NULL),
(580, 'App\\Models\\User', 1, '103.106.21.26', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 08:09:11', 1, '2024-06-10 08:17:59', 0, NULL, NULL),
(581, 'App\\Models\\User', 1, '49.36.185.185', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 08:16:41', 1, NULL, 0, NULL, NULL),
(582, 'App\\Models\\User', 1, '103.106.21.26', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 08:20:03', 1, NULL, 0, NULL, NULL),
(583, 'App\\Models\\User', 11, '103.238.107.217', 'PostmanRuntime/7.39.0', '2024-06-10 22:30:05', 1, NULL, 0, NULL, NULL),
(584, 'App\\Models\\User', 1, '103.238.107.217', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 22:46:50', 1, '2024-06-10 23:16:00', 0, NULL, NULL),
(585, 'App\\Models\\User', 11, '103.238.107.217', 'PostmanRuntime/7.39.0', '2024-06-10 23:04:00', 1, NULL, 0, NULL, NULL),
(586, 'App\\Models\\User', 11, '103.238.107.217', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 23:16:05', 0, NULL, 0, NULL, NULL),
(587, 'App\\Models\\User', 11, '103.238.107.217', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 23:16:10', 1, '2024-06-10 23:24:12', 0, NULL, NULL),
(588, 'App\\Models\\User', 1, '103.238.107.217', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 23:24:15', 1, '2024-06-10 23:45:30', 0, NULL, NULL),
(589, 'App\\Models\\User', 11, '49.36.191.102', 'PostmanRuntime/7.39.0', '2024-06-10 23:34:39', 1, NULL, 0, NULL, NULL),
(590, 'App\\Models\\User', 1, '49.36.185.185', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-10 23:44:50', 1, '2024-06-11 02:45:25', 0, NULL, NULL),
(591, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 02:36:33', 1, '2024-06-11 02:37:15', 0, NULL, NULL),
(592, 'App\\Models\\User', 11, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 02:37:41', 1, '2024-06-11 02:57:29', 0, NULL, NULL),
(593, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 02:57:32', 1, '2024-06-11 03:15:31', 0, NULL, NULL),
(594, 'App\\Models\\User', 11, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 03:15:45', 1, '2024-06-11 03:36:09', 0, NULL, NULL),
(595, 'App\\Models\\User', 1, '49.36.185.185', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 03:23:38', 1, '2024-06-11 03:46:42', 0, NULL, NULL),
(596, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 03:36:12', 1, '2024-06-11 03:59:40', 0, NULL, NULL),
(597, 'App\\Models\\User', 1, '49.36.185.185', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 03:53:56', 1, NULL, 0, NULL, NULL),
(598, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 03:59:45', 1, '2024-06-11 05:03:12', 0, NULL, NULL),
(599, 'App\\Models\\User', 11, '122.161.51.31', 'okhttp/4.9.2', '2024-06-11 04:10:24', 1, NULL, 0, NULL, NULL),
(600, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-11 04:18:02', 1, NULL, 0, NULL, NULL),
(601, 'App\\Models\\User', 1, '103.106.21.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 04:57:58', 1, '2024-06-11 04:58:18', 0, NULL, NULL),
(602, 'App\\Models\\User', 3, '103.106.21.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 04:58:27', 1, '2024-06-11 04:58:33', 0, NULL, NULL),
(603, 'App\\Models\\User', 1, '103.106.21.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 04:58:37', 1, '2024-06-11 08:07:57', 0, NULL, NULL),
(604, 'App\\Models\\User', 11, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 07:57:35', 1, '2024-06-11 08:03:35', 0, NULL, NULL),
(605, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 08:03:39', 1, '2024-06-11 08:10:42', 0, NULL, NULL),
(606, 'App\\Models\\User', 1, '103.106.21.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 08:07:59', 1, '2024-06-11 08:14:44', 0, NULL, NULL),
(607, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 08:10:49', 1, '2024-06-11 08:21:52', 0, NULL, NULL),
(608, 'App\\Models\\User', 11, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 08:22:09', 1, '2024-06-11 08:23:47', 0, NULL, NULL),
(609, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 08:23:50', 1, '2024-06-11 08:24:24', 0, NULL, NULL),
(610, 'App\\Models\\User', 11, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 08:24:41', 1, '2024-06-11 08:27:18', 0, NULL, NULL),
(611, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 08:27:22', 1, '2024-06-11 08:42:39', 0, NULL, NULL),
(612, 'App\\Models\\User', 11, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 08:42:53', 1, '2024-06-11 08:48:29', 0, NULL, NULL),
(613, 'App\\Models\\User', 11, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 08:48:42', 1, '2024-06-11 08:51:53', 0, NULL, NULL),
(614, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 08:51:56', 1, '2024-06-11 08:59:52', 0, NULL, NULL),
(615, 'App\\Models\\User', 11, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 09:00:09', 1, '2024-06-11 09:01:39', 0, NULL, NULL),
(616, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 09:01:41', 1, '2024-06-11 09:02:49', 0, NULL, NULL),
(617, 'App\\Models\\User', 11, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 09:03:25', 1, '2024-06-11 09:05:17', 0, NULL, NULL),
(618, 'App\\Models\\User', 1, '122.161.51.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 09:05:21', 1, NULL, 0, NULL, NULL),
(619, 'App\\Models\\User', 1, '103.81.94.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 23:03:42', 1, '2024-06-11 23:06:40', 0, NULL, NULL),
(620, 'App\\Models\\User', 11, '103.81.94.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 23:06:47', 1, '2024-06-11 23:17:06', 0, NULL, NULL),
(621, 'App\\Models\\User', 1, '103.81.94.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 23:17:10', 1, '2024-06-11 23:21:14', 0, NULL, NULL),
(622, 'App\\Models\\User', 1, '122.161.52.146', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 23:21:06', 1, '2024-06-11 23:30:28', 0, NULL, NULL),
(623, 'App\\Models\\User', 1, '103.81.94.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 23:21:29', 1, '2024-06-11 23:31:54', 0, NULL, NULL),
(624, 'App\\Models\\User', 1, '122.161.52.146', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-11 23:30:33', 1, '2024-06-12 00:05:13', 0, NULL, NULL),
(625, 'App\\Models\\User', 11, '103.81.94.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 23:32:00', 0, NULL, 0, NULL, NULL),
(626, 'App\\Models\\User', 1, '103.81.94.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-11 23:40:35', 1, NULL, 0, NULL, NULL),
(627, 'App\\Models\\User', 11, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-11 23:40:46', 1, NULL, 0, NULL, NULL),
(628, 'App\\Models\\User', 11, '49.36.189.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-12 00:25:10', 1, '2024-06-12 01:15:50', 0, NULL, NULL),
(629, 'App\\Models\\User', 11, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-12 00:30:59', 1, NULL, 0, NULL, NULL),
(630, 'App\\Models\\User', 1, '49.36.189.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-12 01:20:41', 1, '2024-06-12 02:56:41', 0, NULL, NULL),
(631, 'App\\Models\\User', 1, '152.59.32.241', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', NULL, 0, '2024-06-12 01:29:30', 0, NULL, NULL),
(632, 'App\\Models\\User', 1, '152.59.32.241', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-12 01:29:37', 1, NULL, 0, NULL, NULL),
(633, 'App\\Models\\User', 1, '49.36.189.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-12 02:57:25', 1, NULL, 0, NULL, NULL),
(634, 'App\\Models\\User', 1, '152.59.34.99', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', NULL, 0, '2024-06-12 02:57:50', 0, NULL, NULL),
(635, 'App\\Models\\User', 1, '103.106.21.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-13 01:55:25', 1, '2024-06-13 02:59:22', 0, NULL, NULL),
(636, 'App\\Models\\User', 3, '103.106.21.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-13 01:55:43', 1, NULL, 0, NULL, NULL),
(637, 'App\\Models\\User', 1, '49.36.187.67', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-13 02:34:55', 0, NULL, 0, NULL, NULL),
(638, 'App\\Models\\User', 1, '49.36.187.67', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-13 02:34:58', 1, '2024-06-13 05:00:52', 0, NULL, NULL),
(639, 'App\\Models\\User', 1, '122.161.52.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-13 04:54:40', 1, '2024-06-13 04:54:58', 0, NULL, NULL),
(640, 'App\\Models\\User', 11, '122.161.52.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-13 04:55:35', 0, NULL, 0, NULL, NULL),
(641, 'App\\Models\\User', 11, '122.161.52.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-13 04:55:54', 1, '2024-06-13 07:15:05', 0, NULL, NULL),
(642, 'App\\Models\\User', 1, '103.106.21.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-13 05:02:57', 1, '2024-06-13 07:23:19', 0, NULL, NULL),
(643, 'App\\Models\\User', 1, '122.161.52.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-13 07:15:08', 1, NULL, 0, NULL, NULL),
(644, 'App\\Models\\User', 1, '103.238.107.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-13 18:40:45', 1, '2024-06-13 18:49:49', 0, NULL, NULL),
(645, 'App\\Models\\User', 11, '103.238.107.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-13 18:52:58', 1, '2024-06-13 18:59:43', 0, NULL, NULL),
(646, 'App\\Models\\User', 3, '103.238.107.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-13 18:59:50', 1, '2024-06-13 19:04:07', 0, NULL, NULL),
(647, 'App\\Models\\User', 11, '49.36.189.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-13 23:36:47', 1, '2024-06-13 23:55:43', 0, NULL, NULL),
(648, 'App\\Models\\User', 11, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-13 23:47:44', 1, NULL, 0, NULL, NULL),
(649, 'App\\Models\\User', 57, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-13 23:48:47', 0, NULL, 0, NULL, NULL),
(650, 'App\\Models\\User', 57, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-13 23:49:05', 1, NULL, 0, NULL, NULL),
(651, 'App\\Models\\User', 11, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-13 23:49:21', 1, NULL, 0, NULL, NULL),
(652, 'App\\Models\\User', 1, '27.56.128.190', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-13 23:49:33', 1, NULL, 0, NULL, NULL),
(653, 'App\\Models\\User', 57, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-13 23:49:36', 1, NULL, 0, NULL, NULL),
(654, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-14 00:09:43', 1, '2024-06-14 03:49:12', 0, NULL, NULL),
(655, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-14 00:11:08', 1, NULL, 0, NULL, NULL),
(656, 'App\\Models\\User', 3, '103.238.107.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-14 00:57:27', 1, '2024-06-14 00:57:32', 0, NULL, NULL),
(657, 'App\\Models\\User', 57, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-14 01:14:54', 0, NULL, 0, NULL, NULL),
(658, 'App\\Models\\User', 57, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-14 01:15:00', 1, NULL, 0, NULL, NULL),
(659, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-14 01:19:37', 1, NULL, 0, NULL, NULL),
(660, 'App\\Models\\User', 11, '49.36.189.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-14 01:29:35', 1, NULL, 0, NULL, NULL),
(661, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-14 03:39:54', 0, NULL, 0, NULL, NULL),
(662, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-14 03:40:01', 1, NULL, 0, NULL, NULL),
(663, 'App\\Models\\User', 1, '103.238.107.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-14 03:48:31', 1, '2024-06-14 04:20:59', 0, NULL, NULL),
(664, 'App\\Models\\User', 57, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-14 03:50:06', 0, NULL, 0, NULL, NULL),
(665, 'App\\Models\\User', 57, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-14 03:50:11', 1, NULL, 0, NULL, NULL),
(666, 'App\\Models\\User', 39, '103.238.107.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-14 03:51:26', 1, '2024-06-14 04:38:08', 0, NULL, NULL),
(667, 'App\\Models\\User', 11, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-14 03:52:43', 1, '2024-06-14 03:54:21', 0, NULL, NULL),
(668, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-14 03:54:33', 1, '2024-06-14 04:56:46', 0, NULL, NULL),
(669, 'App\\Models\\User', 1, '103.238.107.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-14 04:28:14', 1, NULL, 0, NULL, NULL),
(670, 'App\\Models\\User', 60, '103.238.107.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-14 04:38:30', 1, NULL, 0, NULL, NULL),
(671, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-14 06:12:08', 1, NULL, 0, NULL, NULL),
(672, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-14 06:14:06', 1, NULL, 0, NULL, NULL),
(673, 'App\\Models\\User', 11, '103.238.107.19', 'PostmanRuntime/7.39.0', '2024-06-14 07:59:49', 1, NULL, 0, NULL, NULL),
(674, 'App\\Models\\User', 11, '49.36.189.205', 'PostmanRuntime/7.39.0', '2024-06-14 08:13:48', 1, NULL, 0, NULL, NULL),
(675, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-15 01:25:47', 0, NULL, 0, NULL, NULL),
(676, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-15 01:25:55', 1, '2024-06-15 02:28:40', 0, NULL, NULL),
(677, 'App\\Models\\User', 61, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-15 01:28:38', 1, '2024-06-15 01:54:29', 0, NULL, NULL),
(678, 'App\\Models\\User', 61, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-15 01:54:25', 1, '2024-06-15 01:54:39', 0, NULL, NULL),
(679, 'App\\Models\\User', 50, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-15 01:54:54', 0, NULL, 0, NULL, NULL),
(680, 'App\\Models\\User', 61, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-15 01:55:26', 1, '2024-06-15 01:55:33', 0, NULL, NULL),
(681, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-15 01:55:49', 0, NULL, 0, NULL, NULL),
(682, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', '2024-06-15 01:55:54', 1, '2024-06-15 02:29:53', 0, NULL, NULL),
(683, 'App\\Models\\User', 1, '103.106.21.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-15 02:19:50', 1, '2024-06-15 02:24:46', 0, NULL, NULL),
(684, 'App\\Models\\User', 60, '103.106.21.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-15 02:24:52', 1, '2024-06-15 02:36:39', 0, NULL, NULL),
(685, 'App\\Models\\User', 1, '103.106.21.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-15 02:25:39', 1, NULL, 0, NULL, NULL),
(686, 'App\\Models\\User', 61, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-15 02:30:18', 1, NULL, 0, NULL, NULL),
(687, 'App\\Models\\User', 1, '103.106.21.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-15 02:36:49', 1, '2024-06-15 02:41:48', 0, NULL, NULL),
(688, 'App\\Models\\User', 56, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 12:48:50', 1, NULL, 0, NULL, NULL),
(689, 'App\\Models\\User', 1, '49.36.189.125', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-16 12:49:13', 1, NULL, 0, NULL, NULL),
(690, 'App\\Models\\User', 56, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 12:50:46', 1, NULL, 0, NULL, NULL),
(691, 'App\\Models\\User', 56, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 12:50:49', 1, NULL, 0, NULL, NULL),
(692, 'App\\Models\\User', 56, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 12:51:28', 1, NULL, 0, NULL, NULL),
(693, 'App\\Models\\User', 56, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 12:52:01', 1, NULL, 0, NULL, NULL),
(694, 'App\\Models\\User', 56, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 12:52:29', 1, NULL, 0, NULL, NULL),
(695, 'App\\Models\\User', 11, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 12:52:47', 1, NULL, 0, NULL, NULL),
(696, 'App\\Models\\User', 62, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 12:55:12', 1, NULL, 0, NULL, NULL),
(697, 'App\\Models\\User', 62, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 12:55:58', 1, NULL, 0, NULL, NULL),
(698, 'App\\Models\\User', 11, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 12:57:48', 1, NULL, 0, NULL, NULL),
(699, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-16 22:09:27', 1, NULL, 0, NULL, NULL),
(700, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-16 22:12:30', 1, NULL, 0, NULL, NULL),
(701, 'App\\Models\\User', 11, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-16 22:13:09', 1, NULL, 0, NULL, NULL),
(702, 'App\\Models\\User', 11, '49.36.189.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-16 23:05:44', 1, '2024-06-16 23:48:39', 0, NULL, NULL),
(703, 'App\\Models\\User', 11, '103.238.107.110', 'PostmanRuntime/7.39.0', '2024-06-16 23:29:06', 1, NULL, 0, NULL, NULL),
(704, 'App\\Models\\User', 11, '49.36.189.125', 'PostmanRuntime/7.39.0', '2024-06-16 23:30:17', 1, NULL, 0, NULL, NULL),
(705, 'App\\Models\\User', 11, '49.36.189.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-16 23:49:23', 1, NULL, 0, NULL, NULL),
(706, 'App\\Models\\User', 11, '223.181.162.136', 'okhttp/4.9.2', '2024-06-18 00:08:22', 1, NULL, 0, NULL, NULL),
(707, 'App\\Models\\User', 11, '223.181.162.136', 'okhttp/4.9.2', '2024-06-18 01:14:12', 1, NULL, 0, NULL, NULL),
(708, 'App\\Models\\User', 11, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-18 02:27:45', 1, NULL, 0, NULL, NULL),
(709, 'App\\Models\\User', 11, '49.36.191.115', 'PostmanRuntime/7.39.0', '2024-06-18 02:29:19', 1, NULL, 0, NULL, NULL),
(710, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-18 02:29:25', 1, NULL, 0, NULL, NULL),
(711, 'App\\Models\\User', 11, '49.36.189.168', 'PostmanRuntime/7.39.0', '2024-06-18 02:49:51', 1, NULL, 0, NULL, NULL),
(712, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-18 02:50:20', 1, NULL, 0, NULL, NULL),
(713, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-18 02:50:20', 1, NULL, 0, NULL, NULL),
(714, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-18 02:50:21', 1, NULL, 0, NULL, NULL),
(715, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-18 02:50:23', 1, NULL, 0, NULL, NULL),
(716, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-18 02:50:24', 1, NULL, 0, NULL, NULL),
(717, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-18 02:50:25', 1, NULL, 0, NULL, NULL),
(718, 'App\\Models\\User', 11, '49.36.189.168', 'okhttp/4.9.2', '2024-06-18 02:50:25', 1, NULL, 0, NULL, NULL),
(719, 'App\\Models\\User', 1, '49.36.189.124', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-18 08:07:38', 1, '2024-06-18 08:09:29', 0, NULL, NULL),
(720, 'App\\Models\\User', 11, '49.36.189.124', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-18 08:09:34', 1, '2024-06-18 08:10:12', 0, NULL, NULL),
(721, 'App\\Models\\User', 1, '49.36.189.124', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-18 08:10:17', 1, NULL, 0, NULL, NULL),
(722, 'App\\Models\\User', 11, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 01:58:10', 1, NULL, 0, NULL, NULL),
(723, 'App\\Models\\User', 1, '49.36.191.114', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-19 02:05:57', 1, '2024-06-19 02:09:37', 0, NULL, NULL),
(724, 'App\\Models\\User', 1, '49.36.189.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-19 02:09:17', 1, '2024-06-19 02:09:49', 0, NULL, NULL),
(725, 'App\\Models\\User', 1, '49.36.191.114', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-19 02:09:49', 1, '2024-06-19 02:10:31', 0, NULL, NULL),
(726, 'App\\Models\\User', 1, '49.36.189.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-19 02:10:28', 1, '2024-06-19 02:11:06', 0, NULL, NULL),
(727, 'App\\Models\\User', 1, '49.36.191.114', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', '2024-06-19 02:11:02', 1, '2024-06-19 02:25:32', 0, NULL, NULL),
(728, 'App\\Models\\User', 1, '49.36.189.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-19 02:12:12', 0, NULL, 0, NULL, NULL),
(729, 'App\\Models\\User', 1, '49.36.189.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-19 02:12:16', 1, '2024-06-19 02:13:08', 0, NULL, NULL),
(730, 'App\\Models\\User', 63, '49.36.189.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-19 02:13:43', 1, NULL, 0, NULL, NULL),
(731, 'App\\Models\\User', 64, '49.36.191.114', 'okhttp/4.9.2', '2024-06-19 02:15:55', 1, NULL, 0, NULL, NULL),
(732, 'App\\Models\\User', 64, '49.36.191.114', 'okhttp/4.9.2', '2024-06-19 02:16:04', 1, NULL, 0, NULL, NULL),
(733, 'App\\Models\\User', 64, '49.36.191.114', 'PostmanRuntime/7.39.0', '2024-06-19 02:16:59', 1, NULL, 0, NULL, NULL),
(734, 'App\\Models\\User', 64, '49.36.191.114', 'PostmanRuntime/7.39.0', '2024-06-19 02:17:12', 1, NULL, 0, NULL, NULL),
(735, 'App\\Models\\User', 64, '49.36.189.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-19 02:18:26', 1, '2024-06-19 02:23:56', 0, NULL, NULL),
(736, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:21:40', 1, NULL, 0, NULL, NULL),
(737, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:21:51', 1, NULL, 0, NULL, NULL),
(738, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:22:17', 1, NULL, 0, NULL, NULL),
(739, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:22:34', 1, NULL, 0, NULL, NULL),
(740, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:22:39', 1, NULL, 0, NULL, NULL),
(741, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:22:47', 1, NULL, 0, NULL, NULL),
(742, 'App\\Models\\User', 11, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:22:59', 1, NULL, 0, NULL, NULL),
(743, 'App\\Models\\User', 11, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:24:23', 1, NULL, 0, NULL, NULL),
(744, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:24:32', 1, NULL, 0, NULL, NULL),
(745, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:24:38', 1, NULL, 0, NULL, NULL),
(746, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:24:40', 1, NULL, 0, NULL, NULL),
(747, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 02:24:52', 1, NULL, 0, NULL, NULL),
(748, 'App\\Models\\User', 64, '49.36.189.37', 'PostmanRuntime/7.39.0', '2024-06-19 03:00:36', 1, NULL, 0, NULL, NULL),
(749, 'App\\Models\\User', 11, '49.36.191.114', 'okhttp/4.9.2', '2024-06-19 03:10:18', 1, NULL, 0, NULL, NULL),
(750, 'App\\Models\\User', 11, '223.181.162.136', 'okhttp/4.9.2', '2024-06-19 07:03:35', 1, NULL, 0, NULL, NULL),
(751, 'App\\Models\\User', 64, '49.36.191.75', 'PostmanRuntime/7.39.0', '2024-06-19 23:42:28', 1, NULL, 0, NULL, NULL),
(752, 'App\\Models\\User', 64, '49.36.191.75', 'PostmanRuntime/7.39.0', '2024-06-19 23:42:32', 1, NULL, 0, NULL, NULL),
(753, 'App\\Models\\User', 64, '49.36.191.75', 'PostmanRuntime/7.39.0', '2024-06-19 23:47:33', 1, NULL, 0, NULL, NULL),
(754, 'App\\Models\\User', 64, '49.36.191.75', 'PostmanRuntime/7.39.0', '2024-06-19 23:47:35', 1, NULL, 0, NULL, NULL),
(755, 'App\\Models\\User', 64, '49.36.191.75', 'PostmanRuntime/7.39.0', '2024-06-19 23:47:38', 1, NULL, 0, NULL, NULL),
(756, 'App\\Models\\User', 64, '103.106.20.126', 'PostmanRuntime/7.39.0', '2024-06-19 23:56:59', 1, NULL, 0, NULL, NULL),
(757, 'App\\Models\\User', 64, '152.58.60.162', 'PostmanRuntime/7.39.0', '2024-06-19 23:58:21', 1, NULL, 0, NULL, NULL),
(758, 'App\\Models\\User', 64, '152.58.60.162', 'PostmanRuntime/7.39.0', '2024-06-20 00:01:05', 1, NULL, 0, NULL, NULL),
(759, 'App\\Models\\User', 64, '152.58.60.162', 'PostmanRuntime/7.39.0', '2024-06-20 00:01:09', 1, NULL, 0, NULL, NULL),
(760, 'App\\Models\\User', 64, '152.58.60.162', 'PostmanRuntime/7.39.0', '2024-06-20 00:02:38', 1, NULL, 0, NULL, NULL),
(761, 'App\\Models\\User', 1, '122.161.51.69', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-20 03:21:29', 1, '2024-06-20 07:56:54', 0, NULL, NULL),
(762, 'App\\Models\\User', 1, '103.106.21.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-20 07:04:29', 1, NULL, 0, NULL, NULL),
(763, 'App\\Models\\User', 1, '103.85.11.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', NULL, 0, '2024-06-20 13:39:11', 0, NULL, NULL),
(764, 'App\\Models\\User', 11, '103.85.11.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-20 13:39:20', 1, NULL, 0, NULL, NULL),
(765, 'App\\Models\\User', 1, '103.106.21.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-20 23:58:17', 1, '2024-06-20 23:58:34', 0, NULL, NULL),
(766, 'App\\Models\\User', 11, '103.106.21.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-20 23:58:39', 0, NULL, 0, NULL, NULL),
(767, 'App\\Models\\User', 11, '103.106.21.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-20 23:58:42', 1, '2024-06-20 23:59:10', 0, NULL, NULL),
(768, 'App\\Models\\User', 1, '103.106.21.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-20 23:59:17', 1, NULL, 0, NULL, NULL),
(769, 'App\\Models\\User', 64, '49.36.189.48', 'PostmanRuntime/7.39.0', '2024-06-20 23:59:23', 1, NULL, 0, NULL, NULL),
(770, 'App\\Models\\User', 11, '49.36.189.48', 'PostmanRuntime/7.39.0', '2024-06-20 23:59:32', 1, NULL, 0, NULL, NULL),
(771, 'App\\Models\\User', 11, '49.36.189.48', 'PostmanRuntime/7.39.0', '2024-06-21 02:00:47', 1, NULL, 0, NULL, NULL),
(772, 'App\\Models\\User', 63, '49.36.191.175', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-21 02:05:00', 0, NULL, 0, NULL, NULL),
(773, 'App\\Models\\User', 63, '49.36.191.175', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-21 02:05:03', 1, NULL, 0, NULL, NULL),
(774, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-06-21 04:00:55', 1, NULL, 0, NULL, NULL),
(775, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-06-23 23:04:51', 1, NULL, 0, NULL, NULL),
(776, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-06-23 23:27:27', 1, NULL, 0, NULL, NULL),
(777, 'App\\Models\\User', 1, '103.85.11.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-24 01:06:25', 1, NULL, 0, NULL, NULL),
(778, 'App\\Models\\User', 1, '103.85.11.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 00:07:19', 1, '2024-06-25 00:12:37', 0, NULL, NULL),
(779, 'App\\Models\\User', 11, '103.85.11.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 00:12:44', 0, NULL, 0, NULL, NULL),
(780, 'App\\Models\\User', 11, '103.85.11.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 00:12:49', 0, NULL, 0, NULL, NULL),
(781, 'App\\Models\\User', 11, '103.85.11.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 00:12:54', 0, NULL, 0, NULL, NULL),
(782, 'App\\Models\\User', 11, '103.85.11.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 00:12:58', 1, '2024-06-25 00:13:21', 0, NULL, NULL),
(783, 'App\\Models\\User', 1, '103.85.11.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 00:13:24', 1, NULL, 0, NULL, NULL),
(784, 'App\\Models\\User', 1, '49.36.189.48', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 01:05:02', 1, NULL, 0, NULL, NULL),
(785, 'App\\Models\\User', 64, '49.36.189.48', 'PostmanRuntime/7.39.0', '2024-06-25 01:07:12', 1, NULL, 0, NULL, NULL),
(786, 'App\\Models\\User', 64, '49.36.189.48', 'okhttp/4.9.2', '2024-06-25 01:07:53', 1, NULL, 0, NULL, NULL),
(787, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', NULL, 0, '2024-06-25 01:10:32', 0, NULL, NULL),
(788, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-06-25 01:27:41', 1, NULL, 0, NULL, NULL),
(789, 'App\\Models\\User', 63, '49.36.191.27', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 01:43:55', 0, NULL, 0, NULL, NULL),
(790, 'App\\Models\\User', 63, '49.36.191.27', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 01:44:01', 1, NULL, 0, NULL, NULL),
(791, 'App\\Models\\User', 64, '49.36.189.48', 'PostmanRuntime/7.39.0', '2024-06-25 01:45:01', 1, NULL, 0, NULL, NULL),
(792, 'App\\Models\\User', 11, '49.36.189.48', 'PostmanRuntime/7.39.0', '2024-06-25 01:45:45', 1, NULL, 0, NULL, NULL),
(793, 'App\\Models\\User', 11, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 02:53:19', 0, NULL, 0, NULL, NULL),
(794, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-25 02:53:32', 1, NULL, 0, NULL, NULL),
(795, 'App\\Models\\User', 60, '122.175.11.103', 'okhttp/4.9.2', '2024-06-25 03:57:40', 1, NULL, 0, NULL, NULL),
(796, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0', '2024-06-25 04:10:40', 1, NULL, 0, NULL, NULL),
(797, 'App\\Models\\User', 11, '49.36.189.48', 'okhttp/4.9.2', '2024-06-25 04:17:21', 1, NULL, 0, NULL, NULL),
(798, 'App\\Models\\User', 11, '122.161.52.244', 'okhttp/4.9.2', '2024-06-25 04:36:14', 0, NULL, 0, NULL, NULL),
(799, 'App\\Models\\User', 11, '122.161.52.244', 'okhttp/4.9.2', '2024-06-25 04:36:22', 0, NULL, 0, NULL, NULL),
(800, 'App\\Models\\User', 11, '122.161.52.244', 'okhttp/4.9.2', '2024-06-25 04:37:26', 1, NULL, 0, NULL, NULL),
(801, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-26 00:21:28', 1, '2024-06-26 00:29:38', 0, NULL, NULL),
(802, 'App\\Models\\User', 61, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-26 00:29:49', 1, NULL, 0, NULL, NULL),
(803, 'App\\Models\\User', 11, '49.36.191.27', 'PostmanRuntime/7.39.0', '2024-06-26 00:45:50', 0, NULL, 0, NULL, NULL),
(804, 'App\\Models\\User', 11, '49.36.191.27', 'PostmanRuntime/7.39.0', '2024-06-26 00:46:05', 1, NULL, 0, NULL, NULL),
(805, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-26 01:35:44', 0, NULL, 0, NULL, NULL),
(806, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-26 01:35:52', 1, NULL, 0, NULL, NULL),
(807, 'App\\Models\\User', 60, '122.175.11.103', 'okhttp/4.9.2', '2024-06-26 01:36:24', 0, NULL, 0, NULL, NULL),
(808, 'App\\Models\\User', 60, '122.175.11.103', 'okhttp/4.9.2', '2024-06-26 01:36:33', 1, NULL, 0, NULL, NULL),
(809, 'App\\Models\\User', 11, '49.36.191.27', 'PostmanRuntime/7.39.0', '2024-06-26 04:51:13', 1, NULL, 0, NULL, NULL),
(810, 'App\\Models\\User', 1, '81.17.122.187', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-26 23:18:14', 1, NULL, 0, NULL, NULL),
(811, 'App\\Models\\User', 60, '122.175.11.103', 'okhttp/4.9.2', '2024-06-27 01:27:47', 1, NULL, 0, NULL, NULL),
(812, 'App\\Models\\User', 40, '49.36.191.147', 'okhttp/4.9.2', '2024-06-27 01:56:39', 0, NULL, 0, NULL, NULL),
(813, 'App\\Models\\User', 40, '49.36.191.147', 'okhttp/4.9.2', '2024-06-27 01:57:38', 0, NULL, 0, NULL, NULL),
(814, 'App\\Models\\User', 40, '49.36.191.147', 'okhttp/4.9.2', '2024-06-27 01:57:45', 0, NULL, 0, NULL, NULL),
(815, 'App\\Models\\User', 3, '122.161.53.207', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-27 04:01:56', 1, '2024-06-27 04:08:23', 0, NULL, NULL),
(816, 'App\\Models\\User', 1, '122.161.53.207', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-27 04:08:26', 1, '2024-06-27 04:21:10', 0, NULL, NULL),
(817, 'App\\Models\\User', 11, '122.161.53.207', 'okhttp/4.9.2', '2024-06-27 04:14:21', 1, NULL, 0, NULL, NULL),
(818, 'App\\Models\\User', 11, '122.161.53.207', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-27 04:21:39', 0, NULL, 0, NULL, NULL),
(819, 'App\\Models\\User', 11, '122.161.53.207', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-27 04:21:58', 0, NULL, 0, NULL, NULL),
(820, 'App\\Models\\User', 11, '122.161.53.207', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-27 04:22:01', 0, NULL, 0, NULL, NULL),
(821, 'App\\Models\\User', 11, '122.161.53.207', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-27 04:23:25', 0, NULL, 0, NULL, NULL);
INSERT INTO `authentication_log` (`id`, `authenticatable_type`, `authenticatable_id`, `ip_address`, `user_agent`, `login_at`, `login_successful`, `logout_at`, `cleared_by_user`, `location`, `team_id`) VALUES
(822, 'App\\Models\\User', 1, '122.161.53.207', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-27 04:23:37', 1, '2024-06-27 04:23:42', 0, NULL, NULL),
(823, 'App\\Models\\User', 11, '122.161.53.207', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-27 04:24:00', 0, NULL, 0, NULL, NULL),
(824, 'App\\Models\\User', 11, '122.161.53.207', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-06-27 04:24:24', 1, NULL, 0, NULL, NULL),
(825, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-27 04:30:46', 0, NULL, 0, NULL, NULL),
(826, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-27 04:30:52', 1, NULL, 0, NULL, NULL),
(827, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-27 23:10:02', 1, '2024-06-28 03:49:33', 0, NULL, NULL),
(828, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-27 23:16:07', 1, '2024-06-28 06:12:09', 0, NULL, NULL),
(829, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-28 02:56:17', 1, '2024-06-28 03:53:26', 0, NULL, NULL),
(830, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-28 03:49:50', 1, '2024-06-28 03:54:09', 0, NULL, NULL),
(831, 'App\\Models\\User', 1, '103.106.21.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-28 03:53:31', 1, NULL, 0, NULL, NULL),
(832, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-28 05:57:32', 1, NULL, 0, NULL, NULL),
(833, 'App\\Models\\User', 60, '122.175.11.103', 'okhttp/4.9.2', '2024-06-28 06:08:47', 1, NULL, 0, NULL, NULL),
(834, 'App\\Models\\User', 61, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-28 06:51:05', 1, '2024-06-28 06:51:20', 0, NULL, NULL),
(835, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-28 06:51:34', 1, NULL, 0, NULL, NULL),
(836, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-28 23:27:27', 0, NULL, 0, NULL, NULL),
(837, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-28 23:27:38', 1, NULL, 0, NULL, NULL),
(838, 'App\\Models\\User', 60, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0', '2024-06-29 01:18:28', 1, NULL, 0, NULL, NULL),
(839, 'App\\Models\\User', 11, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-29 05:33:43', 0, NULL, 0, NULL, NULL),
(840, 'App\\Models\\User', 1, '122.175.11.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-06-29 05:33:50', 1, '2024-06-29 05:44:32', 0, NULL, NULL),
(841, 'App\\Models\\User', 1, '122.175.11.103', 'okhttp/4.9.2', '2024-06-29 05:39:15', 1, NULL, 0, NULL, NULL),
(842, 'App\\Models\\User', 1, '122.161.50.235', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-07-01 01:33:05', 1, '2024-07-01 02:04:06', 0, NULL, NULL),
(843, 'App\\Models\\User', 1, '103.106.21.20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-01 01:53:25', 1, '2024-07-01 03:14:29', 0, NULL, NULL),
(844, 'App\\Models\\User', 1, '122.161.50.235', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-07-01 03:11:56', 1, NULL, 0, NULL, NULL),
(845, 'App\\Models\\User', 11, '103.106.21.20', 'PostmanRuntime/7.39.0', '2024-07-02 03:26:01', 0, NULL, 0, NULL, NULL),
(846, 'App\\Models\\User', 11, '103.106.21.20', 'PostmanRuntime/7.39.0', '2024-07-02 03:26:10', 0, NULL, 0, NULL, NULL),
(847, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 03:26:31', 1, NULL, 0, NULL, NULL),
(848, 'App\\Models\\User', 11, '103.106.21.20', 'PostmanRuntime/7.39.0', '2024-07-02 03:26:46', 0, NULL, 0, NULL, NULL),
(849, 'App\\Models\\User', 11, '122.161.49.60', 'okhttp/4.9.2', '2024-07-02 03:26:47', 1, NULL, 0, NULL, NULL),
(850, 'App\\Models\\User', 11, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 03:26:51', 0, NULL, 0, NULL, NULL),
(851, 'App\\Models\\User', 11, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 03:26:57', 1, NULL, 0, NULL, NULL),
(852, 'App\\Models\\User', 11, '49.36.191.222', 'okhttp/4.9.2', '2024-07-02 03:27:45', 1, NULL, 0, NULL, NULL),
(853, 'App\\Models\\User', 11, '122.161.49.60', 'okhttp/4.9.2', '2024-07-02 03:30:24', 1, NULL, 0, NULL, NULL),
(854, 'App\\Models\\User', 1, '49.36.191.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-02 03:43:13', 1, '2024-07-02 03:48:19', 0, NULL, NULL),
(855, 'App\\Models\\User', 11, '49.36.189.205', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-02 04:35:31', 0, NULL, 0, NULL, NULL),
(856, 'App\\Models\\User', 11, '49.36.189.205', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-02 04:35:41', 1, NULL, 0, NULL, NULL),
(857, 'App\\Models\\User', 1, '122.161.49.60', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-07-02 07:04:25', 1, NULL, 0, NULL, NULL),
(858, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:42:46', 0, NULL, 0, NULL, NULL),
(859, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:42:53', 1, NULL, 0, NULL, NULL),
(860, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:42:59', 0, NULL, 0, NULL, NULL),
(861, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:01', 0, NULL, 0, NULL, NULL),
(862, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:04', 0, NULL, 0, NULL, NULL),
(863, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:06', 0, NULL, 0, NULL, NULL),
(864, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:08', 0, NULL, 0, NULL, NULL),
(865, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:12', 0, NULL, 0, NULL, NULL),
(866, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:14', 0, NULL, 0, NULL, NULL),
(867, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:17', 0, NULL, 0, NULL, NULL),
(868, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:19', 0, NULL, 0, NULL, NULL),
(869, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:21', 0, NULL, 0, NULL, NULL),
(870, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:23', 0, NULL, 0, NULL, NULL),
(871, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:26', 0, NULL, 0, NULL, NULL),
(872, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:28', 0, NULL, 0, NULL, NULL),
(873, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:30', 0, NULL, 0, NULL, NULL),
(874, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:32', 0, NULL, 0, NULL, NULL),
(875, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:34', 0, NULL, 0, NULL, NULL),
(876, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:36', 0, NULL, 0, NULL, NULL),
(877, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-02 09:43:38', 0, NULL, 0, NULL, NULL),
(878, 'App\\Models\\User', 11, '49.36.191.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-02 09:48:28', 0, NULL, 0, NULL, NULL),
(879, 'App\\Models\\User', 11, '49.36.191.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-02 09:48:39', 1, NULL, 0, NULL, NULL),
(880, 'App\\Models\\User', 63, '49.36.189.205', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-02 23:59:36', 1, NULL, 0, NULL, NULL),
(881, 'App\\Models\\User', 1, '49.36.191.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-03 00:00:15', 1, NULL, 0, NULL, NULL),
(882, 'App\\Models\\User', 11, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-03 00:03:41', 1, NULL, 0, NULL, NULL),
(883, 'App\\Models\\User', 64, '49.36.189.205', 'PostmanRuntime/7.39.0', '2024-07-03 00:03:50', 1, NULL, 0, NULL, NULL),
(884, 'App\\Models\\User', 1, '103.106.21.20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-03 05:00:18', 1, NULL, 0, NULL, NULL),
(885, 'App\\Models\\User', 11, '103.106.21.20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-03 05:00:35', 0, NULL, 0, NULL, NULL),
(886, 'App\\Models\\User', 11, '103.106.21.20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-03 05:00:39', 0, NULL, 0, NULL, NULL),
(887, 'App\\Models\\User', 11, '103.106.21.20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-03 05:00:47', 0, NULL, 0, NULL, NULL),
(888, 'App\\Models\\User', 11, '103.106.21.20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-03 05:00:55', 0, NULL, 0, NULL, NULL),
(889, 'App\\Models\\User', 11, '103.106.21.20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-03 05:01:29', 1, '2024-07-03 05:22:35', 0, NULL, NULL),
(890, 'App\\Models\\User', 11, '103.106.21.20', 'PostmanRuntime/7.39.0', '2024-07-03 05:20:48', 1, NULL, 0, NULL, NULL),
(891, 'App\\Models\\User', 11, '103.106.21.20', 'PostmanRuntime/7.39.0', '2024-07-03 05:21:13', 0, NULL, 0, NULL, NULL),
(892, 'App\\Models\\User', 11, '103.106.21.20', 'PostmanRuntime/7.39.0', '2024-07-03 05:21:20', 1, NULL, 0, NULL, NULL),
(893, 'App\\Models\\User', 11, '103.106.21.20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-03 05:22:44', 1, NULL, 0, NULL, NULL),
(894, 'App\\Models\\User', 1, '49.36.191.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-04 04:30:01', 1, '2024-07-04 05:37:53', 0, NULL, NULL),
(895, 'App\\Models\\User', 1, '122.161.49.60', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '2024-07-04 04:57:42', 1, '2024-07-04 06:16:57', 0, NULL, NULL),
(896, 'App\\Models\\User', 11, '49.36.191.222', 'okhttp/4.9.2', '2024-07-04 05:34:28', 0, NULL, 0, NULL, NULL),
(897, 'App\\Models\\User', 11, '49.36.191.222', 'okhttp/4.9.2', '2024-07-04 05:34:34', 0, NULL, 0, NULL, NULL),
(898, 'App\\Models\\User', 11, '49.36.191.222', 'okhttp/4.9.2', '2024-07-04 05:34:50', 0, NULL, 0, NULL, NULL),
(899, 'App\\Models\\User', 11, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-04 05:35:23', 0, NULL, 0, NULL, NULL),
(900, 'App\\Models\\User', 11, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-04 05:35:32', 0, NULL, 0, NULL, NULL),
(901, 'App\\Models\\User', 11, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-04 05:35:40', 0, NULL, 0, NULL, NULL),
(902, 'App\\Models\\User', 11, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-04 05:35:51', 0, NULL, 0, NULL, NULL),
(903, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-04 05:36:07', 0, NULL, 0, NULL, NULL),
(904, 'App\\Models\\User', 57, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-04 05:36:14', 1, NULL, 0, NULL, NULL),
(905, 'App\\Models\\User', 11, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-04 05:36:51', 0, NULL, 0, NULL, NULL),
(906, 'App\\Models\\User', 11, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-04 05:36:56', 0, NULL, 0, NULL, NULL),
(907, 'App\\Models\\User', 11, '49.36.191.222', 'PostmanRuntime/7.39.0', '2024-07-04 05:37:04', 1, NULL, 0, NULL, NULL),
(908, 'App\\Models\\User', 11, '49.36.191.222', 'okhttp/4.9.2', '2024-07-04 05:37:19', 1, NULL, 0, NULL, NULL),
(909, 'App\\Models\\User', 1, '49.36.191.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', '2024-07-04 05:38:02', 1, NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `batches`
--

CREATE TABLE `batches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `course_package_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `manager_id` int(11) NOT NULL,
  `attendance_setting` tinyint(4) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `allow_edit_class_time` tinyint(4) DEFAULT NULL,
  `allow_edit_class_date` tinyint(4) DEFAULT NULL,
  `curriculum_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batches`
--

INSERT INTO `batches` (`id`, `team_id`, `branch_id`, `course_package_id`, `course_id`, `name`, `manager_id`, `attendance_setting`, `start_date`, `end_date`, `allow_edit_class_time`, `allow_edit_class_date`, `curriculum_data`, `created_at`, `updated_at`) VALUES
(5, 2, 2, 2, NULL, '2', 10, NULL, '2024-05-07', '2024-05-11', NULL, NULL, NULL, '2024-05-08 03:22:55', '2024-05-08 03:22:55'),
(23, 2, 2, 4, NULL, 'Desf', 3, NULL, '2024-06-11', '2024-06-30', NULL, NULL, NULL, '2024-06-10 22:47:31', '2024-06-10 22:47:31'),
(25, 2, 2, 4, NULL, 'Test 1206', 3, NULL, '2024-06-12', '2024-06-30', NULL, NULL, NULL, '2024-06-11 23:05:14', '2024-06-11 23:05:14'),
(26, 2, 2, 4, NULL, 'Batch 1200006', 61, NULL, '2024-06-14', '2024-06-30', NULL, NULL, NULL, '2024-06-11 23:19:45', '2024-06-11 23:19:45'),
(27, 1, 1, 33, NULL, 'CL June 2024', 3, NULL, '2024-06-28', '2024-07-31', NULL, NULL, NULL, '2024-06-27 23:12:29', '2024-06-27 23:12:29');

-- --------------------------------------------------------

--
-- Table structure for table `batch_courses`
--

CREATE TABLE `batch_courses` (
  `batch_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batch_courses`
--

INSERT INTO `batch_courses` (`batch_id`, `course_id`, `created_at`, `updated_at`) VALUES
(3, 4, NULL, NULL),
(4, 2, NULL, NULL),
(4, 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `batch_curriculum`
--

CREATE TABLE `batch_curriculum` (
  `id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `curriculum_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batch_curriculum`
--

INSERT INTO `batch_curriculum` (`id`, `batch_id`, `curriculum_id`, `tutor_id`, `created_at`, `updated_at`) VALUES
(2, 1, 63, 7, '2024-05-02 05:17:19', '2024-05-02 05:17:19'),
(3, 5, 2, 39, '2024-05-08 03:22:55', '2024-05-08 03:22:55'),
(4, 5, 63, 7, '2024-05-08 03:22:55', '2024-05-08 03:22:55'),
(5, 5, 62, 11, '2024-05-08 03:22:55', '2024-05-08 03:22:55'),
(6, 5, 64, 11, '2024-05-08 03:22:55', '2024-05-08 03:22:55'),
(7, 6, 62, 10, '2024-05-08 03:25:03', '2024-06-25 00:08:48'),
(8, 6, 63, 61, '2024-05-08 03:25:03', '2024-06-25 00:08:48'),
(9, 6, 65, 3, '2024-05-08 03:25:03', '2024-06-25 00:08:48'),
(10, 7, 63, 39, '2024-05-15 10:18:36', '2024-05-15 10:18:36'),
(11, 7, 70, 3, '2024-05-15 10:18:36', '2024-05-15 10:18:36'),
(12, 8, 65, 3, '2024-05-15 10:23:11', '2024-05-15 10:23:11'),
(13, 8, 64, 7, '2024-05-15 10:23:11', '2024-05-15 10:23:11'),
(14, 8, 66, 57, '2024-05-15 10:23:11', '2024-05-15 10:23:11'),
(15, 9, 74, 56, '2024-05-15 10:24:48', '2024-05-15 10:24:48'),
(16, 9, 75, 48, '2024-05-15 10:24:48', '2024-05-15 10:24:48'),
(17, 9, 68, 46, '2024-05-15 10:24:48', '2024-05-15 10:24:48'),
(18, 10, 73, 49, '2024-05-15 10:26:06', '2024-05-15 10:26:06'),
(19, 10, 71, 40, '2024-05-15 10:26:06', '2024-05-15 10:26:06'),
(20, 10, 69, 40, '2024-05-15 10:26:06', '2024-05-15 10:26:06'),
(21, 11, 62, 10, '2024-05-15 10:29:31', '2024-06-12 01:23:29'),
(22, 11, 63, 61, '2024-05-15 10:29:31', '2024-06-12 01:23:29'),
(23, 11, 67, 10, '2024-05-15 10:29:31', '2024-06-13 01:57:02'),
(24, 12, 65, 57, '2024-05-15 10:30:37', '2024-05-15 10:30:37'),
(25, 12, 68, 4, '2024-05-15 10:30:37', '2024-05-15 10:30:37'),
(26, 12, 67, 7, '2024-05-15 10:30:37', '2024-05-15 10:30:37'),
(27, 13, 67, 47, '2024-05-15 10:31:47', '2024-05-15 10:31:47'),
(28, 13, 63, 50, '2024-05-15 10:31:47', '2024-05-15 10:31:47'),
(29, 13, 68, 56, '2024-05-15 10:31:47', '2024-05-15 10:31:47'),
(30, 14, 73, 50, '2024-05-15 10:33:26', '2024-05-15 10:33:26'),
(31, 14, 66, 6, '2024-05-15 10:33:26', '2024-05-15 10:33:26'),
(32, 15, 70, 48, '2024-05-15 10:34:35', '2024-05-15 10:34:35'),
(33, 15, 69, 40, '2024-05-15 10:34:35', '2024-05-15 10:34:35'),
(34, 15, 73, 10, '2024-05-15 10:34:35', '2024-05-15 10:34:35'),
(35, 16, 68, 46, '2024-05-25 01:29:11', '2024-05-25 01:29:11'),
(36, 16, 65, 47, '2024-05-25 01:29:11', '2024-05-25 01:29:11'),
(37, 16, 66, 48, '2024-05-25 01:29:11', '2024-05-25 01:29:11'),
(38, 16, 71, 49, '2024-05-25 01:29:11', '2024-05-25 01:29:11'),
(39, 17, 62, 10, '2024-05-27 03:23:18', '2024-05-27 03:23:18'),
(40, 18, 78, 61, '2024-06-07 01:38:44', '2024-06-07 01:38:44'),
(41, 18, 62, 57, '2024-06-07 01:38:44', '2024-06-07 01:38:44'),
(42, 18, 63, 59, '2024-06-07 01:38:44', '2024-06-07 01:38:44'),
(43, 19, 78, 59, '2024-06-07 01:52:57', '2024-06-07 01:52:57'),
(44, 20, 78, 3, '2024-06-07 01:53:27', '2024-06-14 00:46:54'),
(45, 20, 63, 10, '2024-06-07 01:53:27', '2024-06-14 00:46:54'),
(46, 20, 62, 3, '2024-06-07 01:53:27', '2024-06-14 00:46:54'),
(47, 23, 2, 39, '2024-06-10 22:47:31', '2024-06-10 22:47:31'),
(48, 24, 74, 10, '2024-06-11 03:38:38', '2024-06-11 03:38:38'),
(49, 24, 72, 7, '2024-06-11 03:38:38', '2024-06-11 03:38:38'),
(50, 24, 77, 4, '2024-06-11 03:38:38', '2024-06-11 03:38:38'),
(51, 24, 63, 11, '2024-06-11 03:38:38', '2024-06-11 03:38:38'),
(52, 25, 62, 3, '2024-06-11 23:05:14', '2024-06-11 23:05:14'),
(53, 26, 62, 3, '2024-06-11 23:19:45', '2024-06-11 23:19:45'),
(54, 27, 80, 65, '2024-06-27 23:12:29', '2024-06-27 23:12:29'),
(55, 27, 81, 66, '2024-06-27 23:12:29', '2024-06-27 23:12:29'),
(56, 27, 82, 67, '2024-06-27 23:12:29', '2024-06-27 23:12:29');

-- --------------------------------------------------------

--
-- Table structure for table `batch_section`
--

CREATE TABLE `batch_section` (
  `id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batch_section`
--

INSERT INTO `batch_section` (`id`, `section_id`, `batch_id`, `created_at`, `updated_at`) VALUES
(1, 46, 1, NULL, NULL),
(2, 45, 2, NULL, NULL),
(3, 45, 1, NULL, NULL),
(4, 46, 11, NULL, NULL),
(5, 45, 11, NULL, NULL),
(6, 47, 19, NULL, NULL),
(7, 47, 20, NULL, NULL),
(8, 61, 18, NULL, NULL),
(9, 61, 20, NULL, NULL),
(10, 62, 20, NULL, NULL),
(11, 62, 15, NULL, NULL),
(12, 46, 18, NULL, NULL),
(13, 45, 18, NULL, NULL),
(14, 46, 20, NULL, NULL),
(15, 64, 27, NULL, NULL),
(16, 65, 27, NULL, NULL),
(17, 66, 27, NULL, NULL),
(18, 67, 27, NULL, NULL),
(19, 68, 27, NULL, NULL),
(20, 69, 27, NULL, NULL),
(21, 63, 27, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `batch_teaching_materials`
--

CREATE TABLE `batch_teaching_materials` (
  `id` int(11) NOT NULL,
  `teaching_material_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batch_teaching_materials`
--

INSERT INTO `batch_teaching_materials` (`id`, `teaching_material_id`, `batch_id`, `created_at`, `updated_at`) VALUES
(1, 70, 5, NULL, NULL),
(2, 70, 1, NULL, NULL),
(3, 70, 6, NULL, NULL),
(4, 70, 13, NULL, NULL),
(5, 70, 15, NULL, NULL),
(6, 70, 16, NULL, NULL),
(7, 70, 12, NULL, NULL),
(8, 70, 11, NULL, NULL),
(9, 70, 8, NULL, NULL),
(10, 70, 10, NULL, NULL),
(11, 70, 7, NULL, NULL),
(12, 70, 2, NULL, NULL),
(13, 70, 17, NULL, NULL),
(14, 70, 9, NULL, NULL),
(15, 70, 14, NULL, NULL),
(16, 43, 1, NULL, NULL),
(17, 42, 1, NULL, NULL),
(18, 67, 1, NULL, NULL),
(19, 68, 1, NULL, NULL),
(20, 43, 11, NULL, NULL),
(21, 42, 11, NULL, NULL),
(22, 69, 11, NULL, NULL),
(23, 78, 20, NULL, NULL),
(24, 78, 18, NULL, NULL),
(25, 68, 18, NULL, NULL),
(26, 68, 5, NULL, NULL),
(27, 68, 26, NULL, NULL),
(28, 68, 6, NULL, NULL),
(29, 68, 13, NULL, NULL),
(30, 68, 23, NULL, NULL),
(31, 68, 15, NULL, NULL),
(32, 68, 20, NULL, NULL),
(33, 68, 16, NULL, NULL),
(34, 68, 12, NULL, NULL),
(35, 68, 11, NULL, NULL),
(36, 68, 25, NULL, NULL),
(37, 68, 17, NULL, NULL),
(38, 68, 9, NULL, NULL),
(39, 84, 27, NULL, NULL),
(40, 85, 27, NULL, NULL),
(41, 86, 27, NULL, NULL),
(42, 87, 27, NULL, NULL),
(43, 88, 27, NULL, NULL),
(44, 89, 27, NULL, NULL),
(45, 90, 27, NULL, NULL),
(46, 91, 27, NULL, NULL),
(47, 92, 27, NULL, NULL),
(48, 93, 27, NULL, NULL),
(49, 83, 27, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `batch_user`
--

CREATE TABLE `batch_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `batch_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batch_user`
--

INSERT INTO `batch_user` (`id`, `batch_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 2, 1, NULL, NULL),
(2, 6, 1, NULL, NULL),
(9, 6, 6, NULL, NULL),
(15, 40, 6, NULL, NULL),
(17, 40, 1, NULL, NULL),
(21, 56, 6, NULL, NULL),
(29, 59, 1, NULL, NULL),
(30, 11, 8, NULL, NULL),
(31, 11, 6, NULL, NULL),
(39, 11, 1, NULL, NULL),
(41, 20, 60, NULL, NULL),
(42, 19, 60, NULL, NULL),
(44, 27, 60, NULL, NULL),
(45, 27, 11, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `branchable`
--

CREATE TABLE `branchable` (
  `branch_id` bigint(20) UNSIGNED NOT NULL,
  `branchable_type` varchar(255) NOT NULL,
  `branchable_id` bigint(20) UNSIGNED NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branchable`
--

INSERT INTO `branchable` (`branch_id`, `branchable_type`, `branchable_id`, `published`) VALUES
(1, 'App\\Models\\Course', 2, 0),
(1, 'App\\Models\\Course', 3, 0),
(2, 'App\\Models\\Course', 4, 0),
(2, 'App\\Models\\Course', 5, 0),
(1, 'App\\Models\\Course', 6, 0),
(2, 'App\\Models\\Course', 6, 0),
(1, 'App\\Models\\Course', 7, 0),
(2, 'App\\Models\\Course', 7, 0),
(2, 'App\\Models\\Course', 8, 0),
(1, 'App\\Models\\Course', 8, 0),
(2, 'App\\Models\\Course', 9, 0),
(1, 'App\\Models\\Course', 9, 0),
(2, 'App\\Models\\Course', 10, 0),
(1, 'App\\Models\\Course', 10, 0),
(3, 'App\\Models\\Course', 10, 0),
(2, 'App\\Models\\Course', 11, 0),
(3, 'App\\Models\\Course', 12, 0),
(2, 'App\\Models\\Course', 13, 0),
(1, 'App\\Models\\Course', 13, 0),
(3, 'App\\Models\\Course', 14, 0),
(1, 'App\\Models\\Course', 15, 0);

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `country_id` int(11) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `pincode` int(11) DEFAULT NULL,
  `website` varchar(255) NOT NULL,
  `online_branch` tinyint(1) NOT NULL,
  `allow_registration` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `slug`, `contact_number`, `address`, `country_id`, `city_id`, `state_id`, `pincode`, `website`, `online_branch`, `allow_registration`, `created_at`, `updated_at`) VALUES
(1, 'Hyderabad', NULL, '12345679', 'Ad ut sit cupiditate ea dolorum nihil dolores quidem in mollit et aperiam dolores perferendis', 1, 2, 3, 65, 'https://www.jirosa.co', 1, 0, '2024-02-29 05:23:48', '2024-03-01 04:04:17');

-- --------------------------------------------------------

--
-- Table structure for table `branch_curriculum`
--

CREATE TABLE `branch_curriculum` (
  `branch_id` int(11) NOT NULL,
  `curriculum_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branch_curriculum`
--

INSERT INTO `branch_curriculum` (`branch_id`, `curriculum_id`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, NULL),
(1, 2, NULL, NULL),
(1, 3, NULL, NULL),
(1, 4, NULL, NULL),
(3, 4, NULL, NULL),
(1, 5, NULL, NULL),
(1, 6, NULL, NULL),
(1, 7, NULL, NULL),
(1, 8, NULL, NULL),
(1, 9, NULL, NULL),
(1, 10, NULL, NULL),
(1, 11, NULL, NULL),
(1, 12, NULL, NULL),
(1, 13, NULL, NULL),
(1, 14, NULL, NULL),
(1, 15, NULL, NULL),
(1, 16, NULL, NULL),
(2, 17, NULL, NULL),
(1, 17, NULL, NULL),
(1, 18, NULL, NULL),
(2, 19, NULL, NULL),
(1, 19, NULL, NULL),
(2, 20, NULL, NULL),
(1, 20, NULL, NULL),
(1, 21, NULL, NULL),
(2, 21, NULL, NULL),
(2, 22, NULL, NULL),
(1, 22, NULL, NULL),
(1, 23, NULL, NULL),
(1, 24, NULL, NULL),
(1, 25, NULL, NULL),
(2, 26, NULL, NULL),
(1, 26, NULL, NULL),
(2, 27, NULL, NULL),
(1, 27, NULL, NULL),
(2, 28, NULL, NULL),
(1, 28, NULL, NULL),
(2, 29, NULL, NULL),
(1, 29, NULL, NULL),
(2, 30, NULL, NULL),
(1, 30, NULL, NULL),
(1, 31, NULL, NULL),
(1, 32, NULL, NULL),
(1, 33, NULL, NULL),
(1, 34, NULL, NULL),
(1, 35, NULL, NULL),
(1, 36, NULL, NULL),
(1, 37, NULL, NULL),
(1, 38, NULL, NULL),
(1, 39, NULL, NULL),
(1, 40, NULL, NULL),
(1, 41, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `branch_user`
--

CREATE TABLE `branch_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `breezy_sessions`
--

CREATE TABLE `breezy_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `authenticatable_type` varchar(255) NOT NULL,
  `authenticatable_id` bigint(20) UNSIGNED NOT NULL,
  `panel_id` varchar(255) DEFAULT NULL,
  `guard` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calendars`
--

CREATE TABLE `calendars` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `team_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `curriculum_id` int(11) DEFAULT NULL,
  `classroom_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `calendars`
--

INSERT INTO `calendars` (`id`, `team_id`, `batch_id`, `tutor_id`, `curriculum_id`, `classroom_id`, `start_time`, `end_time`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 3, 0, 1, '2018-09-15 08:26:00', '1999-05-12 16:53:00', '2024-04-04 03:59:05', '2024-04-04 03:59:05'),
(2, 1, 1, 1, 0, 1, '2024-04-12 11:00:15', '2024-04-12 12:00:00', '2024-04-11 23:55:11', '2024-04-11 23:55:11'),
(3, 1, 1, 9, 0, 1, '2024-04-17 10:00:00', '2024-04-17 12:45:30', '2024-04-16 23:44:48', '2024-04-16 23:44:48'),
(4, 1, 1, 40, 0, 2, '2024-04-27 12:39:26', '2024-04-23 12:39:30', '2024-04-22 01:39:47', '2024-04-22 02:39:58'),
(5, 1, 1, 40, 0, 1, '2024-04-27 13:40:45', '2024-04-28 13:40:50', '2024-04-22 02:40:59', '2024-04-22 02:40:59'),
(6, 1, 2, 50, 64, 2, '2024-11-26 22:25:00', '2024-11-26 22:25:00', '2024-04-30 16:57:46', '2024-04-30 16:57:46'),
(7, 1, 1, 7, 62, 2, '2024-11-26 22:25:00', '2024-11-26 22:25:00', '2024-04-30 16:57:46', '2024-04-30 16:57:46'),
(8, 1, 1, 1, 2, 1, '2024-11-26 22:25:00', '2024-11-26 22:25:00', '2024-04-30 16:57:46', '2024-04-30 16:57:46'),
(9, 2, 1, 40, 64, 1, '2024-04-30 22:32:00', '2024-04-30 22:32:00', '2024-04-30 17:02:40', '2024-04-30 17:02:40'),
(10, 2, 1, 1, 62, 2, '2024-04-30 22:32:00', '2024-04-30 22:32:00', '2024-04-30 17:02:40', '2024-04-30 17:02:40'),
(11, 1, 2, 46, 63, 2, '2024-04-30 22:32:00', '2024-04-30 22:32:00', '2024-04-30 17:02:40', '2024-04-30 17:02:40'),
(12, 1, 2, 50, 64, 1, '2024-05-01 05:25:00', '2024-05-01 05:25:00', '2024-04-30 23:57:28', '2024-04-30 23:57:28'),
(13, 1, 2, 3, 63, 1, '2024-05-01 05:25:00', '2024-05-01 05:25:00', '2024-04-30 23:57:28', '2024-04-30 23:57:28'),
(14, 1, 2, 1, 63, 1, '2024-05-03 01:00:00', '2024-05-03 03:00:00', '2024-05-01 06:52:09', '2024-05-01 06:52:09'),
(15, 1, 1, 57, 72, 1, '2024-06-04 05:38:00', '2024-06-04 05:38:00', '2024-06-04 00:10:12', '2024-06-04 00:10:12');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'IT Courses', 1, '2024-03-13 16:54:51', '2024-03-15 14:22:46'),
(2, 'ECE', 0, '2024-03-13 16:55:01', '2024-03-13 16:55:01');

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Ahmedabad', '2024-02-28 01:56:24', '2024-02-28 01:56:24'),
(2, 'Hyderabad', '2024-03-01 04:02:38', '2024-03-01 04:02:38');

-- --------------------------------------------------------

--
-- Table structure for table `classrooms`
--

CREATE TABLE `classrooms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `team_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classrooms`
--

INSERT INTO `classrooms` (`id`, `name`, `team_id`, `created_at`, `updated_at`) VALUES
(1, 'CR1', 1, '2024-04-04 03:58:53', '2024-05-10 01:58:09'),
(2, 'CR4', 1, '2024-04-22 01:27:15', '2024-05-10 02:58:42'),
(3, 'CR2', 1, '2024-05-10 01:57:35', '2024-05-10 01:57:35'),
(4, 'CR3', 1, '2024-05-10 01:58:27', '2024-05-10 01:58:27');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'India', '2024-02-29 05:23:25', '2024-02-29 05:23:25');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_live_course` tinyint(1) DEFAULT 0,
  `copy_from_existing_course` tinyint(1) DEFAULT NULL,
  `course_type` tinyint(1) DEFAULT 1,
  `allow_course_complete` tinyint(1) DEFAULT 0,
  `is_package` tinyint(1) DEFAULT 0,
  `course_unenrolling` tinyint(1) DEFAULT 0,
  `content_access_after_completion` tinyint(1) DEFAULT 0,
  `online_sale_url` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `promo_video_url` varchar(255) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `overview` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `is_live_course`, `copy_from_existing_course`, `course_type`, `allow_course_complete`, `is_package`, `course_unenrolling`, `content_access_after_completion`, `online_sale_url`, `image`, `promo_video_url`, `short_description`, `overview`, `created_at`, `updated_at`) VALUES
(33, 'Analog Layout', 0, 0, 2, 0, 0, 0, 0, NULL, '01J1CMDGXYBV3SRT660KS29S4D.jpg', NULL, NULL, NULL, '2024-06-27 05:07:44', '2024-06-27 05:08:48'),
(34, 'Design & Verification', 0, 0, 1, 0, 0, 0, 0, NULL, '01J1CMEDK67ZRPX59WGHTFQSCQ.jpg', NULL, NULL, NULL, '2024-06-27 05:08:03', '2024-06-27 05:09:17'),
(35, 'Physical Design', 0, 0, 1, 0, 0, 0, 0, NULL, '01J1CT91TBETCJQEN4TKKMPA1V.png', NULL, NULL, NULL, '2024-06-27 05:08:14', '2024-06-27 06:51:13');

-- --------------------------------------------------------

--
-- Table structure for table `course_sub_categories`
--

CREATE TABLE `course_sub_categories` (
  `sub_category_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_sub_categories`
--

INSERT INTO `course_sub_categories` (`sub_category_id`, `course_id`, `created_at`, `updated_at`) VALUES
(1, 2, NULL, NULL),
(2, 3, NULL, NULL),
(1, 4, NULL, NULL),
(2, 4, NULL, NULL),
(1, 11, NULL, NULL),
(1, 12, NULL, NULL),
(2, 12, NULL, NULL),
(1, 13, NULL, NULL),
(2, 13, NULL, NULL),
(1, 14, NULL, NULL),
(1, 6, NULL, NULL),
(2, 7, NULL, NULL),
(1, 7, NULL, NULL),
(1, 10, NULL, NULL),
(2, 10, NULL, NULL),
(2, 15, NULL, NULL),
(2, 16, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `curricula`
--

CREATE TABLE `curricula` (
  `curriculum_id` bigint(20) UNSIGNED NOT NULL,
  `curricula_type` varchar(255) NOT NULL,
  `curricula_id` bigint(20) UNSIGNED NOT NULL,
  `tutor_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `curricula`
--

INSERT INTO `curricula` (`curriculum_id`, `curricula_type`, `curricula_id`, `tutor_id`) VALUES
(1, 'App\\Models\\Course', 1, NULL),
(29, 'App\\Models\\Course', 2, NULL),
(30, 'App\\Models\\Course', 2, NULL),
(23, 'App\\Models\\Course', 2, NULL),
(28, 'App\\Models\\Course', 2, NULL),
(27, 'App\\Models\\Course', 2, NULL),
(22, 'App\\Models\\Course', 2, NULL),
(25, 'App\\Models\\Course', 2, NULL),
(18, 'App\\Models\\Course', 2, NULL),
(19, 'App\\Models\\Course', 2, NULL),
(21, 'App\\Models\\Course', 2, NULL),
(13, 'App\\Models\\Course', 2, NULL),
(34, 'App\\Models\\Course', 2, NULL),
(11, 'App\\Models\\Course', 2, NULL),
(9, 'App\\Models\\Course', 2, NULL),
(5, 'App\\Models\\Course', 2, NULL),
(28, 'App\\Models\\Course', 16, NULL),
(5, 'App\\Models\\CourseStudent', 3, NULL),
(41, 'App\\Models\\CourseStudent', 3, NULL),
(2, 'App\\Models\\CourseStudent', 3, NULL),
(6, 'App\\Models\\CourseStudent', 3, NULL),
(43, 'App\\Models\\Course', 2, NULL),
(44, 'App\\Models\\Course', 2, NULL),
(45, 'App\\Models\\Course', 2, NULL),
(46, 'App\\Models\\Course', 2, NULL),
(47, 'App\\Models\\Course', 2, NULL),
(48, 'App\\Models\\Course', 2, NULL),
(49, 'App\\Models\\Course', 2, NULL),
(50, 'App\\Models\\Course', 2, NULL),
(51, 'App\\Models\\Course', 2, NULL),
(52, 'App\\Models\\Course', 2, NULL),
(53, 'App\\Models\\Course', 2, NULL),
(54, 'App\\Models\\Course', 2, NULL),
(55, 'App\\Models\\Course', 2, NULL),
(56, 'App\\Models\\Course', 2, NULL),
(57, 'App\\Models\\Course', 2, NULL),
(58, 'App\\Models\\Course', 2, NULL),
(59, 'App\\Models\\Course', 2, NULL),
(60, 'App\\Models\\Course', 2, NULL),
(52, 'App\\Models\\CourseStudent', 2, NULL),
(59, 'App\\Models\\CourseStudent', 2, NULL),
(47, 'App\\Models\\CourseStudent', 2, NULL),
(48, 'App\\Models\\CourseStudent', 2, NULL),
(57, 'App\\Models\\CourseStudent', 2, NULL),
(45, 'App\\Models\\CourseStudent', 2, NULL),
(51, 'App\\Models\\CourseStudent', 2, NULL),
(54, 'App\\Models\\CourseStudent', 2, NULL),
(53, 'App\\Models\\CourseStudent', 2, NULL),
(55, 'App\\Models\\CourseStudent', 2, NULL),
(49, 'App\\Models\\CourseStudent', 2, NULL),
(50, 'App\\Models\\CourseStudent', 2, NULL),
(58, 'App\\Models\\CourseStudent', 2, NULL),
(61, 'App\\Models\\Course', 2, NULL),
(61, 'App\\Models\\Course', 3, NULL),
(62, 'App\\Models\\Course', 4, NULL),
(62, 'App\\Models\\Course', 2, NULL),
(62, 'App\\Models\\Course', 3, NULL),
(63, 'App\\Models\\Course', 4, NULL),
(63, 'App\\Models\\Course', 2, NULL),
(63, 'App\\Models\\Course', 3, NULL),
(64, 'App\\Models\\Course', 4, NULL),
(64, 'App\\Models\\Course', 2, NULL),
(64, 'App\\Models\\Course', 3, NULL),
(2, 'App\\Models\\CourseStudent', 2, NULL),
(63, 'App\\Models\\Course', 31, NULL),
(65, 'App\\Models\\Course', 4, NULL),
(65, 'App\\Models\\Course', 2, NULL),
(65, 'App\\Models\\Course', 22, NULL),
(65, 'App\\Models\\Course', 3, NULL),
(65, 'App\\Models\\Course', 23, NULL),
(66, 'App\\Models\\Course', 2, NULL),
(66, 'App\\Models\\Course', 22, NULL),
(66, 'App\\Models\\Course', 3, NULL),
(66, 'App\\Models\\Course', 23, NULL),
(67, 'App\\Models\\Course', 2, NULL),
(68, 'App\\Models\\Course', 2, NULL),
(68, 'App\\Models\\Course', 4, NULL),
(68, 'App\\Models\\Course', 22, NULL),
(68, 'App\\Models\\Course', 3, NULL),
(68, 'App\\Models\\Course', 23, NULL),
(69, 'App\\Models\\Course', 2, NULL),
(69, 'App\\Models\\Course', 4, NULL),
(69, 'App\\Models\\Course', 27, NULL),
(69, 'App\\Models\\Course', 22, NULL),
(69, 'App\\Models\\Course', 19, NULL),
(69, 'App\\Models\\Course', 17, NULL),
(70, 'App\\Models\\Course', 2, NULL),
(70, 'App\\Models\\Course', 4, NULL),
(70, 'App\\Models\\Course', 27, NULL),
(70, 'App\\Models\\Course', 19, NULL),
(70, 'App\\Models\\Course', 17, NULL),
(70, 'App\\Models\\Course', 18, NULL),
(71, 'App\\Models\\Course', 2, NULL),
(71, 'App\\Models\\Course', 4, NULL),
(71, 'App\\Models\\Course', 27, NULL),
(71, 'App\\Models\\Course', 24, NULL),
(71, 'App\\Models\\Course', 3, NULL),
(71, 'App\\Models\\Course', 21, NULL),
(71, 'App\\Models\\Course', 20, NULL),
(71, 'App\\Models\\Course', 23, NULL),
(71, 'App\\Models\\Course', 29, NULL),
(72, 'App\\Models\\Course', 2, NULL),
(72, 'App\\Models\\Course', 4, NULL),
(72, 'App\\Models\\Course', 17, NULL),
(72, 'App\\Models\\Course', 18, NULL),
(72, 'App\\Models\\Course', 23, NULL),
(72, 'App\\Models\\Course', 30, NULL),
(73, 'App\\Models\\Course', 2, NULL),
(73, 'App\\Models\\Course', 4, NULL),
(73, 'App\\Models\\Course', 22, NULL),
(73, 'App\\Models\\Course', 19, NULL),
(73, 'App\\Models\\Course', 3, NULL),
(73, 'App\\Models\\Course', 21, NULL),
(73, 'App\\Models\\Course', 23, NULL),
(73, 'App\\Models\\Course', 24, NULL),
(73, 'App\\Models\\Course', 29, NULL),
(73, 'App\\Models\\Course', 31, NULL),
(74, 'App\\Models\\Course', 2, NULL),
(74, 'App\\Models\\Course', 20, NULL),
(74, 'App\\Models\\Course', 30, NULL),
(74, 'App\\Models\\Course', 29, NULL),
(74, 'App\\Models\\Course', 16, NULL),
(75, 'App\\Models\\Course', 2, NULL),
(75, 'App\\Models\\Course', 21, NULL),
(76, 'App\\Models\\Course', 32, NULL),
(77, 'App\\Models\\Course', 4, NULL),
(77, 'App\\Models\\Course', 2, NULL),
(78, 'App\\Models\\Course', 2, NULL),
(78, 'App\\Models\\Course', 4, NULL),
(78, 'App\\Models\\Course', 3, NULL),
(2, 'App\\Models\\Course', 4, NULL),
(79, 'App\\Models\\Course', 4, NULL),
(80, 'App\\Models\\Course', 33, NULL),
(80, 'App\\Models\\Course', 34, NULL),
(80, 'App\\Models\\Course', 35, NULL),
(81, 'App\\Models\\Course', 33, NULL),
(81, 'App\\Models\\Course', 34, NULL),
(81, 'App\\Models\\Course', 35, NULL),
(82, 'App\\Models\\Course', 33, NULL),
(82, 'App\\Models\\Course', 34, NULL),
(82, 'App\\Models\\Course', 35, NULL),
(83, 'App\\Models\\Course', 33, NULL),
(83, 'App\\Models\\Course', 34, NULL),
(83, 'App\\Models\\Course', 35, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `curriculum`
--

CREATE TABLE `curriculum` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `short_description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `curriculum`
--

INSERT INTO `curriculum` (`id`, `name`, `short_description`, `image`, `created_at`, `updated_at`) VALUES
(62, 'SL_Test', 'Scripting Language', NULL, '2024-04-22 05:31:40', '2024-04-22 05:31:40'),
(80, 'CMOS Fundamentals (CF)', 'A complementary metal-oxide semiconductor (CMOS) is the semiconductor technology used in most of today\'s integrated circuits (ICs), also known as chips or microchips. CMOS transistors are based on metal-oxide semiconductor field-effect transistor (MOSFET) technology.', '01J1CTDVR35GVM4D9YMCMQZABQ.jpg', '2024-06-27 06:53:50', '2024-06-27 06:53:50'),
(81, 'Scripting Language (SL)', 'A scripting language is a programming language that executes tasks within a special run-time environment by an interpreter instead of a compiler. They are usually short, fast, and interpreted from source code or bytecode.\n', '01J1CTSQKC3M27DXVADX5KP3SM.png', '2024-06-27 07:00:19', '2024-06-27 07:00:19'),
(82, 'Digital Design Flow (DDF)', 'A digital design flow is a process for developing a concept or a product with certain specifications to physical hardware implementation. The process is usually seen from three different domains: The behavioural, the structural and the physical.', '01J1CTY054WA9G9Q4AY4CPCTDV.jpg', '2024-06-27 07:02:39', '2024-06-27 07:02:39'),
(83, 'Assignments', 'An assignment is a piece of (academic) work or task. It provides opportunity for students to learn, practice and demonstrate they have achieved the learning goals. It provides the evidence for the teacher that the students have achieved the goals.\n', '01J1EJTF8KAS27Z724HA3J7P6G.webp', '2024-06-27 23:19:24', '2024-06-27 23:19:24');

-- --------------------------------------------------------

--
-- Table structure for table `curriculum_team`
--

CREATE TABLE `curriculum_team` (
  `curriculum_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `curriculum_team`
--

INSERT INTO `curriculum_team` (`curriculum_id`, `team_id`, `created_at`, `updated_at`) VALUES
(42, 1, NULL, NULL),
(41, 1, NULL, NULL),
(5, 1, NULL, NULL),
(6, 1, NULL, NULL),
(42, 1, NULL, NULL),
(43, 1, NULL, NULL),
(44, 1, NULL, NULL),
(45, 1, NULL, NULL),
(46, 1, NULL, NULL),
(47, 1, NULL, NULL),
(48, 1, NULL, NULL),
(49, 1, NULL, NULL),
(50, 1, NULL, NULL),
(51, 1, NULL, NULL),
(52, 1, NULL, NULL),
(53, 1, NULL, NULL),
(54, 1, NULL, NULL),
(55, 1, NULL, NULL),
(56, 1, NULL, NULL),
(57, 1, NULL, NULL),
(58, 1, NULL, NULL),
(59, 1, NULL, NULL),
(60, 1, NULL, NULL),
(61, 1, NULL, NULL),
(62, 1, NULL, NULL),
(63, 1, NULL, NULL),
(64, 1, NULL, NULL),
(65, 1, NULL, NULL),
(66, 1, NULL, NULL),
(67, 1, NULL, NULL),
(68, 1, NULL, NULL),
(69, 1, NULL, NULL),
(70, 1, NULL, NULL),
(71, 1, NULL, NULL),
(72, 1, NULL, NULL),
(73, 1, NULL, NULL),
(74, 1, NULL, NULL),
(75, 1, NULL, NULL),
(76, 1, NULL, NULL),
(77, 1, NULL, NULL),
(78, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domains`
--

CREATE TABLE `domains` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domains`
--

INSERT INTO `domains` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'DV', '2024-06-07 02:15:59', '2024-06-07 02:15:59');

-- --------------------------------------------------------

--
-- Table structure for table `exports`
--

CREATE TABLE `exports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `file_disk` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `exporter` varchar(255) NOT NULL,
  `processed_rows` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total_rows` int(10) UNSIGNED NOT NULL,
  `successful_rows` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exports`
--

INSERT INTO `exports` (`id`, `completed_at`, `file_disk`, `file_name`, `exporter`, `processed_rows`, `total_rows`, `successful_rows`, `user_id`, `created_at`, `updated_at`) VALUES
(1, '2024-06-14 04:10:18', 'public', 'export-1-questions', 'App\\Filament\\Exports\\QuestionExporter', 13, 13, 13, 1, '2024-06-14 04:10:18', '2024-06-14 04:10:18'),
(2, '2024-06-14 04:33:41', 'public', 'export-2-questions', 'App\\Filament\\Exports\\QuestionExporter', 14, 14, 14, 1, '2024-06-14 04:33:41', '2024-06-14 04:33:41');

-- --------------------------------------------------------

--
-- Table structure for table `failed_import_rows`
--

CREATE TABLE `failed_import_rows` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `import_id` bigint(20) UNSIGNED NOT NULL,
  `validation_error` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `failed_import_rows`
--

INSERT INTO `failed_import_rows` (`id`, `data`, `import_id`, `validation_error`, `created_at`, `updated_at`) VALUES
(3, '{\"name\":\"Test 1\",\"email\":\"test1@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest1\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 3, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 04:48:24', '2024-04-22 04:48:24'),
(4, '{\"name\":\"Test 2\",\"email\":\"test2@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest2\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 3, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 04:48:24', '2024-04-22 04:48:24'),
(5, '{\"name\":\"Test 3\",\"email\":\"test3@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest3\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 3, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 04:48:24', '2024-04-22 04:48:24'),
(6, '{\"name\":\"Test 4\",\"email\":\"test4@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest4\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 3, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 04:48:24', '2024-04-22 04:48:24'),
(7, '{\"name\":\"Test 5\",\"email\":\"test5@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest5\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 3, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 04:48:24', '2024-04-22 04:48:24'),
(8, '{\"name\":\"Test 6\",\"email\":\"test6@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest6\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 3, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 04:48:24', '2024-04-22 04:48:24'),
(9, '{\"name\":\"Test 7\",\"email\":\"test7@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest7\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 3, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 04:48:24', '2024-04-22 04:48:24'),
(10, '{\"name\":\"Test 1\",\"email\":\"test1@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest1\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 4, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 05:07:08', '2024-04-22 05:07:08'),
(11, '{\"name\":\"Test 2\",\"email\":\"test2@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest2\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 4, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 05:07:08', '2024-04-22 05:07:08'),
(12, '{\"name\":\"Test 3\",\"email\":\"test3@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest3\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 4, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 05:07:08', '2024-04-22 05:07:08'),
(13, '{\"name\":\"Test 4\",\"email\":\"test4@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest4\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 4, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 05:07:08', '2024-04-22 05:07:08'),
(14, '{\"name\":\"Test 5\",\"email\":\"test5@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest5\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 4, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 05:07:08', '2024-04-22 05:07:08'),
(15, '{\"name\":\"Test 6\",\"email\":\"test6@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest6\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 4, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 05:07:08', '2024-04-22 05:07:08'),
(16, '{\"name\":\"Test 7\",\"email\":\"test7@student.sumedhait.com\",\"phone\":\"1234567890\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"sumlmstest7\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 4, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-22 05:07:08', '2024-04-22 05:07:08'),
(17, '{\"name\":\"Test 1\",\"email\":\"test1@student.sumedhait.com\",\"phone\":\"9347524011\",\"password\":\"Test@12345\",\"role_id\":\"\",\"registration_number\":\"SUMHYDPD01\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 5, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-26 00:52:11', '2024-04-26 00:52:11'),
(18, '{\"name\":\"Test 2\",\"email\":\"test2@student.sumedhait.com\",\"phone\":\"9100098487\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"SUMHYDPD02\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 5, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-26 00:52:12', '2024-04-26 00:52:12'),
(19, '{\"name\":\"Test 3\",\"email\":\"test3@student.sumedhait.com\",\"phone\":\"9515933955\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"SUMHYDPD03\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 5, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-26 00:52:12', '2024-04-26 00:52:12'),
(20, '{\"name\":\"Test 4\",\"email\":\"test4@student.sumedhait.com\",\"phone\":\"8790905787\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"SUMHYDPD04\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 5, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-26 00:52:12', '2024-04-26 00:52:12'),
(21, '{\"name\":\"Test 5\",\"email\":\"test5@student.sumedhait.com\",\"phone\":\"8790305787\",\"password\":\"Test@123\",\"role_id\":\"\",\"registration_number\":\"SUMHYDPD05\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 5, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-04-26 00:52:12', '2024-04-26 00:52:12'),
(22, '{\"name\":\"Test 1\",\"email\":\"test1@student.sumedhait.com\",\"phone\":\"8790905787\",\"password\":\"12345\",\"role_id\":\"\",\"registration_number\":\"sumtest1\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 11, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-22 23:54:51', '2024-05-22 23:54:51'),
(23, '{\"name\":\"Test 2\",\"email\":\"test2@student.sumedhait.com\",\"phone\":\"9100098487\",\"password\":\"12345\",\"role_id\":\"\",\"registration_number\":\"sumtest2\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 11, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-22 23:54:51', '2024-05-22 23:54:51'),
(24, '{\"name\":\"Test 3\",\"email\":\"test3@student.sumedhait.com\",\"phone\":\"8790305787\",\"password\":\"12345\",\"role_id\":\"\",\"registration_number\":\"sumtest3\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 11, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-22 23:54:51', '2024-05-22 23:54:51'),
(25, '{\"name\":\"Test 4\",\"email\":\"test4@student.sumedhait.com\",\"phone\":\"9154024371\",\"password\":\"12345\",\"role_id\":\"\",\"registration_number\":\"sumtest4\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 11, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-22 23:54:51', '2024-05-22 23:54:51'),
(26, '{\"name\":\"Test 5\",\"email\":\"test5@student.sumedhait.com\",\"phone\":\"7386701492\",\"password\":\"12345\",\"role_id\":\"\",\"registration_number\":\"sumtest5\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 11, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-22 23:54:51', '2024-05-22 23:54:51'),
(27, '{\"name\":\"Test 6\",\"email\":\"test6@student.sumedhait.com\",\"phone\":\"9100098489\",\"password\":\"12345\",\"role_id\":\"\",\"registration_number\":\"sumtest6\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 11, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-22 23:54:51', '2024-05-22 23:54:51'),
(28, '{\"name\":\"Test 7\",\"email\":\"test7@student.sumedhait.com\",\"phone\":\"9100098498\",\"password\":\"12345\",\"role_id\":\"\",\"registration_number\":\"sumtest7\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 11, 'The role id field must be an integer. The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-22 23:54:51', '2024-05-22 23:54:51'),
(29, '{\"name\":\"Test 1\",\"email\":\"test1@student.sumedhait.com\",\"phone\":\"8790905787\",\"password\":\"12345\",\"role_id\":\"6\",\"registration_number\":\"sumtest1\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 12, 'The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-23 00:03:53', '2024-05-23 00:03:53'),
(30, '{\"name\":\"Test 2\",\"email\":\"test2@student.sumedhait.com\",\"phone\":\"9100098487\",\"password\":\"12345\",\"role_id\":\"6\",\"registration_number\":\"sumtest2\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 12, 'The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-23 00:03:53', '2024-05-23 00:03:53'),
(31, '{\"name\":\"Test 3\",\"email\":\"test3@student.sumedhait.com\",\"phone\":\"8790305787\",\"password\":\"12345\",\"role_id\":\"6\",\"registration_number\":\"sumtest3\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 12, 'The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-23 00:03:53', '2024-05-23 00:03:53'),
(32, '{\"name\":\"Test 4\",\"email\":\"test4@student.sumedhait.com\",\"phone\":\"9154024371\",\"password\":\"12345\",\"role_id\":\"6\",\"registration_number\":\"sumtest4\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 12, 'The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-23 00:03:53', '2024-05-23 00:03:53'),
(33, '{\"name\":\"Test 5\",\"email\":\"test5@student.sumedhait.com\",\"phone\":\"7386701492\",\"password\":\"12345\",\"role_id\":\"6\",\"registration_number\":\"sumtest5\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 12, 'The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-23 00:03:53', '2024-05-23 00:03:53'),
(34, '{\"name\":\"Test 6\",\"email\":\"test6@student.sumedhait.com\",\"phone\":\"9100098489\",\"password\":\"12345\",\"role_id\":\"6\",\"registration_number\":\"sumtest6\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 12, 'The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-23 00:03:53', '2024-05-23 00:03:53'),
(35, '{\"name\":\"Test 7\",\"email\":\"test7@student.sumedhait.com\",\"phone\":\"9100098498\",\"password\":\"12345\",\"role_id\":\"6\",\"registration_number\":\"sumtest7\",\"birthday\":\"\",\"contact_number\":\"\",\"gender\":\"\",\"qualification_id\":\"\",\"year_of_passed_out\":\"\",\"address\":\"\",\"city_id\":\"\",\"state_id\":\"\",\"pincode\":\"\",\"school\":\"\",\"aadhaar_number\":\"\",\"linkedin_profile\":\"\",\"upload_resume\":\"\",\"upload_aadhar\":\"\",\"upload_picture\":\"\",\"upload_marklist\":\"\",\"upload_agreement\":\"\",\"parent_name\":\"\",\"parent_contact\":\"\",\"parent_email\":\"\",\"parent_aadhar\":\"\",\"parent_occupation\":\"\",\"residential_address\":\"\",\"designation_id\":\"\",\"experience\":\"\",\"domain_id\":\"\",\"subject\":\"\",\"is_active\":\"\"}', 12, 'The birthday field must be a valid date. The qualification id field must be an integer. The city id field must be an integer. The state id field must be an integer. The parent email field must be a valid email address. The designation id field must be an integer. The domain id field must be an integer. The is active field must be true or false.', '2024-05-23 00:03:53', '2024-05-23 00:03:53');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `holidays`
--

CREATE TABLE `holidays` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `team_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `holidays`
--

INSERT INTO `holidays` (`id`, `name`, `team_id`, `date`, `created_at`, `updated_at`) VALUES
(2, 'tefwoi32nr', 1, '2024-04-24', '2024-04-22 01:40:19', '2024-04-22 01:40:19'),
(3, 'May Day', 1, '2024-05-01', '2024-04-22 05:09:34', '2024-04-22 05:09:34'),
(4, 'Independence Day', 1, '2024-08-15', '2024-04-22 05:09:54', '2024-04-22 05:09:54'),
(5, 'test', 1, '2024-05-02', '2024-05-01 06:44:47', '2024-05-01 06:44:47'),
(7, 'janmashtami', 1, '2024-06-20', '2024-05-07 03:38:25', '2024-05-07 03:38:25'),
(8, 'Buddha Pournima', 1, '2024-05-23', '2024-05-13 05:25:51', '2024-05-13 05:25:51'),
(9, 'Ganesh Chathurthi', 1, '2024-09-07', '2024-06-26 00:29:21', '2024-06-26 00:29:21'),
(10, 'Sunday', 1, '2024-06-30', '2024-06-29 05:34:42', '2024-06-29 05:34:42');

-- --------------------------------------------------------

--
-- Table structure for table `imports`
--

CREATE TABLE `imports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `importer` varchar(255) NOT NULL,
  `processed_rows` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total_rows` int(10) UNSIGNED NOT NULL,
  `successful_rows` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `imports`
--

INSERT INTO `imports` (`id`, `completed_at`, `file_name`, `file_path`, `importer`, `processed_rows`, `total_rows`, `successful_rows`, `user_id`, `created_at`, `updated_at`) VALUES
(3, '2024-04-22 04:48:24', 'user-importer-example (1).csv', '/home/primelms/public_html/storage/app/livewire-tmp/WIqoxZoBtGFNb5uHJxEkHe8PUDIVWv-metadXNlci1pbXBvcnRlci1leGFtcGxlICgxKS5jc3Y=-.csv', 'App\\Filament\\Imports\\UserImporter', 7, 7, 0, 1, '2024-04-22 04:48:24', '2024-04-22 04:48:24'),
(4, '2024-04-22 05:07:08', 'user-importer-example (1).csv', '/home/primelms/public_html/storage/app/livewire-tmp/TngY3l80b6BhZlzBZDxecvli8osMwC-metadXNlci1pbXBvcnRlci1leGFtcGxlICgxKS5jc3Y=-.csv', 'App\\Filament\\Imports\\UserImporter', 7, 7, 0, 1, '2024-04-22 05:07:08', '2024-04-22 05:07:08'),
(5, '2024-04-26 00:52:12', 'user-importer-example (2).csv', '/home/primelms/public_html/storage/app/livewire-tmp/R8BAXuynq0ZnBrXS2lPveeYVEzTlxb-metadXNlci1pbXBvcnRlci1leGFtcGxlICgyKS5jc3Y=-.csv', 'App\\Filament\\Imports\\UserImporter', 5, 5, 0, 1, '2024-04-26 00:52:11', '2024-04-26 00:52:12'),
(6, NULL, 'user-importer-example (3).csv', '/home/primelms/public_html/storage/app/livewire-tmp/OtFBInZw0dmqiayneCASEuU1sCYvLH-metadXNlci1pbXBvcnRlci1leGFtcGxlICgzKS5jc3Y=-.txt', 'App\\Filament\\Imports\\UserImporter', 0, 0, 0, 1, '2024-04-26 00:58:17', '2024-04-26 00:58:17'),
(7, NULL, 'user-importer-example (3).csv', '/home/primelms/public_html/storage/app/livewire-tmp/0z8t7KTwSyAf6m4VUMhuOBHZnsSrkc-metadXNlci1pbXBvcnRlci1leGFtcGxlICgzKS5jc3Y=-.txt', 'App\\Filament\\Imports\\UserImporter', 0, 0, 0, 1, '2024-04-26 00:59:29', '2024-04-26 00:59:29'),
(8, NULL, 'user-importer-example (3).csv', '/home/primelms/public_html/storage/app/livewire-tmp/Y6rbYrtIId0Ag8IozVAx7vjx8oTQ5A-metadXNlci1pbXBvcnRlci1leGFtcGxlICgzKS5jc3Y=-.txt', 'App\\Filament\\Imports\\UserImporter', 0, 0, 0, 1, '2024-04-26 01:00:33', '2024-04-26 01:00:33'),
(9, '2024-04-26 01:37:10', 'user-importer-example (2).csv', '/home/primelms/public_html/storage/app/livewire-tmp/eO4ztM5bc8uEBYaj1CaLI2h4BVsHNq-metadXNlci1pbXBvcnRlci1leGFtcGxlICgyKS5jc3Y=-.csv', 'App\\Filament\\Imports\\UserImporter', 5, 5, 5, 1, '2024-04-26 01:37:08', '2024-04-26 01:37:10'),
(10, '2024-04-26 01:45:03', 'user-importer-example (3).csv', '/home/primelms/public_html/storage/app/livewire-tmp/fztJwS7vfhfWY4IXzEAFoK80PFpXFq-metadXNlci1pbXBvcnRlci1leGFtcGxlICgzKS5jc3Y=-.csv', 'App\\Filament\\Imports\\UserImporter', 5, 5, 5, 1, '2024-04-26 01:45:01', '2024-04-26 01:45:03'),
(11, '2024-05-22 23:54:51', 'user-importer-example (2).csv', '/home/primelms/public_html/storage/app/livewire-tmp/7KE7T18vMuAVmjgu3DknDyOujifqHF-metadXNlci1pbXBvcnRlci1leGFtcGxlICgyKS5jc3Y=-.csv', 'App\\Filament\\Imports\\UserImporter', 7, 7, 0, 1, '2024-05-22 23:54:51', '2024-05-22 23:54:51'),
(12, '2024-05-23 00:03:53', 'user-importer-example (2).csv', '/home/primelms/public_html/storage/app/livewire-tmp/3GBYXd0m0xwM0UgSJod6NXRbHGE0hD-metadXNlci1pbXBvcnRlci1leGFtcGxlICgyKS5jc3Y=-.csv', 'App\\Filament\\Imports\\UserImporter', 7, 7, 0, 1, '2024-05-23 00:03:53', '2024-05-23 00:03:53');

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_batches`
--

INSERT INTO `job_batches` (`id`, `name`, `total_jobs`, `pending_jobs`, `failed_jobs`, `failed_job_ids`, `options`, `cancelled_at`, `created_at`, `finished_at`) VALUES
('9bde1364-c7d7-46b4-961d-48fd15ea6dd3', '', 1, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:2701:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:6:\"import\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Imports\\Models\\Import\";s:2:\"id\";i:3;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}}s:8:\"function\";s:2271:\"function () use ($import) {\n                    $import->touch(\'completed_at\');\n\n                    if (! $import->user instanceof \\Illuminate\\Contracts\\Auth\\Authenticatable) {\n                        return;\n                    }\n\n                    $failedRowsCount = $import->getFailedRowsCount();\n\n                    \\Filament\\Notifications\\Notification::make()\n                        ->title(__(\'filament-actions::import.notifications.completed.title\'))\n                        ->body($import->importer::getCompletedNotificationBody($import))\n                        ->when(\n                            ! $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->success(),\n                        )\n                        ->when(\n                            $failedRowsCount && ($failedRowsCount < $import->total_rows),\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->warning(),\n                        )\n                        ->when(\n                            $failedRowsCount === $import->total_rows,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->danger(),\n                        )\n                        ->when(\n                            $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->actions([\n                                \\Filament\\Notifications\\Actions\\Action::make(\'downloadFailedRowsCsv\')\n                                    ->label(trans_choice(\'filament-actions::import.notifications.completed.actions.download_failed_rows_csv.label\', $failedRowsCount, [\n                                        \'count\' => \\Illuminate\\Support\\Number::format($failedRowsCount),\n                                    ]))\n                                    ->color(\'danger\')\n                                    ->url(route(\'filament.imports.failed-rows.download\', [\'import\' => $import], absolute: false), shouldOpenInNewTab: true)\n                                    ->markAsRead(),\n                            ]),\n                        )\n                        ->sendToDatabase($import->user);\n                }\";s:5:\"scope\";s:29:\"Filament\\Actions\\ImportAction\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000012e70000000000000000\";}\";s:4:\"hash\";s:44:\"ueBfqeqxblql0v1FsNqzk1tdpxZpaVH6XuxHUCDC480=\";}}}}', NULL, 1713781104, 1713781104),
('9bde1a17-b39a-4eb2-b995-7f32d03ec74c', '', 1, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:2701:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:6:\"import\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Imports\\Models\\Import\";s:2:\"id\";i:4;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}}s:8:\"function\";s:2271:\"function () use ($import) {\n                    $import->touch(\'completed_at\');\n\n                    if (! $import->user instanceof \\Illuminate\\Contracts\\Auth\\Authenticatable) {\n                        return;\n                    }\n\n                    $failedRowsCount = $import->getFailedRowsCount();\n\n                    \\Filament\\Notifications\\Notification::make()\n                        ->title(__(\'filament-actions::import.notifications.completed.title\'))\n                        ->body($import->importer::getCompletedNotificationBody($import))\n                        ->when(\n                            ! $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->success(),\n                        )\n                        ->when(\n                            $failedRowsCount && ($failedRowsCount < $import->total_rows),\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->warning(),\n                        )\n                        ->when(\n                            $failedRowsCount === $import->total_rows,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->danger(),\n                        )\n                        ->when(\n                            $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->actions([\n                                \\Filament\\Notifications\\Actions\\Action::make(\'downloadFailedRowsCsv\')\n                                    ->label(trans_choice(\'filament-actions::import.notifications.completed.actions.download_failed_rows_csv.label\', $failedRowsCount, [\n                                        \'count\' => \\Illuminate\\Support\\Number::format($failedRowsCount),\n                                    ]))\n                                    ->color(\'danger\')\n                                    ->url(route(\'filament.imports.failed-rows.download\', [\'import\' => $import], absolute: false), shouldOpenInNewTab: true)\n                                    ->markAsRead(),\n                            ]),\n                        )\n                        ->sendToDatabase($import->user);\n                }\";s:5:\"scope\";s:29:\"Filament\\Actions\\ImportAction\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000012e70000000000000000\";}\";s:4:\"hash\";s:44:\"qeh2WThFxwO9redzVbjjL1vRoYrX2hZUf63xGDd7gns=\";}}}}', NULL, 1713782228, 1713782228),
('9be5cadb-6e1c-42c3-a603-28d283e8f359', '', 1, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:2701:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:6:\"import\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Imports\\Models\\Import\";s:2:\"id\";i:5;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}}s:8:\"function\";s:2271:\"function () use ($import) {\n                    $import->touch(\'completed_at\');\n\n                    if (! $import->user instanceof \\Illuminate\\Contracts\\Auth\\Authenticatable) {\n                        return;\n                    }\n\n                    $failedRowsCount = $import->getFailedRowsCount();\n\n                    \\Filament\\Notifications\\Notification::make()\n                        ->title(__(\'filament-actions::import.notifications.completed.title\'))\n                        ->body($import->importer::getCompletedNotificationBody($import))\n                        ->when(\n                            ! $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->success(),\n                        )\n                        ->when(\n                            $failedRowsCount && ($failedRowsCount < $import->total_rows),\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->warning(),\n                        )\n                        ->when(\n                            $failedRowsCount === $import->total_rows,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->danger(),\n                        )\n                        ->when(\n                            $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->actions([\n                                \\Filament\\Notifications\\Actions\\Action::make(\'downloadFailedRowsCsv\')\n                                    ->label(trans_choice(\'filament-actions::import.notifications.completed.actions.download_failed_rows_csv.label\', $failedRowsCount, [\n                                        \'count\' => \\Illuminate\\Support\\Number::format($failedRowsCount),\n                                    ]))\n                                    ->color(\'danger\')\n                                    ->url(route(\'filament.imports.failed-rows.download\', [\'import\' => $import], absolute: false), shouldOpenInNewTab: true)\n                                    ->markAsRead(),\n                            ]),\n                        )\n                        ->sendToDatabase($import->user);\n                }\";s:5:\"scope\";s:29:\"Filament\\Actions\\ImportAction\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000012e30000000000000000\";}\";s:4:\"hash\";s:44:\"iqSmfmFjvXDlI99HzoFFX0JBgGHgjGV7xxHevH0zQW0=\";}}}}', NULL, 1714112531, 1714112532),
('9be5cd09-4985-4bf2-b563-f0be898f6215', '', 0, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:2701:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:6:\"import\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Imports\\Models\\Import\";s:2:\"id\";i:6;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}}s:8:\"function\";s:2271:\"function () use ($import) {\n                    $import->touch(\'completed_at\');\n\n                    if (! $import->user instanceof \\Illuminate\\Contracts\\Auth\\Authenticatable) {\n                        return;\n                    }\n\n                    $failedRowsCount = $import->getFailedRowsCount();\n\n                    \\Filament\\Notifications\\Notification::make()\n                        ->title(__(\'filament-actions::import.notifications.completed.title\'))\n                        ->body($import->importer::getCompletedNotificationBody($import))\n                        ->when(\n                            ! $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->success(),\n                        )\n                        ->when(\n                            $failedRowsCount && ($failedRowsCount < $import->total_rows),\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->warning(),\n                        )\n                        ->when(\n                            $failedRowsCount === $import->total_rows,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->danger(),\n                        )\n                        ->when(\n                            $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->actions([\n                                \\Filament\\Notifications\\Actions\\Action::make(\'downloadFailedRowsCsv\')\n                                    ->label(trans_choice(\'filament-actions::import.notifications.completed.actions.download_failed_rows_csv.label\', $failedRowsCount, [\n                                        \'count\' => \\Illuminate\\Support\\Number::format($failedRowsCount),\n                                    ]))\n                                    ->color(\'danger\')\n                                    ->url(route(\'filament.imports.failed-rows.download\', [\'import\' => $import], absolute: false), shouldOpenInNewTab: true)\n                                    ->markAsRead(),\n                            ]),\n                        )\n                        ->sendToDatabase($import->user);\n                }\";s:5:\"scope\";s:29:\"Filament\\Actions\\ImportAction\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000012e10000000000000000\";}\";s:4:\"hash\";s:44:\"pC3bHfagDR5MeIQsi0a1WW0fs+SR3/Z5Jw2PEoK3qks=\";}}}}', NULL, 1714112897, NULL),
('9be5cd77-d140-40cc-8940-40e61e46a180', '', 0, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:2701:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:6:\"import\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Imports\\Models\\Import\";s:2:\"id\";i:7;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}}s:8:\"function\";s:2271:\"function () use ($import) {\n                    $import->touch(\'completed_at\');\n\n                    if (! $import->user instanceof \\Illuminate\\Contracts\\Auth\\Authenticatable) {\n                        return;\n                    }\n\n                    $failedRowsCount = $import->getFailedRowsCount();\n\n                    \\Filament\\Notifications\\Notification::make()\n                        ->title(__(\'filament-actions::import.notifications.completed.title\'))\n                        ->body($import->importer::getCompletedNotificationBody($import))\n                        ->when(\n                            ! $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->success(),\n                        )\n                        ->when(\n                            $failedRowsCount && ($failedRowsCount < $import->total_rows),\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->warning(),\n                        )\n                        ->when(\n                            $failedRowsCount === $import->total_rows,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->danger(),\n                        )\n                        ->when(\n                            $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->actions([\n                                \\Filament\\Notifications\\Actions\\Action::make(\'downloadFailedRowsCsv\')\n                                    ->label(trans_choice(\'filament-actions::import.notifications.completed.actions.download_failed_rows_csv.label\', $failedRowsCount, [\n                                        \'count\' => \\Illuminate\\Support\\Number::format($failedRowsCount),\n                                    ]))\n                                    ->color(\'danger\')\n                                    ->url(route(\'filament.imports.failed-rows.download\', [\'import\' => $import], absolute: false), shouldOpenInNewTab: true)\n                                    ->markAsRead(),\n                            ]),\n                        )\n                        ->sendToDatabase($import->user);\n                }\";s:5:\"scope\";s:29:\"Filament\\Actions\\ImportAction\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000012e10000000000000000\";}\";s:4:\"hash\";s:44:\"plg6XW3WuFx3/FG2njr5ze89Fd8c9s7U9tUk70N2q0k=\";}}}}', NULL, 1714112969, NULL),
('9be5cdd9-2135-44bb-bf9e-252915ecea60', '', 0, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:2701:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:6:\"import\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Imports\\Models\\Import\";s:2:\"id\";i:8;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}}s:8:\"function\";s:2271:\"function () use ($import) {\n                    $import->touch(\'completed_at\');\n\n                    if (! $import->user instanceof \\Illuminate\\Contracts\\Auth\\Authenticatable) {\n                        return;\n                    }\n\n                    $failedRowsCount = $import->getFailedRowsCount();\n\n                    \\Filament\\Notifications\\Notification::make()\n                        ->title(__(\'filament-actions::import.notifications.completed.title\'))\n                        ->body($import->importer::getCompletedNotificationBody($import))\n                        ->when(\n                            ! $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->success(),\n                        )\n                        ->when(\n                            $failedRowsCount && ($failedRowsCount < $import->total_rows),\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->warning(),\n                        )\n                        ->when(\n                            $failedRowsCount === $import->total_rows,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->danger(),\n                        )\n                        ->when(\n                            $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->actions([\n                                \\Filament\\Notifications\\Actions\\Action::make(\'downloadFailedRowsCsv\')\n                                    ->label(trans_choice(\'filament-actions::import.notifications.completed.actions.download_failed_rows_csv.label\', $failedRowsCount, [\n                                        \'count\' => \\Illuminate\\Support\\Number::format($failedRowsCount),\n                                    ]))\n                                    ->color(\'danger\')\n                                    ->url(route(\'filament.imports.failed-rows.download\', [\'import\' => $import], absolute: false), shouldOpenInNewTab: true)\n                                    ->markAsRead(),\n                            ]),\n                        )\n                        ->sendToDatabase($import->user);\n                }\";s:5:\"scope\";s:29:\"Filament\\Actions\\ImportAction\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000012e10000000000000000\";}\";s:4:\"hash\";s:44:\"qRtQJtOZwjJNbSNSBAREFiPn4IGacwPQciGXj0hyZR8=\";}}}}', NULL, 1714113033, NULL),
('9be5daee-5d27-4b73-a6c2-33da3ac161a6', '', 1, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:2701:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:6:\"import\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Imports\\Models\\Import\";s:2:\"id\";i:9;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}}s:8:\"function\";s:2271:\"function () use ($import) {\n                    $import->touch(\'completed_at\');\n\n                    if (! $import->user instanceof \\Illuminate\\Contracts\\Auth\\Authenticatable) {\n                        return;\n                    }\n\n                    $failedRowsCount = $import->getFailedRowsCount();\n\n                    \\Filament\\Notifications\\Notification::make()\n                        ->title(__(\'filament-actions::import.notifications.completed.title\'))\n                        ->body($import->importer::getCompletedNotificationBody($import))\n                        ->when(\n                            ! $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->success(),\n                        )\n                        ->when(\n                            $failedRowsCount && ($failedRowsCount < $import->total_rows),\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->warning(),\n                        )\n                        ->when(\n                            $failedRowsCount === $import->total_rows,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->danger(),\n                        )\n                        ->when(\n                            $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->actions([\n                                \\Filament\\Notifications\\Actions\\Action::make(\'downloadFailedRowsCsv\')\n                                    ->label(trans_choice(\'filament-actions::import.notifications.completed.actions.download_failed_rows_csv.label\', $failedRowsCount, [\n                                        \'count\' => \\Illuminate\\Support\\Number::format($failedRowsCount),\n                                    ]))\n                                    ->color(\'danger\')\n                                    ->url(route(\'filament.imports.failed-rows.download\', [\'import\' => $import], absolute: false), shouldOpenInNewTab: true)\n                                    ->markAsRead(),\n                            ]),\n                        )\n                        ->sendToDatabase($import->user);\n                }\";s:5:\"scope\";s:29:\"Filament\\Actions\\ImportAction\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000012e30000000000000000\";}\";s:4:\"hash\";s:44:\"7/hVStXJyNh7a48rmnjvjBNo84qzoodII3S27/oUVRw=\";}}}}', NULL, 1714115228, 1714115230),
('9be5ddbf-8bb1-49ed-962b-f5e85a7d4503', '', 1, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:2702:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:6:\"import\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Imports\\Models\\Import\";s:2:\"id\";i:10;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}}s:8:\"function\";s:2271:\"function () use ($import) {\n                    $import->touch(\'completed_at\');\n\n                    if (! $import->user instanceof \\Illuminate\\Contracts\\Auth\\Authenticatable) {\n                        return;\n                    }\n\n                    $failedRowsCount = $import->getFailedRowsCount();\n\n                    \\Filament\\Notifications\\Notification::make()\n                        ->title(__(\'filament-actions::import.notifications.completed.title\'))\n                        ->body($import->importer::getCompletedNotificationBody($import))\n                        ->when(\n                            ! $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->success(),\n                        )\n                        ->when(\n                            $failedRowsCount && ($failedRowsCount < $import->total_rows),\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->warning(),\n                        )\n                        ->when(\n                            $failedRowsCount === $import->total_rows,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->danger(),\n                        )\n                        ->when(\n                            $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->actions([\n                                \\Filament\\Notifications\\Actions\\Action::make(\'downloadFailedRowsCsv\')\n                                    ->label(trans_choice(\'filament-actions::import.notifications.completed.actions.download_failed_rows_csv.label\', $failedRowsCount, [\n                                        \'count\' => \\Illuminate\\Support\\Number::format($failedRowsCount),\n                                    ]))\n                                    ->color(\'danger\')\n                                    ->url(route(\'filament.imports.failed-rows.download\', [\'import\' => $import], absolute: false), shouldOpenInNewTab: true)\n                                    ->markAsRead(),\n                            ]),\n                        )\n                        ->sendToDatabase($import->user);\n                }\";s:5:\"scope\";s:29:\"Filament\\Actions\\ImportAction\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000013f40000000000000000\";}\";s:4:\"hash\";s:44:\"vGHFa6ZcPeljJhsSx+CZolXTarxMswR9kjY9PBONhI4=\";}}}}', NULL, 1714115701, 1714115703),
('9c1c06eb-eb3a-4b85-9411-40c7397aba41', '', 1, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:2702:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:6:\"import\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Imports\\Models\\Import\";s:2:\"id\";i:11;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}}s:8:\"function\";s:2271:\"function () use ($import) {\n                    $import->touch(\'completed_at\');\n\n                    if (! $import->user instanceof \\Illuminate\\Contracts\\Auth\\Authenticatable) {\n                        return;\n                    }\n\n                    $failedRowsCount = $import->getFailedRowsCount();\n\n                    \\Filament\\Notifications\\Notification::make()\n                        ->title(__(\'filament-actions::import.notifications.completed.title\'))\n                        ->body($import->importer::getCompletedNotificationBody($import))\n                        ->when(\n                            ! $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->success(),\n                        )\n                        ->when(\n                            $failedRowsCount && ($failedRowsCount < $import->total_rows),\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->warning(),\n                        )\n                        ->when(\n                            $failedRowsCount === $import->total_rows,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->danger(),\n                        )\n                        ->when(\n                            $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->actions([\n                                \\Filament\\Notifications\\Actions\\Action::make(\'downloadFailedRowsCsv\')\n                                    ->label(trans_choice(\'filament-actions::import.notifications.completed.actions.download_failed_rows_csv.label\', $failedRowsCount, [\n                                        \'count\' => \\Illuminate\\Support\\Number::format($failedRowsCount),\n                                    ]))\n                                    ->color(\'danger\')\n                                    ->url(route(\'filament.imports.failed-rows.download\', [\'import\' => $import], absolute: false), shouldOpenInNewTab: true)\n                                    ->markAsRead(),\n                            ]),\n                        )\n                        ->sendToDatabase($import->user);\n                }\";s:5:\"scope\";s:29:\"Filament\\Actions\\ImportAction\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000013c30000000000000000\";}\";s:4:\"hash\";s:44:\"Mk+kezgGbi1Mw7e0pbigPagkT5ccKSndtzNPmItCUpk=\";}}}}', NULL, 1716441891, 1716441891),
('9c1c0a26-8301-40e7-9ffc-ede7f45102d0', '', 1, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:2702:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:6:\"import\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Imports\\Models\\Import\";s:2:\"id\";i:12;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}}s:8:\"function\";s:2271:\"function () use ($import) {\n                    $import->touch(\'completed_at\');\n\n                    if (! $import->user instanceof \\Illuminate\\Contracts\\Auth\\Authenticatable) {\n                        return;\n                    }\n\n                    $failedRowsCount = $import->getFailedRowsCount();\n\n                    \\Filament\\Notifications\\Notification::make()\n                        ->title(__(\'filament-actions::import.notifications.completed.title\'))\n                        ->body($import->importer::getCompletedNotificationBody($import))\n                        ->when(\n                            ! $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->success(),\n                        )\n                        ->when(\n                            $failedRowsCount && ($failedRowsCount < $import->total_rows),\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->warning(),\n                        )\n                        ->when(\n                            $failedRowsCount === $import->total_rows,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->danger(),\n                        )\n                        ->when(\n                            $failedRowsCount,\n                            fn (\\Filament\\Notifications\\Notification $notification) => $notification->actions([\n                                \\Filament\\Notifications\\Actions\\Action::make(\'downloadFailedRowsCsv\')\n                                    ->label(trans_choice(\'filament-actions::import.notifications.completed.actions.download_failed_rows_csv.label\', $failedRowsCount, [\n                                        \'count\' => \\Illuminate\\Support\\Number::format($failedRowsCount),\n                                    ]))\n                                    ->color(\'danger\')\n                                    ->url(route(\'filament.imports.failed-rows.download\', [\'import\' => $import], absolute: false), shouldOpenInNewTab: true)\n                                    ->markAsRead(),\n                            ]),\n                        )\n                        ->sendToDatabase($import->user);\n                }\";s:5:\"scope\";s:29:\"Filament\\Actions\\ImportAction\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000013c30000000000000000\";}\";s:4:\"hash\";s:44:\"NoXpqetEysLnFbUAQqaJJ+CHyDzExRWPk9s8NxyWwFc=\";}}}}', NULL, 1716442433, 1716442433),
('9c48a3ee-2c73-47b6-b1a3-ac986d584e8c', '', 2, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:7148:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:4:\"next\";O:46:\"Filament\\Actions\\Exports\\Jobs\\ExportCompletion\":7:{s:11:\"\0*\0exporter\";O:37:\"App\\Filament\\Exports\\QuestionExporter\":3:{s:9:\"\0*\0export\";O:38:\"Filament\\Actions\\Exports\\Models\\Export\":30:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";N;s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:3:\"int\";s:12:\"incrementing\";b:1;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:1;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:8:{s:7:\"user_id\";i:1;s:8:\"exporter\";s:37:\"App\\Filament\\Exports\\QuestionExporter\";s:10:\"total_rows\";i:13;s:9:\"file_disk\";s:6:\"public\";s:10:\"updated_at\";s:19:\"2024-06-14 09:40:18\";s:10:\"created_at\";s:19:\"2024-06-14 09:40:18\";s:2:\"id\";i:1;s:9:\"file_name\";s:18:\"export-1-questions\";}s:11:\"\0*\0original\";a:8:{s:7:\"user_id\";i:1;s:8:\"exporter\";s:37:\"App\\Filament\\Exports\\QuestionExporter\";s:10:\"total_rows\";i:13;s:9:\"file_disk\";s:6:\"public\";s:10:\"updated_at\";s:19:\"2024-06-14 09:40:18\";s:10:\"created_at\";s:19:\"2024-06-14 09:40:18\";s:2:\"id\";i:1;s:9:\"file_name\";s:18:\"export-1-questions\";}s:10:\"\0*\0changes\";a:1:{s:9:\"file_name\";s:18:\"export-1-questions\";}s:8:\"\0*\0casts\";a:4:{s:12:\"completed_at\";s:9:\"timestamp\";s:14:\"processed_rows\";s:7:\"integer\";s:10:\"total_rows\";s:7:\"integer\";s:15:\"successful_rows\";s:7:\"integer\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:0;s:9:\"\0*\0hidden\";a:0:{}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:0:{}s:10:\"\0*\0guarded\";a:0:{}}s:12:\"\0*\0columnMap\";a:17:{s:2:\"id\";s:2:\"ID\";s:16:\"question_bank_id\";s:16:\"Question bank id\";s:10:\"audio_file\";s:10:\"Audio file\";s:9:\"paragraph\";s:9:\"Paragraph\";s:8:\"question\";s:8:\"Question\";s:13:\"question_type\";s:13:\"Question type\";s:10:\"difficulty\";s:10:\"Difficulty\";s:5:\"topic\";s:5:\"Topic\";s:5:\"marks\";s:5:\"Marks\";s:14:\"negative_marks\";s:14:\"Negative marks\";s:4:\"hint\";s:4:\"Hint\";s:11:\"explanation\";s:11:\"Explanation\";s:6:\"answer\";s:6:\"Answer\";s:20:\"check_capitalization\";s:20:\"Check capitalization\";s:17:\"check_punctuation\";s:17:\"Check punctuation\";s:10:\"created_at\";s:10:\"Created at\";s:10:\"updated_at\";s:10:\"Updated at\";}s:10:\"\0*\0options\";a:0:{}}s:9:\"\0*\0export\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Exports\\Models\\Export\";s:2:\"id\";i:1;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}s:12:\"\0*\0columnMap\";a:17:{s:2:\"id\";s:2:\"ID\";s:16:\"question_bank_id\";s:16:\"Question bank id\";s:10:\"audio_file\";s:10:\"Audio file\";s:9:\"paragraph\";s:9:\"Paragraph\";s:8:\"question\";s:8:\"Question\";s:13:\"question_type\";s:13:\"Question type\";s:10:\"difficulty\";s:10:\"Difficulty\";s:5:\"topic\";s:5:\"Topic\";s:5:\"marks\";s:5:\"Marks\";s:14:\"negative_marks\";s:14:\"Negative marks\";s:4:\"hint\";s:4:\"Hint\";s:11:\"explanation\";s:11:\"Explanation\";s:6:\"answer\";s:6:\"Answer\";s:20:\"check_capitalization\";s:20:\"Check capitalization\";s:17:\"check_punctuation\";s:17:\"Check punctuation\";s:10:\"created_at\";s:10:\"Created at\";s:10:\"updated_at\";s:10:\"Updated at\";}s:10:\"\0*\0formats\";a:2:{i:0;E:47:\"Filament\\Actions\\Exports\\Enums\\ExportFormat:Csv\";i:1;E:48:\"Filament\\Actions\\Exports\\Enums\\ExportFormat:Xlsx\";}s:10:\"\0*\0options\";a:0:{}s:19:\"chainCatchCallbacks\";a:0:{}s:7:\"chained\";a:1:{i:0;s:3225:\"O:44:\"Filament\\Actions\\Exports\\Jobs\\CreateXlsxFile\":4:{s:11:\"\0*\0exporter\";O:37:\"App\\Filament\\Exports\\QuestionExporter\":3:{s:9:\"\0*\0export\";O:38:\"Filament\\Actions\\Exports\\Models\\Export\":30:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";N;s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:3:\"int\";s:12:\"incrementing\";b:1;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:1;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:8:{s:7:\"user_id\";i:1;s:8:\"exporter\";s:37:\"App\\Filament\\Exports\\QuestionExporter\";s:10:\"total_rows\";i:13;s:9:\"file_disk\";s:6:\"public\";s:10:\"updated_at\";s:19:\"2024-06-14 09:40:18\";s:10:\"created_at\";s:19:\"2024-06-14 09:40:18\";s:2:\"id\";i:1;s:9:\"file_name\";s:18:\"export-1-questions\";}s:11:\"\0*\0original\";a:8:{s:7:\"user_id\";i:1;s:8:\"exporter\";s:37:\"App\\Filament\\Exports\\QuestionExporter\";s:10:\"total_rows\";i:13;s:9:\"file_disk\";s:6:\"public\";s:10:\"updated_at\";s:19:\"2024-06-14 09:40:18\";s:10:\"created_at\";s:19:\"2024-06-14 09:40:18\";s:2:\"id\";i:1;s:9:\"file_name\";s:18:\"export-1-questions\";}s:10:\"\0*\0changes\";a:1:{s:9:\"file_name\";s:18:\"export-1-questions\";}s:8:\"\0*\0casts\";a:4:{s:12:\"completed_at\";s:9:\"timestamp\";s:14:\"processed_rows\";s:7:\"integer\";s:10:\"total_rows\";s:7:\"integer\";s:15:\"successful_rows\";s:7:\"integer\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:0;s:9:\"\0*\0hidden\";a:0:{}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:0:{}s:10:\"\0*\0guarded\";a:0:{}}s:12:\"\0*\0columnMap\";a:17:{s:2:\"id\";s:2:\"ID\";s:16:\"question_bank_id\";s:16:\"Question bank id\";s:10:\"audio_file\";s:10:\"Audio file\";s:9:\"paragraph\";s:9:\"Paragraph\";s:8:\"question\";s:8:\"Question\";s:13:\"question_type\";s:13:\"Question type\";s:10:\"difficulty\";s:10:\"Difficulty\";s:5:\"topic\";s:5:\"Topic\";s:5:\"marks\";s:5:\"Marks\";s:14:\"negative_marks\";s:14:\"Negative marks\";s:4:\"hint\";s:4:\"Hint\";s:11:\"explanation\";s:11:\"Explanation\";s:6:\"answer\";s:6:\"Answer\";s:20:\"check_capitalization\";s:20:\"Check capitalization\";s:17:\"check_punctuation\";s:17:\"Check punctuation\";s:10:\"created_at\";s:10:\"Created at\";s:10:\"updated_at\";s:10:\"Updated at\";}s:10:\"\0*\0options\";a:0:{}}s:9:\"\0*\0export\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Exports\\Models\\Export\";s:2:\"id\";i:1;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}s:12:\"\0*\0columnMap\";a:17:{s:2:\"id\";s:2:\"ID\";s:16:\"question_bank_id\";s:16:\"Question bank id\";s:10:\"audio_file\";s:10:\"Audio file\";s:9:\"paragraph\";s:9:\"Paragraph\";s:8:\"question\";s:8:\"Question\";s:13:\"question_type\";s:13:\"Question type\";s:10:\"difficulty\";s:10:\"Difficulty\";s:5:\"topic\";s:5:\"Topic\";s:5:\"marks\";s:5:\"Marks\";s:14:\"negative_marks\";s:14:\"Negative marks\";s:4:\"hint\";s:4:\"Hint\";s:11:\"explanation\";s:11:\"Explanation\";s:6:\"answer\";s:6:\"Answer\";s:20:\"check_capitalization\";s:20:\"Check capitalization\";s:17:\"check_punctuation\";s:17:\"Check punctuation\";s:10:\"created_at\";s:10:\"Created at\";s:10:\"updated_at\";s:10:\"Updated at\";}s:10:\"\0*\0options\";a:0:{}}\";}}}s:8:\"function\";s:266:\"function (\\Illuminate\\Bus\\Batch $batch) use ($next) {\n                if (! $batch->cancelled()) {\n                    \\Illuminate\\Container\\Container::getInstance()->make(\\Illuminate\\Contracts\\Bus\\Dispatcher::class)->dispatch($next);\n                }\n            }\";s:5:\"scope\";s:27:\"Illuminate\\Bus\\ChainedBatch\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000013eb0000000000000000\";}\";s:4:\"hash\";s:44:\"4ZS7EJOvRoNVBsMhGnaiTLiAedtm0naIqSBnzRfJAKw=\";}}}}', NULL, 1718358018, 1718358018),
('9c48ac4b-26c0-43b0-836c-6fce2c9b4453', '', 2, 0, 0, '[]', 'a:2:{s:13:\"allowFailures\";b:1;s:7:\"finally\";a:1:{i:0;O:47:\"Laravel\\SerializableClosure\\SerializableClosure\":1:{s:12:\"serializable\";O:46:\"Laravel\\SerializableClosure\\Serializers\\Signed\":2:{s:12:\"serializable\";s:7148:\"O:46:\"Laravel\\SerializableClosure\\Serializers\\Native\":5:{s:3:\"use\";a:1:{s:4:\"next\";O:46:\"Filament\\Actions\\Exports\\Jobs\\ExportCompletion\":7:{s:11:\"\0*\0exporter\";O:37:\"App\\Filament\\Exports\\QuestionExporter\":3:{s:9:\"\0*\0export\";O:38:\"Filament\\Actions\\Exports\\Models\\Export\":30:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";N;s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:3:\"int\";s:12:\"incrementing\";b:1;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:1;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:8:{s:7:\"user_id\";i:1;s:8:\"exporter\";s:37:\"App\\Filament\\Exports\\QuestionExporter\";s:10:\"total_rows\";i:14;s:9:\"file_disk\";s:6:\"public\";s:10:\"updated_at\";s:19:\"2024-06-14 10:03:41\";s:10:\"created_at\";s:19:\"2024-06-14 10:03:41\";s:2:\"id\";i:2;s:9:\"file_name\";s:18:\"export-2-questions\";}s:11:\"\0*\0original\";a:8:{s:7:\"user_id\";i:1;s:8:\"exporter\";s:37:\"App\\Filament\\Exports\\QuestionExporter\";s:10:\"total_rows\";i:14;s:9:\"file_disk\";s:6:\"public\";s:10:\"updated_at\";s:19:\"2024-06-14 10:03:41\";s:10:\"created_at\";s:19:\"2024-06-14 10:03:41\";s:2:\"id\";i:2;s:9:\"file_name\";s:18:\"export-2-questions\";}s:10:\"\0*\0changes\";a:1:{s:9:\"file_name\";s:18:\"export-2-questions\";}s:8:\"\0*\0casts\";a:4:{s:12:\"completed_at\";s:9:\"timestamp\";s:14:\"processed_rows\";s:7:\"integer\";s:10:\"total_rows\";s:7:\"integer\";s:15:\"successful_rows\";s:7:\"integer\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:0;s:9:\"\0*\0hidden\";a:0:{}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:0:{}s:10:\"\0*\0guarded\";a:0:{}}s:12:\"\0*\0columnMap\";a:17:{s:2:\"id\";s:2:\"ID\";s:16:\"question_bank_id\";s:16:\"Question bank id\";s:10:\"audio_file\";s:10:\"Audio file\";s:9:\"paragraph\";s:9:\"Paragraph\";s:8:\"question\";s:8:\"Question\";s:13:\"question_type\";s:13:\"Question type\";s:10:\"difficulty\";s:10:\"Difficulty\";s:5:\"topic\";s:5:\"Topic\";s:5:\"marks\";s:5:\"Marks\";s:14:\"negative_marks\";s:14:\"Negative marks\";s:4:\"hint\";s:4:\"Hint\";s:11:\"explanation\";s:11:\"Explanation\";s:6:\"answer\";s:6:\"Answer\";s:20:\"check_capitalization\";s:20:\"Check capitalization\";s:17:\"check_punctuation\";s:17:\"Check punctuation\";s:10:\"created_at\";s:10:\"Created at\";s:10:\"updated_at\";s:10:\"Updated at\";}s:10:\"\0*\0options\";a:0:{}}s:9:\"\0*\0export\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Exports\\Models\\Export\";s:2:\"id\";i:2;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}s:12:\"\0*\0columnMap\";a:17:{s:2:\"id\";s:2:\"ID\";s:16:\"question_bank_id\";s:16:\"Question bank id\";s:10:\"audio_file\";s:10:\"Audio file\";s:9:\"paragraph\";s:9:\"Paragraph\";s:8:\"question\";s:8:\"Question\";s:13:\"question_type\";s:13:\"Question type\";s:10:\"difficulty\";s:10:\"Difficulty\";s:5:\"topic\";s:5:\"Topic\";s:5:\"marks\";s:5:\"Marks\";s:14:\"negative_marks\";s:14:\"Negative marks\";s:4:\"hint\";s:4:\"Hint\";s:11:\"explanation\";s:11:\"Explanation\";s:6:\"answer\";s:6:\"Answer\";s:20:\"check_capitalization\";s:20:\"Check capitalization\";s:17:\"check_punctuation\";s:17:\"Check punctuation\";s:10:\"created_at\";s:10:\"Created at\";s:10:\"updated_at\";s:10:\"Updated at\";}s:10:\"\0*\0formats\";a:2:{i:0;E:47:\"Filament\\Actions\\Exports\\Enums\\ExportFormat:Csv\";i:1;E:48:\"Filament\\Actions\\Exports\\Enums\\ExportFormat:Xlsx\";}s:10:\"\0*\0options\";a:0:{}s:19:\"chainCatchCallbacks\";a:0:{}s:7:\"chained\";a:1:{i:0;s:3225:\"O:44:\"Filament\\Actions\\Exports\\Jobs\\CreateXlsxFile\":4:{s:11:\"\0*\0exporter\";O:37:\"App\\Filament\\Exports\\QuestionExporter\":3:{s:9:\"\0*\0export\";O:38:\"Filament\\Actions\\Exports\\Models\\Export\":30:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";N;s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:3:\"int\";s:12:\"incrementing\";b:1;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:1;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:8:{s:7:\"user_id\";i:1;s:8:\"exporter\";s:37:\"App\\Filament\\Exports\\QuestionExporter\";s:10:\"total_rows\";i:14;s:9:\"file_disk\";s:6:\"public\";s:10:\"updated_at\";s:19:\"2024-06-14 10:03:41\";s:10:\"created_at\";s:19:\"2024-06-14 10:03:41\";s:2:\"id\";i:2;s:9:\"file_name\";s:18:\"export-2-questions\";}s:11:\"\0*\0original\";a:8:{s:7:\"user_id\";i:1;s:8:\"exporter\";s:37:\"App\\Filament\\Exports\\QuestionExporter\";s:10:\"total_rows\";i:14;s:9:\"file_disk\";s:6:\"public\";s:10:\"updated_at\";s:19:\"2024-06-14 10:03:41\";s:10:\"created_at\";s:19:\"2024-06-14 10:03:41\";s:2:\"id\";i:2;s:9:\"file_name\";s:18:\"export-2-questions\";}s:10:\"\0*\0changes\";a:1:{s:9:\"file_name\";s:18:\"export-2-questions\";}s:8:\"\0*\0casts\";a:4:{s:12:\"completed_at\";s:9:\"timestamp\";s:14:\"processed_rows\";s:7:\"integer\";s:10:\"total_rows\";s:7:\"integer\";s:15:\"successful_rows\";s:7:\"integer\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:0;s:9:\"\0*\0hidden\";a:0:{}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:0:{}s:10:\"\0*\0guarded\";a:0:{}}s:12:\"\0*\0columnMap\";a:17:{s:2:\"id\";s:2:\"ID\";s:16:\"question_bank_id\";s:16:\"Question bank id\";s:10:\"audio_file\";s:10:\"Audio file\";s:9:\"paragraph\";s:9:\"Paragraph\";s:8:\"question\";s:8:\"Question\";s:13:\"question_type\";s:13:\"Question type\";s:10:\"difficulty\";s:10:\"Difficulty\";s:5:\"topic\";s:5:\"Topic\";s:5:\"marks\";s:5:\"Marks\";s:14:\"negative_marks\";s:14:\"Negative marks\";s:4:\"hint\";s:4:\"Hint\";s:11:\"explanation\";s:11:\"Explanation\";s:6:\"answer\";s:6:\"Answer\";s:20:\"check_capitalization\";s:20:\"Check capitalization\";s:17:\"check_punctuation\";s:17:\"Check punctuation\";s:10:\"created_at\";s:10:\"Created at\";s:10:\"updated_at\";s:10:\"Updated at\";}s:10:\"\0*\0options\";a:0:{}}s:9:\"\0*\0export\";O:45:\"Illuminate\\Contracts\\Database\\ModelIdentifier\":5:{s:5:\"class\";s:38:\"Filament\\Actions\\Exports\\Models\\Export\";s:2:\"id\";i:2;s:9:\"relations\";a:0:{}s:10:\"connection\";s:5:\"mysql\";s:15:\"collectionClass\";N;}s:12:\"\0*\0columnMap\";a:17:{s:2:\"id\";s:2:\"ID\";s:16:\"question_bank_id\";s:16:\"Question bank id\";s:10:\"audio_file\";s:10:\"Audio file\";s:9:\"paragraph\";s:9:\"Paragraph\";s:8:\"question\";s:8:\"Question\";s:13:\"question_type\";s:13:\"Question type\";s:10:\"difficulty\";s:10:\"Difficulty\";s:5:\"topic\";s:5:\"Topic\";s:5:\"marks\";s:5:\"Marks\";s:14:\"negative_marks\";s:14:\"Negative marks\";s:4:\"hint\";s:4:\"Hint\";s:11:\"explanation\";s:11:\"Explanation\";s:6:\"answer\";s:6:\"Answer\";s:20:\"check_capitalization\";s:20:\"Check capitalization\";s:17:\"check_punctuation\";s:17:\"Check punctuation\";s:10:\"created_at\";s:10:\"Created at\";s:10:\"updated_at\";s:10:\"Updated at\";}s:10:\"\0*\0options\";a:0:{}}\";}}}s:8:\"function\";s:266:\"function (\\Illuminate\\Bus\\Batch $batch) use ($next) {\n                if (! $batch->cancelled()) {\n                    \\Illuminate\\Container\\Container::getInstance()->make(\\Illuminate\\Contracts\\Bus\\Dispatcher::class)->dispatch($next);\n                }\n            }\";s:5:\"scope\";s:27:\"Illuminate\\Bus\\ChainedBatch\";s:4:\"this\";N;s:4:\"self\";s:32:\"00000000000013eb0000000000000000\";}\";s:4:\"hash\";s:44:\"THWtoWr2w33PXonEAFvc8SzoIkk82ta53jKc3SF+hCU=\";}}}}', NULL, 1718359421, 1718359421);

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Declined','Approved') NOT NULL DEFAULT 'Pending',
  `updated_by` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leaves`
--

INSERT INTO `leaves` (`id`, `user_id`, `start_date`, `end_date`, `reason`, `status`, `updated_by`, `team_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-04-22', '2024-04-22', 'fdfd', 'Approved', 1, 1, '2024-04-22 00:11:38', '2024-04-22 09:35:48'),
(2, 1, '2024-04-22', '2024-04-23', 'no', 'Approved', 1, 1, '2024-04-22 09:35:37', '2024-06-05 00:08:13'),
(3, 11, '2024-05-07', '2024-05-08', 'Bla ...', 'Approved', 1, 1, '2024-05-07 06:07:59', '2024-05-07 06:10:42'),
(4, 11, '2024-05-10', '2024-05-15', 'sick leave', 'Pending', NULL, 1, '2024-05-08 00:32:04', '2024-05-08 00:32:04'),
(5, 11, '2024-05-01', '2024-05-04', 'Testing', 'Pending', NULL, 1, '2024-05-08 05:29:33', '2024-05-08 05:29:33'),
(6, 11, '2024-05-01', '2024-05-04', 'Testing', 'Pending', NULL, 1, '2024-05-08 05:31:53', '2024-05-08 05:31:53'),
(7, 11, '2024-05-01', '2024-05-04', 'Abcde', 'Pending', NULL, 1, '2024-05-08 05:33:03', '2024-05-08 05:33:03'),
(8, 11, '2024-05-01', '2024-05-07', 'Poiuytrewq', 'Pending', NULL, 1, '2024-05-08 05:34:37', '2024-05-08 05:34:37'),
(9, 11, '2024-05-09', '2024-05-10', 'n', 'Approved', 1, 1, '2024-05-09 02:34:34', '2024-06-11 08:24:09'),
(10, 11, '2024-05-10', '2024-05-15', 'sick leave', 'Pending', NULL, 1, '2024-05-10 00:07:23', '2024-05-10 00:07:23'),
(11, 59, '2024-05-23', '2024-05-23', 'Feeling sick', 'Declined', 1, 1, '2024-05-23 00:15:53', '2024-05-23 00:26:26'),
(12, 59, '2024-05-24', '2024-05-24', 'Sick Leave', 'Approved', 1, 1, '2024-05-24 02:00:55', '2024-05-24 02:02:08'),
(13, 3, '2024-05-30', '2024-05-31', 'lol', 'Declined', 1, 1, '2024-05-30 12:22:08', '2024-06-11 08:21:43'),
(14, 11, '2024-06-07', '2024-06-11', 'Not feeling well', 'Approved', 1, 1, '2024-06-05 02:34:11', '2024-06-05 02:34:56'),
(15, 60, '2024-06-07', '2024-06-07', 'emergency', 'Approved', 1, 1, '2024-06-10 04:28:13', '2024-06-10 04:47:47'),
(16, 60, '2024-06-08', '2024-06-08', 'Marriage', 'Declined', 1, 1, '2024-06-10 04:42:38', '2024-06-10 04:43:49'),
(17, 11, '2024-05-10', '2024-05-15', 'sick leave', 'Pending', NULL, 1, '2024-06-10 05:08:35', '2024-06-10 05:08:35'),
(18, 11, '2024-05-10', '2024-05-15', 'sick leave', 'Pending', NULL, 1, '2024-06-18 04:35:13', '2024-06-18 04:35:13'),
(19, 11, '2024-06-12', '2024-06-29', 'Checking', 'Pending', NULL, 1, '2024-06-18 04:41:52', '2024-06-18 04:41:52'),
(20, 11, '2024-06-22', '2024-06-25', 'Sick', 'Pending', NULL, 1, '2024-06-19 07:04:46', '2024-06-19 07:04:46'),
(21, 11, '2024-06-25', '2024-06-29', 'Sick leave', 'Pending', NULL, 1, '2024-06-23 23:19:16', '2024-06-23 23:19:16'),
(22, 11, '2024-06-29', '2024-06-30', 'Js', 'Pending', NULL, 1, '2024-06-26 06:39:08', '2024-06-26 06:39:08'),
(23, 60, '2024-06-27', '2024-06-28', 'Sick leave', 'Pending', NULL, 1, '2024-06-27 01:28:42', '2024-06-27 01:28:42'),
(24, 11, '2024-06-28', '2024-06-30', 'Infection', 'Pending', NULL, 1, '2024-06-27 04:16:54', '2024-06-27 04:16:54'),
(25, 60, '2024-06-29', '2024-06-29', 'Personal work', 'Pending', NULL, 1, '2024-06-28 23:26:48', '2024-06-28 23:26:48'),
(26, 60, '2024-06-29', '2024-06-29', 'Tesr', 'Pending', NULL, 1, '2024-06-28 23:31:06', '2024-06-28 23:31:06'),
(27, 60, '2024-06-30', '2024-07-03', 'Fever', 'Pending', NULL, 1, '2024-06-29 05:19:59', '2024-06-29 05:19:59'),
(28, 11, '2024-07-01', '2024-07-13', 'For testing', 'Pending', NULL, 1, '2024-07-02 03:39:50', '2024-07-02 03:39:50'),
(29, 11, '2024-07-10', '2024-07-15', 'sick leave checking', 'Pending', NULL, 1, '2024-07-03 00:03:47', '2024-07-03 00:03:47'),
(30, 64, '2024-07-10', '2024-07-15', 'meeting tesiting', 'Pending', NULL, 1, '2024-07-03 00:04:08', '2024-07-03 00:04:08'),
(31, 64, '2024-07-03', '2024-07-15', 'meeting tesiting', 'Pending', NULL, 1, '2024-07-03 00:16:49', '2024-07-03 00:16:49'),
(32, 11, '2024-07-03', '2024-07-04', NULL, 'Pending', 0, 1, '2024-07-03 05:01:48', '2024-07-03 05:01:48'),
(33, 11, '2024-08-10', '2024-08-15', 'sick leave', 'Pending', NULL, 1, '2024-07-03 05:22:22', '2024-07-03 05:22:22');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL,
  `team_id` bigint(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL,
  `team_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`, `team_id`) VALUES
(1, 'App\\Models\\User', 1, NULL),
(10, 'App\\Models\\User', 5, NULL),
(10, 'App\\Models\\User', 6, NULL),
(10, 'App\\Models\\User', 7, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('00b27c55-953e-4680-928e-36c365da5b61', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('01ad7b03-9be7-416d-847f-d78e2d8f15fb', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[{\"name\":\"download_csv\",\"color\":null,\"event\":null,\"eventData\":[],\"dispatchDirection\":false,\"dispatchToComponent\":null,\"extraAttributes\":[],\"icon\":null,\"iconPosition\":\"before\",\"iconSize\":null,\"isOutlined\":false,\"isDisabled\":false,\"label\":\"Download .csv\",\"shouldClose\":false,\"shouldMarkAsRead\":true,\"shouldMarkAsUnread\":false,\"shouldOpenUrlInNewTab\":true,\"size\":\"sm\",\"tooltip\":null,\"url\":\"\\/filament\\/exports\\/2\\/download?format=csv\",\"view\":\"filament-actions::link-action\"},{\"name\":\"download_xlsx\",\"color\":null,\"event\":null,\"eventData\":[],\"dispatchDirection\":false,\"dispatchToComponent\":null,\"extraAttributes\":[],\"icon\":null,\"iconPosition\":\"before\",\"iconSize\":null,\"isOutlined\":false,\"isDisabled\":false,\"label\":\"Download .xlsx\",\"shouldClose\":false,\"shouldMarkAsRead\":true,\"shouldMarkAsUnread\":false,\"shouldOpenUrlInNewTab\":true,\"size\":\"sm\",\"tooltip\":null,\"url\":\"\\/filament\\/exports\\/2\\/download?format=xlsx\",\"view\":\"filament-actions::link-action\"}],\"body\":\"Your question export has completed and 14 rows exported.\",\"color\":null,\"duration\":\"persistent\",\"icon\":\"heroicon-o-check-circle\",\"iconColor\":\"success\",\"status\":\"success\",\"title\":\"Export completed\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-14 04:33:52', '2024-06-14 04:33:41', '2024-06-14 04:33:52'),
('039856ba-a588-47cc-9f7b-99d37f300b60', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('0412bfc5-5e21-497c-8837-9927cfb556af', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('06ca06ba-099e-4ef5-89e3-b214685a8c1b', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('09ca23ee-1b2d-4112-87c8-7d84296d655d', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('09ec3b4c-e23e-4044-bbf1-ff2b10e83418', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('0e898ab3-38fa-42e8-a350-71661b9ea80c', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('0fbe0427-1348-4ec8-848a-bc45e79f1c9d', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('1178645a-a4a6-4acd-a881-ec6e9d005138', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('11937c09-ee2a-48a8-ab06-eec7f6455fa9', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('13d26865-df5f-48a6-9394-5a0a3fc6280e', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('16b8279a-8f7b-4e55-b89f-00989a4d5aae', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('19c1735b-96c6-48a3-969b-08a48339c6c4', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('1afe29dd-8589-4723-a8ee-b19355e462d4', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-27 06:16:46', '2024-05-27 06:16:46'),
('1b9d9af2-ccec-4c1b-b10a-1e15469813ca', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('1e3c51f7-f8f1-4e8f-91f2-be041b600411', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('1e4b6b99-d170-4a32-92ec-a0533ec467d4', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('1ff492b5-932d-4afc-9b73-2dd27525d2c7', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('26657010-9edb-4e06-a595-002db0b7092d', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('29b5d4a5-eee9-4b27-9560-5790a7722061', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 59, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('2bcd9e60-7ac9-45f7-8835-6e4daf93fa46', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('30ae3a70-8528-4076-83bd-2a644fe9f4e3', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('31efeb34-7c18-4414-8db1-8a0b5a652b21', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('338ce0b0-5acc-4886-943f-e5dffa09451c', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('33ae22fc-330e-4ed7-ad1a-ba938ca618bb', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('349a41a5-4edc-402e-8730-9a61f56c7ba6', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('35d664e3-ee64-4c4c-99c4-211c88b8471a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('36035821-587f-4646-a950-332c91220585', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('393c8ae5-cf16-47fe-a5a4-632522ee946e', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('3b8dd866-a551-43fc-a7c4-72aa94c85232', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('3bd47ebd-2cfa-49ab-a308-f9c14c87db07', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('3bfe9ed5-b677-4a8c-b6a2-1484c6a7d3fc', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('40fbe950-63b6-4a89-9906-9fc825532516', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('415f8a01-3816-432d-bd32-782254f82956', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('42b78763-0250-47db-b13f-444e8dfa7048', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('445c5958-018e-4904-80c0-28a4468ca09c', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-05-22 05:50:52', '2024-06-10 03:07:04'),
('454f4e8f-e88e-4f38-aeff-a6cd3e0037b6', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:04', '2024-05-21 14:26:04'),
('46978cec-ebcc-4f24-a8f4-3f3fbc8d0008', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('46d58bab-7025-481c-ad70-a57c5ce5808b', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('47fefb67-f437-45ed-b1d0-18731fb5aa63', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('493d0a7e-f9db-40c0-a634-d94a9baf7d6f', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 59, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('4a6cadf6-1c49-44f5-a201-271e84967f1a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:53', '2024-05-22 05:50:53'),
('4eaf7da0-09ce-4a53-bae2-952f8534fe39', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-05-21 14:26:04', '2024-06-10 03:07:04'),
('526936ff-511c-448b-9c48-69f249f40ec1', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('5312627c-4f85-48fd-8f21-a67fbea101f9', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('538518ee-4a53-4518-b0ef-d67674ff817c', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[{\"name\":\"download_csv\",\"color\":null,\"event\":null,\"eventData\":[],\"dispatchDirection\":false,\"dispatchToComponent\":null,\"extraAttributes\":[],\"icon\":null,\"iconPosition\":\"before\",\"iconSize\":null,\"isOutlined\":false,\"isDisabled\":false,\"label\":\"Download .csv\",\"shouldClose\":false,\"shouldMarkAsRead\":true,\"shouldMarkAsUnread\":false,\"shouldOpenUrlInNewTab\":true,\"size\":\"sm\",\"tooltip\":null,\"url\":\"\\/filament\\/exports\\/1\\/download?format=csv\",\"view\":\"filament-actions::link-action\"},{\"name\":\"download_xlsx\",\"color\":null,\"event\":null,\"eventData\":[],\"dispatchDirection\":false,\"dispatchToComponent\":null,\"extraAttributes\":[],\"icon\":null,\"iconPosition\":\"before\",\"iconSize\":null,\"isOutlined\":false,\"isDisabled\":false,\"label\":\"Download .xlsx\",\"shouldClose\":false,\"shouldMarkAsRead\":true,\"shouldMarkAsUnread\":false,\"shouldOpenUrlInNewTab\":true,\"size\":\"sm\",\"tooltip\":null,\"url\":\"\\/filament\\/exports\\/1\\/download?format=xlsx\",\"view\":\"filament-actions::link-action\"}],\"body\":\"Your question export has completed and 13 rows exported.\",\"color\":null,\"duration\":\"persistent\",\"icon\":\"heroicon-o-check-circle\",\"iconColor\":\"success\",\"status\":\"success\",\"title\":\"Export completed\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-14 04:33:24', '2024-06-14 04:10:18', '2024-06-14 04:33:24'),
('57a5eed9-8a84-4ad2-bf5a-44c4fc841701', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('5818d46a-6559-4ec1-82ae-ef639157215a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:53', '2024-05-22 05:50:53'),
('58c3a8a6-6d57-4936-9c5c-9ad2afcbe5aa', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('5a47f038-322e-4a2c-8a68-5781ff0f7776', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('5a79a193-863d-4585-8a86-5e205c738aaf', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('5c3ce74a-0483-4bda-bef9-fd7f97e1c90e', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('5deb09e8-bb96-42e3-89d2-8ac7b4fbe22b', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('5ee0640c-2d2b-4586-8d20-ab1492fb81d7', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[{\"name\":\"view\",\"color\":null,\"event\":null,\"eventData\":[],\"dispatchDirection\":false,\"dispatchToComponent\":null,\"extraAttributes\":[],\"icon\":null,\"iconPosition\":\"before\",\"iconSize\":null,\"isOutlined\":false,\"isDisabled\":false,\"label\":\"View\",\"shouldClose\":false,\"shouldMarkAsRead\":false,\"shouldMarkAsUnread\":false,\"shouldOpenUrlInNewTab\":false,\"size\":\"sm\",\"tooltip\":null,\"url\":\"https:\\/\\/lms.eprime.app\\/administrator\\/1\\/leaves?tableSearch=13\",\"view\":\"filament-actions::button-action\"}],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Your leave status is updated to Declined #13\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-11 08:21:43', '2024-06-11 08:21:43'),
('6051f7c5-477a-4468-b3a1-5aaaccca2c15', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('608b7180-96d9-4e08-83d8-7f6b557ec01e', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('60c378a4-c105-43ea-a822-f14db0d5a3b2', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('66e32301-620d-4555-92b9-34bceef77312', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('670f5f43-7082-46a1-bdf3-b0cfc35fa3a2', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('672b0b30-017f-4574-96cf-d19ff7117d60', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('684b522d-e54d-468f-9c78-1fa74476f073', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('6919c66b-a4fa-41cd-b3b8-89f57834f771', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:04', '2024-05-21 14:26:04'),
('698deb1a-8302-4d72-a93b-08e0a36a13c6', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('6e144de9-907b-44c2-96c0-23d366dc3742', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('6e380c40-cb0c-410a-b456-485ab9a207b9', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('70205983-c9d3-482b-8e92-c6cdfc1a63b7', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('709c8914-35fd-4039-8330-138cc3b3f4c7', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('7292d1a7-056c-4a3d-b9ca-237a83884d6e', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('744e9320-cc5b-452d-b126-5d7a46bbfae1', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('75329c08-8050-4ad8-beb0-01cc54a1f5bf', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 59, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('754b33b2-42ef-429f-ba7b-d3795dc9d8bd', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('76e8150a-6cf5-4b74-b87e-53daf27a01f0', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('776726fb-b03d-4e8d-b8c2-cb294e532928', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('7829bd6b-a284-43f4-8777-d07f9c0cc4b6', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-05-23 10:01:04', '2024-06-10 03:07:04'),
('78ebd6a7-6913-445e-b22d-16ec5f422bb4', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:04', '2024-05-23 10:01:04'),
('7c9379a6-a444-4f03-873b-cbc8f2010e3a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-05-22 12:09:04', '2024-06-10 03:07:04'),
('7d07e72f-5173-4f9c-97d7-246cdd403371', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('7e54e960-8077-4e6b-9672-283e18a085b1', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('7fcfec46-02ca-4c0c-aab0-e1d55ad8a2db', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-27 06:16:46', '2024-05-27 06:16:46'),
('8141853d-2dc6-47a0-b4aa-c3ad4538e02d', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('838ffa61-00aa-4c8b-be71-cc0a92dd31e8', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('8571da58-40d7-439e-b9ed-d100d3cf5fa0', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('85bc1dbc-6a50-44a6-9c10-719f5d628a63', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('8852dad1-8eea-4317-a29d-7b0eade6e705', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('8bd271fe-25d4-4b36-8fc1-aa479d1194ac', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[{\"name\":\"view\",\"color\":null,\"event\":null,\"eventData\":[],\"dispatchDirection\":false,\"dispatchToComponent\":null,\"extraAttributes\":[],\"icon\":null,\"iconPosition\":\"before\",\"iconSize\":null,\"isOutlined\":false,\"isDisabled\":false,\"label\":\"View\",\"shouldClose\":false,\"shouldMarkAsRead\":false,\"shouldMarkAsUnread\":false,\"shouldOpenUrlInNewTab\":false,\"size\":\"sm\",\"tooltip\":null,\"url\":\"https:\\/\\/lms.eprime.app\\/administrator\\/1\\/leaves?tableSearch=2\",\"view\":\"filament-actions::button-action\"}],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Your leave status is updated to Approved #2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 00:08:13', '2024-06-05 00:08:13'),
('8d064a60-b5b3-41c9-ae41-3b0f1ed27d77', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 59, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('8e151263-7541-47da-bf35-eaf7ec9d6269', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('90636218-9030-4b2d-83bc-e2125051301e', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('928e651d-735e-4ea3-ba31-eba7edcb3eed', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('9388e04a-7c8d-4573-8db3-4f737ae4d1d0', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('94b76c8f-eebc-49a0-aaab-9ee78d9fcd93', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('94ba0c85-bca1-4334-9516-a3a6b248e0aa', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('951f1535-9599-4304-b7ee-6a22be7303ed', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('96f895ca-d35c-472b-a9b9-0b2f38d35e02', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('99940068-1c7a-4e14-aa3c-cd43fef1a805', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-05-28 12:49:04', '2024-06-10 03:07:04'),
('9a0bf699-3a37-4627-a223-494aa7413d7b', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('9b4fbd30-7cb2-48ba-bff7-785c7b1268ce', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('9beb8f08-99ae-4ba7-8a90-0bb073d9337e', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-05-23 08:50:04', '2024-06-10 03:07:04'),
('9cfa5fe8-f766-4645-909a-4d0d88199e30', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-06-05 04:06:09', '2024-06-10 03:07:04'),
('a1112a17-306d-40ee-954a-8a02042e249a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('a19467ed-f9d6-422b-8aa2-4bc4d46a9162', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('a21c648b-9702-499e-9cdf-6b4e248badbe', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('a23246fa-1eee-43ef-a41f-979825d17822', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('a2921475-6f20-4c40-ad8b-1a7d8a3dd72a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-05-21 13:10:02', '2024-06-10 03:07:04'),
('a3415d74-36f9-486b-824e-f43209820fd0', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('a3462994-0bc2-4548-a7d8-aee5457867e8', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('a43d5113-a49e-462d-908b-3a50350cd917', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('a44dbf0d-795b-469c-94f9-a95e256c3d67', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('a46bffe0-b66a-4592-aa0e-0122c5ffbfd5', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('a4f12456-11a4-47fb-8809-cdef2eb40db9', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('a9afbbef-2c0e-40a1-8a2a-b360543924bd', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('aa3c614c-4db1-4bb2-ad84-99680aa9ebff', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('aaa7e899-3367-4d8e-97b6-1e3ba061a2a9', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('aaf4a7ca-b97b-427f-9902-423e6db18865', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('ac597ead-2f88-45b6-915d-8b54eb1734b9', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('ad243a7d-ed3e-4b1e-ab5f-90dabbaaa7e6', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('adec457f-60a6-4547-9c78-9bbffeabca0a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('afd231c0-4b42-4852-9ef9-95b2c792dd0e', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-05-22 06:40:28', '2024-06-10 03:07:04'),
('b05fdbfd-6fc5-40a8-a8fe-bc6a7e1fd6d0', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('b172ae05-0622-434d-a148-12628e7d2c80', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 47, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('b212d275-7763-4415-a0ed-cf3f07285c1f', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('b44dfa86-e865-4919-aef0-6b7960db7ac0', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('b4d59d95-79bb-45fe-86ee-01d96d758fb1', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-27 06:16:46', '2024-05-27 06:16:46'),
('b5137aeb-2c38-4801-87b4-98871cf3184b', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('b5df2c61-cdf2-4549-bdbf-e9249cc93e63', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('b6e91191-63e7-4164-8401-c92dc813c421', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('b7250476-0264-4e88-aaa0-9406bb268003', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:04', '2024-05-21 14:26:04'),
('b73591d6-e683-4d0b-9abe-d4f31d0a69db', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('b864c75a-ff0e-4c31-8581-de737063a43b', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('b8827120-97f6-4d76-a4eb-f672518dcdb4', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 59, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('bc7583bc-eb65-4465-8330-290b408499bb', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('bd747645-3b4c-431e-af78-81b29f7f3b2b', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('bf6cfe74-7161-4b21-b379-bc9d7515a451', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('bff44e8f-ee83-4e53-9cf8-332e02218b65', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('c04ea6ae-0518-46c5-93b0-9983ccc02e0a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('c0690f0d-01e2-4a0d-880e-420d02c153f0', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('c3eabe30-68ad-45d1-ada7-836b12dff95e', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('c630c60b-eee7-4212-a4eb-527fdedc9045', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('c64979dc-9e19-4862-a85e-8e65a15c465b', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('c7835297-a865-4770-9480-197895019c2c', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('c79ece4e-e61b-4e3e-8e45-cfb4a64af826', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('c9ae6798-a0e7-4b5c-9f76-8346db4a32bb', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('c9d9f61c-22a7-424d-84b1-3a656f41583a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('cc7688bb-0919-4852-a586-0009f536ec22', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('cd2aa4fb-2c5c-47b5-aadd-fc703268825f', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('d1b154fc-29c6-4836-b5e0-bd0e8bd4bcb2', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('d21f6ebf-81eb-4aa0-9693-79dc1b7b343f', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:04', '2024-05-21 14:26:04'),
('d270c4b2-38e3-4a7b-80ef-87790f4f5cad', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('d2ecb142-ba24-4f2d-bef5-3b2d4fe698d6', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('d4646bdc-8671-4a57-a76d-74b576dbbf1a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('d5c11050-b4b5-438c-a1e6-1be04a64f793', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('d6d07c24-0dd9-40d5-ac0e-591535013842', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('dab1bf10-b5f8-4fe2-a216-cedb80160921', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('dad7a08f-c781-4c00-851f-3fd8f175834a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('dc06f799-1e24-45cc-9c63-515eb28dc026', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 46, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('de4c1e7e-42e5-432c-9009-8015f37a2b16', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('def88ee0-85e8-4974-9f6b-acf42cd2aab6', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('e0483aa0-ba11-4fb8-bbcb-e75729fcf2d6', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('e04ad310-04ac-4309-9953-c31a78b3cb8e', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 56, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('e17d28c5-6324-43ea-b8c9-799f8f39e331', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('e23fad26-1c28-4f3e-baaf-1211ba22e829', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-06-06 04:07:04', '2024-06-10 03:07:04'),
('e38f4832-abef-44b7-a79a-04601d6d9653', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 10, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('e465a198-c379-4c57-b157-2de999159d59', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('e48dc32b-a0c6-4628-8544-82e5833c6b08', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('e6165eba-5f76-4320-8b54-aac92851ed18', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('e763b93c-fd9e-44d4-9195-359cedb83d1d', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('e8d0de79-aad6-4eba-8001-1abe6c055aef', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0506\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-05 04:06:09', '2024-06-05 04:06:09'),
('eca122be-3cb8-47a7-90fd-24bc08cbdce7', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 40, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"test2\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:26:05', '2024-05-21 14:26:05'),
('edbcc47c-d814-4936-9d67-fbe6f1b3f32a', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('ee0b7a0f-a76e-4bc1-ac00-1afd6ea1ce77', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 06:40:28', '2024-05-22 06:40:28'),
('eea3f3ae-9cec-4a95-b1d9-613601a0f086', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:05', '2024-05-23 10:01:05'),
('f1e52eff-6c8f-4fe4-8c22-aaac7c29f11f', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 6, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02'),
('f26d33b9-801c-443d-b1e1-1b15233cf405', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"hello\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 12:09:04', '2024-05-22 12:09:04'),
('f2c22f29-9fa3-46cd-bcfc-a7d0d5d75ad1', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 4, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy thursday\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 10:01:04', '2024-05-23 10:01:04'),
('f4b4c635-9638-4238-8129-ebc7d749d309', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 48, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('f7374e29-2d90-4830-809f-844ef037e6b5', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 57, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('f7be2684-230e-4460-88e1-776aa218eca2', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 3, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', '2024-06-10 03:07:04', '2024-05-21 14:21:38', '2024-06-10 03:07:04'),
('f9961409-562a-4013-bc39-3d5ec91c0b17', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 14:21:38', '2024-05-21 14:21:38'),
('f9ad45f7-1254-479a-8071-8714da693d8b', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 0606\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-06-06 04:07:04', '2024-06-06 04:07:04'),
('f9d33649-b42a-4041-8dc9-b1d6f3479842', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 49, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('fc4aa8ef-1ba9-4768-a233-0599cc8426dd', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 7, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"fdf\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-22 05:50:52', '2024-05-22 05:50:52'),
('fcc656c6-05db-49cf-b303-19dbf6b1f1b7', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 1, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Happy Kanuma\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-23 08:50:04', '2024-05-23 08:50:04'),
('fe7f265c-f3d9-4d92-9fde-c03fb94d290f', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 39, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('fe8d48bb-bd85-45af-bec1-fdab39be44c8', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 5, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"Test 2805 - V\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-28 12:49:04', '2024-05-28 12:49:04'),
('fea45bd3-25de-49de-a967-fa9f00887204', 'Filament\\Notifications\\DatabaseNotification', 'App\\Models\\User', 50, '{\"actions\":[],\"body\":null,\"color\":null,\"duration\":\"persistent\",\"icon\":null,\"iconColor\":null,\"status\":null,\"title\":\"gfdg\",\"view\":\"filament-notifications::notification\",\"viewData\":[],\"format\":\"filament\"}', NULL, '2024-05-21 13:10:02', '2024-05-21 13:10:02');

-- --------------------------------------------------------

--
-- Table structure for table `old_teams`
--

CREATE TABLE `old_teams` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `packageable`
--

CREATE TABLE `packageable` (
  `package_id` int(11) NOT NULL,
  `packageable_type` varchar(255) NOT NULL,
  `packageable_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('admin@mylearning.live', '$2y$12$mLrRUhRHH2FuDomEYuFwReaQ2O/PLmwTzkNB0tlzMFjNBwy0u2xCW', '2024-02-28 17:28:31'),
('n1sh4nt.d3v@gmail.com', '$2y$12$BWw0bt17V1mt5iafnvqz3u/NFmj0hA21AGqLUKtMhsQdXinQDUmnC', '2024-03-01 12:17:54'),
('nishant@theargusconsulting.com', '$2y$12$ugqbfVSWQ.ljJW9FuJhUR.UgWeZLQo4EXb42E8NIgZYhATXjOHV9y', '2024-06-23 23:28:37'),
('student@mylearning.live', '$2y$12$XGNSRD0l5ozo0GcGOmOOxeLL/a2PpD07Uf9yN/jCO2JS5I.51ugDi', '2024-04-22 01:24:10'),
('vamsikumar7995@gmail.com', '$2y$12$K3wkSz/OFIchTsZnZmaTbubE1UzA5k3Ws1tfQVH3P1YzYHetFU9iS', '2024-05-24 00:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'view_role', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(2, 'view_any_role', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(3, 'create_role', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(4, 'update_role', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(5, 'delete_role', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(7, 'view_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(8, 'view_any_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(9, 'create_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(10, 'update_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(11, 'restore_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(12, 'restore_any_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(13, 'replicate_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(14, 'reorder_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(15, 'delete_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(16, 'delete_any_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(17, 'force_delete_user', 'web', '2024-02-26 18:16:26', '2024-02-26 18:16:26'),
(18, 'force_delete_any_user', 'web', '2024-02-26 18:16:27', '2024-02-26 18:16:27'),
(19, 'view_any_course', 'web', '2024-02-27 16:17:09', '2024-02-27 16:17:09'),
(20, 'view_course', 'web', '2024-02-27 16:17:09', '2024-02-27 16:17:09'),
(21, 'create_course', 'web', '2024-02-27 16:17:09', '2024-02-27 16:17:09'),
(22, 'update_course', 'web', '2024-02-27 16:17:09', '2024-02-27 16:17:09'),
(23, 'delete_course', 'web', '2024-02-27 16:17:09', '2024-02-27 16:17:09'),
(24, 'delete_any_role', 'web', '2024-02-27 16:17:09', '2024-02-27 16:17:09'),
(25, 'view_any_batch', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(26, 'view_batch', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(27, 'create_batch', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(28, 'update_batch', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(29, 'delete_batch', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(30, 'view_any_branch', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(31, 'view_branch', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(32, 'create_branch', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(33, 'update_branch', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(34, 'delete_branch', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(35, 'view_any_category', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(36, 'view_category', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(37, 'create_category', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(38, 'update_category', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(39, 'delete_category', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(40, 'view_any_curriculum', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(41, 'view_curriculum', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(42, 'create_curriculum', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(43, 'update_curriculum', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(44, 'delete_curriculum', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(45, 'view_any_sub::category', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(46, 'view_sub::category', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(47, 'create_sub::category', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(48, 'update_sub::category', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(49, 'delete_sub::category', 'web', '2024-03-11 00:35:23', '2024-03-11 00:35:23'),
(50, 'view_any_section', 'web', '2024-03-11 19:30:21', '2024-03-11 19:30:21'),
(51, 'view_section', 'web', '2024-03-11 19:30:21', '2024-03-11 19:30:21'),
(52, 'create_section', 'web', '2024-03-11 19:30:21', '2024-03-11 19:30:21'),
(53, 'update_section', 'web', '2024-03-11 19:30:21', '2024-03-11 19:30:21'),
(54, 'delete_section', 'web', '2024-03-11 19:30:21', '2024-03-11 19:30:21'),
(55, 'view_any_teaching::material', 'web', '2024-03-15 03:14:21', '2024-03-15 03:14:21'),
(56, 'view_teaching::material', 'web', '2024-03-15 03:14:21', '2024-03-15 03:14:21'),
(57, 'create_announcement', 'web', '2024-06-15 01:33:16', '2024-06-15 01:33:16'),
(58, 'view_any_announcement', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(59, 'view_announcement', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(60, 'update_announcement', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(61, 'delete_announcement', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(62, 'view_any_assignment', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(63, 'view_assignment', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(64, 'create_assignment', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(65, 'update_assignment', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(66, 'delete_assignment', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(67, 'view_any_attendance', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(68, 'view_attendance', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(69, 'create_attendance', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(70, 'update_attendance', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(71, 'delete_attendance', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(72, 'view_any_authentication::log', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(73, 'view_authentication::log', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(74, 'create_authentication::log', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(75, 'update_authentication::log', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(76, 'delete_authentication::log', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(77, 'delete_any_batch', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(78, 'publish_batch', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(79, 'view_any_batch::student', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(80, 'view_batch::student', 'web', '2024-06-15 01:34:16', '2024-06-15 01:34:16'),
(81, 'create_batch::student', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(82, 'update_batch::student', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(83, 'delete_batch::student', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(84, 'view_any_calendar', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(85, 'view_calendar', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(86, 'create_calendar', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(87, 'update_calendar', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(88, 'delete_calendar', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(89, 'view_any_classroom', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(90, 'view_classroom', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(91, 'create_classroom', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(92, 'update_classroom', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(93, 'delete_classroom', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(94, 'view_any_course::master', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(95, 'view_course::master', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(96, 'create_course::master', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(97, 'update_course::master', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(98, 'delete_course::master', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(99, 'view_any_holiday', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(100, 'view_holiday', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(101, 'create_holiday', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(102, 'update_holiday', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(103, 'delete_holiday', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(104, 'view_any_leave', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(105, 'view_leave', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(106, 'create_leave', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(107, 'update_leave', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(108, 'delete_leave', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(109, 'view_any_question', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(110, 'view_question', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(111, 'create_question', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(112, 'update_question', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(113, 'delete_question', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(114, 'view_any_question::bank', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(115, 'view_question::bank', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(116, 'create_question::bank', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(117, 'update_question::bank', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(118, 'delete_question::bank', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(119, 'create_teaching::material', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(120, 'update_teaching::material', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(121, 'delete_teaching::material', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(122, 'page_MyProfilePage', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(123, 'page_Calendar', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17'),
(124, 'page_CourseMaster', 'web', '2024-06-15 01:34:17', '2024-06-15 01:34:17');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(45, 'App\\Models\\User', 1, 'appToken', 'b6cd7937fe8b38ff0c3f37e31069ce554286da6f2892675899443ca36ace368e', '[\"*\"]', '2024-05-10 00:08:02', NULL, '2024-05-09 06:44:28', '2024-05-10 00:08:02'),
(62, 'App\\Models\\User', 56, 'appToken', 'ac10280c806d7f9938affcd5ee3d609154284a034383d47bebdecc6295e10e36', '[\"*\"]', '2024-05-13 00:23:56', NULL, '2024-05-13 00:20:39', '2024-05-13 00:23:56'),
(74, 'App\\Models\\User', 56, 'appToken', 'e64ba74df9e2025aa11b555e47b5ab67052b676c8dfd330d3d9582802192ee2b', '[\"*\"]', '2024-05-15 07:13:50', NULL, '2024-05-15 06:29:36', '2024-05-15 07:13:50'),
(77, 'App\\Models\\User', 56, 'appToken', '559ee6b70fddc17b1174d17c8f22aeb6a77752c571301e726a090906d2a361d5', '[\"*\"]', '2024-05-15 07:25:56', NULL, '2024-05-15 07:25:41', '2024-05-15 07:25:56'),
(95, 'App\\Models\\User', 56, 'appToken', '4d03120fa3821a9e1feed6d25765f6a1cdbf7aec81a8455a5b3cf195107a86d1', '[\"*\"]', '2024-05-30 06:16:56', NULL, '2024-05-30 06:13:04', '2024-05-30 06:16:56'),
(131, 'App\\Models\\User', 57, 'appToken', '4b75fca2d893bb0526cb7f45cbb11b1f56f73ddec26ef71e086c684c3e0c4164', '[\"*\"]', NULL, NULL, '2024-06-06 23:03:06', '2024-06-06 23:03:06'),
(171, 'App\\Models\\User', 57, 'appToken', 'f63493bf865805339b10025c682f179260b7ab8c0e077f4b06da9db985b096a0', '[\"*\"]', NULL, NULL, '2024-06-13 23:49:05', '2024-06-13 23:49:05'),
(173, 'App\\Models\\User', 57, 'appToken', 'f3ef0720d51a9cebb383ea5af36fd73c2a5dd5cd3a5d9580a284b5d93aa1741c', '[\"*\"]', NULL, NULL, '2024-06-13 23:49:36', '2024-06-13 23:49:36'),
(174, 'App\\Models\\User', 57, 'appToken', '0563b6ce1b6d4c81104d8d932bab1061610e4916314152a4bcbd3558ef5d45ba', '[\"*\"]', NULL, NULL, '2024-06-14 01:15:00', '2024-06-14 01:15:00'),
(175, 'App\\Models\\User', 57, 'appToken', '53c9a25ab4b586c82ec2d6629de6be66fe0001352bd2be689865ca13022c8ae1', '[\"*\"]', NULL, NULL, '2024-06-14 03:50:11', '2024-06-14 03:50:11'),
(178, 'App\\Models\\User', 56, 'appToken', 'c506f26b6ba86688b001550c24c28fd905568696e7d8dc9d410cfda8e9be6962', '[\"*\"]', NULL, NULL, '2024-06-16 12:48:51', '2024-06-16 12:48:51'),
(179, 'App\\Models\\User', 56, 'appToken', '69cda30792538c80fb9b846350157412d5729e82ac693cc383d4555d546ed12f', '[\"*\"]', NULL, NULL, '2024-06-16 12:50:46', '2024-06-16 12:50:46'),
(180, 'App\\Models\\User', 56, 'appToken', '139e7bbaef7946ddb3fc45136a91d28db4cf1ea7be3f5bff386ccded143fae1f', '[\"*\"]', NULL, NULL, '2024-06-16 12:50:49', '2024-06-16 12:50:49'),
(181, 'App\\Models\\User', 56, 'appToken', 'f70ac28f75fb21491bc573050b6243f9c6fdeb53e2650010892c17b1bd49fb27', '[\"*\"]', NULL, NULL, '2024-06-16 12:51:28', '2024-06-16 12:51:28'),
(182, 'App\\Models\\User', 56, 'appToken', '12340f2f3b0ae3d8b9057d5b21107316e2a0d8b0f95652d152363240cc27f8c1', '[\"*\"]', NULL, NULL, '2024-06-16 12:52:01', '2024-06-16 12:52:01'),
(183, 'App\\Models\\User', 56, 'appToken', '9ca885dfc9c9b693e975ac904c9fec5a6b55e54637a8a0b03aee276f36623f9e', '[\"*\"]', NULL, NULL, '2024-06-16 12:52:29', '2024-06-16 12:52:29'),
(185, 'App\\Models\\User', 62, 'appToken', '01bfc613b44f2290b08c67358681311eac70b6b642dafac670c6a40f8c4fe27a', '[\"*\"]', NULL, NULL, '2024-06-16 12:55:12', '2024-06-16 12:55:12'),
(186, 'App\\Models\\User', 62, 'appToken', 'd0e80670ae632853ed04677e1118016da4b72c1ec1b9daa23325b7ad58004c16', '[\"*\"]', NULL, NULL, '2024-06-16 12:55:58', '2024-06-16 12:55:58'),
(245, 'App\\Models\\User', 64, 'appToken', 'a41276ffe14b7290dbcbec4ea116f88743099aa85392d882e3158723e708c55e', '[\"*\"]', '2024-06-25 01:45:09', NULL, '2024-06-25 01:45:01', '2024-06-25 01:45:09'),
(256, 'App\\Models\\User', 1, 'appToken', '1d75d6bad4cc968f34419445eb756d9ce20d88b90a70f918d32b9e1e5f66a7d4', '[\"*\"]', '2024-06-29 05:41:32', NULL, '2024-06-29 05:39:16', '2024-06-29 05:41:32'),
(257, 'App\\Models\\User', 57, 'appToken', '44fb0505ad0611e2976d7d336619cee512dc8ef33cf2b25c8690dafc82b72e66', '[\"*\"]', NULL, NULL, '2024-07-02 03:26:32', '2024-07-02 03:26:32'),
(262, 'App\\Models\\User', 57, 'appToken', '0f72bed039dece622367b5178d486a93f65b03dd67f8857fb6c795184822d428', '[\"*\"]', NULL, NULL, '2024-07-02 09:42:53', '2024-07-02 09:42:53'),
(263, 'App\\Models\\User', 11, 'appToken', '6d8fba07b690713b711a4f27df8b5f1e8b73c762e62140163e59240adb285624', '[\"*\"]', '2024-07-03 00:14:27', NULL, '2024-07-03 00:03:41', '2024-07-03 00:14:27'),
(264, 'App\\Models\\User', 64, 'appToken', '2177b26cb31f98aebb7636f91d8d779a8819802f19700ee78f354c4c58432c70', '[\"*\"]', '2024-07-03 00:17:05', NULL, '2024-07-03 00:03:51', '2024-07-03 00:17:05'),
(265, 'App\\Models\\User', 11, 'appToken', '959f0958ad1bb08f48e2405b0cce7276ea9d8cf4e6f57fcb9b879d846ab865d3', '[\"*\"]', NULL, NULL, '2024-07-03 05:20:48', '2024-07-03 05:20:48'),
(266, 'App\\Models\\User', 11, 'appToken', '088d7e61e9b5b2872bce1972f4532c5707cde38104babe3b6ec326d01687f5d9', '[\"*\"]', '2024-07-03 05:22:22', NULL, '2024-07-03 05:21:20', '2024-07-03 05:22:22'),
(267, 'App\\Models\\User', 57, 'appToken', '6b8598dd35ff5919f4211b0785c501b8a2a627f864e4335700e6fe05919f4141', '[\"*\"]', NULL, NULL, '2024-07-04 05:36:14', '2024-07-04 05:36:14'),
(268, 'App\\Models\\User', 11, 'appToken', 'e2dc40d936a97fc83e15369ce79e4ef18438156933e96b886348aeddcf1a2a6b', '[\"*\"]', NULL, NULL, '2024-07-04 05:37:04', '2024-07-04 05:37:04'),
(269, 'App\\Models\\User', 11, 'appToken', '64e7aa6d6366e2bc76531b1676bf796e29721af876f5e92bcdbe96dca8136bae', '[\"*\"]', '2024-07-04 07:52:30', NULL, '2024-07-04 05:37:19', '2024-07-04 07:52:30');

-- --------------------------------------------------------

--
-- Table structure for table `qualifications`
--

CREATE TABLE `qualifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `qualifications`
--

INSERT INTO `qualifications` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Master of Science', '2024-04-26 05:18:25', '2024-04-26 05:18:25'),
(2, 'B.Tech', '2024-06-14 00:58:14', '2024-06-14 00:58:14'),
(3, 'BTech', '2024-06-14 00:58:31', '2024-06-14 00:58:31'),
(4, 'Diploma', '2024-06-14 00:58:39', '2024-06-14 00:58:39');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question_bank_id` int(11) NOT NULL,
  `audio_file` varchar(255) DEFAULT NULL,
  `paragraph` longtext DEFAULT NULL,
  `question` longtext NOT NULL,
  `question_type` varchar(255) NOT NULL,
  `difficulty` varchar(255) DEFAULT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `marks` decimal(11,1) NOT NULL DEFAULT 0.0,
  `negative_marks` decimal(11,1) NOT NULL DEFAULT 0.0,
  `hint` longtext DEFAULT NULL,
  `explanation` longtext DEFAULT NULL,
  `answer` longtext DEFAULT NULL,
  `check_capitalization` tinyint(1) DEFAULT NULL,
  `check_punctuation` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `question_bank_id`, `audio_file`, `paragraph`, `question`, `question_type`, `difficulty`, `topic`, `marks`, `negative_marks`, `hint`, `explanation`, `answer`, `check_capitalization`, `check_punctuation`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, '<p>Voluptas delectus, e.</p>', '<p>Dolor ipsam ipsum et.</p>', 'MCQ - Single Correct', 'Intermediate', 'Neque ad et aut voluptas obcaecati consectetur quia at perferendis ut et aliqua Ut elit repellendus', 1.0, 0.5, '<p>Unde soluta ipsum, p.</p>', '<p>Ut et beatae quia mi.</p>', NULL, NULL, NULL, '2024-06-02 22:07:09', '2024-06-02 22:09:07'),
(2, 8, NULL, NULL, '<p>How many NOR gates are required (least number) to design a half subtractor using only NOR gates and what is the equation for borrow?</p>', 'MCQ - Single Correct', 'Intermediate', 'Week 1', 1.0, 0.5, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:00:06', '2024-06-03 01:00:06'),
(3, 8, NULL, NULL, '<p>For the design of 3x3 multiplier circuit using RCA as a block, how many RCA blocks and AND gates are used respectively?</p>', 'MCQ - Single Correct', 'Intermediate', 'Week 1', 1.0, 0.5, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:00:58', '2024-06-03 01:00:58'),
(4, 8, NULL, NULL, '<p><br>In 3x3 multiplier design using single bit adder, how many HA and FA are required respectively?</p>', 'MCQ - Single Correct', 'Intermediate', 'Week 1', 1.0, 0.0, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:02:24', '2024-06-03 01:02:24'),
(5, 3, NULL, NULL, '<p>Consider the following statements which explains the enhancement n-type MOSFET. Which of the following is/are correct?</p>', 'MCQ - Single Correct', 'Intermediate', 'Week 3', 1.0, 0.5, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:17:04', '2024-06-03 01:17:04'),
(6, 3, NULL, NULL, '<p>Consider the enhancement n-type MOSFET.Which of the following is/are correct with regards to channel formation?</p>', 'MCQ - Single Correct', 'Beginner', 'Week 3', 1.0, 0.0, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:18:01', '2024-06-03 01:18:01'),
(7, 3, NULL, NULL, '<p>The current in the enhancement n type MOSFET can be found by</p>', 'MCQ - Single Correct', 'Intermediate', 'Week 3', 1.0, 0.5, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:19:18', '2024-06-03 01:19:18'),
(8, 7, NULL, NULL, '<p>In NMOS fabrication , dry etching is done using__________</p>', 'MCQ - Single Correct', 'Intermediate', 'Week 5', 1.0, 0.0, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:29:52', '2024-06-03 01:29:52'),
(9, 7, NULL, NULL, '<p>Etching refers to the removal of material from________</p>', 'MCQ - Single Correct', 'Intermediate', 'Week 5', 1.0, 0.0, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:30:41', '2024-06-03 01:30:41'),
(10, 7, NULL, NULL, '<p>In wet etching material is removed by_____</p>', 'MCQ - Single Correct', 'Intermediate', 'Week 5', 1.0, 0.0, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:31:59', '2024-06-03 01:31:59'),
(11, 4, NULL, NULL, '<p>An important objective in the design of digital VLSI circuits is the minimization of silicon area per logic gate. Area reduction can be achieved by&nbsp;</p>', 'MCQ - Single Correct', 'Intermediate', 'Week 5', 1.0, 0.0, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:35:05', '2024-06-03 01:35:05'),
(12, 4, NULL, NULL, '<p>By what factor does the propagation delay change if device dimensions, W, L, tox and Vdd &amp; Vt are scaled by a factor 1/S</p>', 'MCQ - Single Correct', 'Beginner', 'Week 3', 1.0, 0.0, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:35:42', '2024-06-03 01:35:42'),
(13, 4, NULL, NULL, '<p>Due to the technology scaling, the power per unit area will be</p>', 'MCQ - Single Correct', 'Intermediate', 'Week 5', 1.0, 0.5, NULL, NULL, NULL, NULL, NULL, '2024-06-03 01:36:36', '2024-06-03 01:36:36'),
(14, 11, NULL, NULL, '<p>Question write here 1406</p>', '2', NULL, NULL, 1.0, 0.5, NULL, NULL, NULL, NULL, NULL, '2024-06-14 04:30:39', '2024-06-14 04:30:39');

-- --------------------------------------------------------

--
-- Table structure for table `question_banks`
--

CREATE TABLE `question_banks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `question_bank_subject_id` int(11) NOT NULL,
  `question_bank_chapter` varchar(255) DEFAULT NULL,
  `question_bank_difficulty_id` int(11) DEFAULT NULL,
  `question_bank_type_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `question_banks`
--

INSERT INTO `question_banks` (`id`, `name`, `question_bank_subject_id`, `question_bank_chapter`, `question_bank_difficulty_id`, `question_bank_type_id`, `description`, `created_at`, `updated_at`) VALUES
(3, 'April PD SL', 67, 'Week 3', 1, 1, NULL, '2024-05-23 01:10:34', '2024-06-03 01:15:35'),
(4, 'Vamsi Testing', 66, 'chapter 3', 2, 1, '1', '2024-05-25 02:02:10', '2024-06-03 01:33:49'),
(7, 'Test 12', 71, 'Week 5', 2, 1, NULL, '2024-05-30 06:27:14', '2024-06-03 01:28:51'),
(8, 'DDF Week 0', 65, 'Week 1', 2, 1, NULL, '2024-06-03 00:56:26', '2024-06-03 00:56:26'),
(9, 'DE Week 0', 66, 'Chapter 1', 1, 1, NULL, '2024-06-05 00:13:55', '2024-06-05 00:13:55'),
(10, 'Vamsi Test 1', 63, 'Vectors', 1, 1, NULL, '2024-06-14 04:09:54', '2024-06-14 04:09:54'),
(11, 'Test1406', 63, 'Test Topic 1406', 1, 2, 'Test', '2024-06-14 04:29:27', '2024-06-14 04:29:27');

-- --------------------------------------------------------

--
-- Table structure for table `question_bank_chapters`
--

CREATE TABLE `question_bank_chapters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `question_bank_chapters`
--

INSERT INTO `question_bank_chapters` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Chapter1', '2024-04-04 04:15:39', '2024-04-04 04:15:39'),
(2, 'res', '2024-05-28 00:41:53', '2024-05-28 00:41:53');

-- --------------------------------------------------------

--
-- Table structure for table `question_bank_difficulties`
--

CREATE TABLE `question_bank_difficulties` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `question_bank_difficulties`
--

INSERT INTO `question_bank_difficulties` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Beginner', '2024-04-04 03:05:41', '2024-04-04 03:05:41'),
(2, 'Intermediate', '2024-04-04 03:07:33', '2024-04-04 03:07:33'),
(3, 'Difficult', '2024-04-04 03:07:49', '2024-04-04 03:07:49');

-- --------------------------------------------------------

--
-- Table structure for table `question_bank_subjects`
--

CREATE TABLE `question_bank_subjects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `question_bank_subjects`
--

INSERT INTO `question_bank_subjects` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Test', '2024-04-04 04:15:22', '2024-04-04 04:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `question_bank_types`
--

CREATE TABLE `question_bank_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `question_bank_types`
--

INSERT INTO `question_bank_types` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'MCQ - Single Correct', '2024-04-04 03:05:59', '2024-04-04 03:05:59'),
(2, 'MCQ - Multiple Correct', '2024-04-04 03:06:11', '2024-04-04 03:06:11'),
(3, 'Fill The Blank', '2024-04-04 03:06:20', '2024-04-04 03:06:20'),
(4, 'Subjective', '2024-04-04 03:06:29', '2024-04-04 03:06:29'),
(5, 'True/False', '2024-04-04 03:06:38', '2024-04-04 03:06:38'),
(6, 'English Transcript', '2024-04-04 03:06:46', '2024-04-04 03:06:46');

-- --------------------------------------------------------

--
-- Table structure for table `question_options`
--

CREATE TABLE `question_options` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question_id` int(11) NOT NULL,
  `option` longtext NOT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `question_options`
--

INSERT INTO `question_options` (`id`, `question_id`, `option`, `is_correct`, `created_at`, `updated_at`) VALUES
(1, 1, '<p>Saepe laborum et dol.</p>', 0, '2024-06-02 22:07:09', '2024-06-02 22:09:07'),
(2, 1, '<p>Aperiam ea nihil inc.</p>', 0, '2024-06-02 22:07:09', '2024-06-02 22:09:07'),
(3, 1, '<p>Ad sit quo non anim .</p>', 1, '2024-06-02 22:07:09', '2024-06-02 22:09:07'),
(4, 2, '<p><br>4, ab’</p>', 0, '2024-06-03 01:00:06', '2024-06-03 01:00:06'),
(5, 2, '<p><br>5, a’b</p>', 0, '2024-06-03 01:00:06', '2024-06-03 01:00:06'),
(6, 2, '<p><br>6, a’b</p>', 0, '2024-06-03 01:00:06', '2024-06-03 01:00:06'),
(7, 2, '<p>7, ab</p>', 0, '2024-06-03 01:00:06', '2024-06-03 01:00:06'),
(8, 3, '<p>2.9</p>', 0, '2024-06-03 01:00:58', '2024-06-03 01:00:58'),
(9, 3, '<p>1.9</p>', 0, '2024-06-03 01:00:58', '2024-06-03 01:00:58'),
(10, 3, '<p>3.6</p>', 0, '2024-06-03 01:00:58', '2024-06-03 01:00:58'),
(11, 3, '<p>9.9</p>', 0, '2024-06-03 01:00:58', '2024-06-03 01:00:58'),
(12, 4, '<p><br>3HA,3FA</p>', 0, '2024-06-03 01:02:24', '2024-06-03 01:02:24'),
(13, 4, '<p><br>3HA,</p>', 0, '2024-06-03 01:02:24', '2024-06-03 01:02:24'),
(14, 4, '<p><br>3HA,3FB</p>', 0, '2024-06-03 01:02:24', '2024-06-03 01:02:24'),
(15, 4, '<p><br>3HA,1FA</p>', 0, '2024-06-03 01:02:24', '2024-06-03 01:02:24'),
(16, 5, '<p><br>Substrate is of p-type and is of single crystal silicon wafer</p>', 0, '2024-06-03 01:17:04', '2024-06-03 01:17:04'),
(17, 5, '<p><br>Substrate is of p-type and is of single crystal silicon wafer</p>', 0, '2024-06-03 01:17:04', '2024-06-03 01:17:04'),
(18, 5, '<p><br>Substrate is of p-type and type b</p>', 0, '2024-06-03 01:17:04', '2024-06-03 01:17:04'),
(19, 6, '<p><br>The induced n-region forms a channel in a p-type substrate</p>', 0, '2024-06-03 01:18:01', '2024-06-03 01:18:01'),
(20, 6, '<p><br>The induced n-region forms a channel&nbsp;</p>', 0, '2024-06-03 01:18:01', '2024-06-03 01:18:01'),
(21, 6, '<p>&nbsp;a channel in a p-type substrate</p>', 0, '2024-06-03 01:18:01', '2024-06-03 01:18:01'),
(22, 7, '<p><br>multiplying the charge per unit length by the electron drift velocity</p>', 0, '2024-06-03 01:19:18', '2024-06-03 01:19:18'),
(23, 7, '<p><br>Adding the charge per unit length by the electron drift velocity</p>', 0, '2024-06-03 01:19:18', '2024-06-03 01:19:18'),
(24, 7, '<p><br>dividing the charge per unit length by the electron drift velocity</p>', 0, '2024-06-03 01:19:18', '2024-06-03 01:19:18'),
(25, 8, '<p><br>plasma</p>', 0, '2024-06-03 01:29:52', '2024-06-03 01:29:52'),
(26, 8, '<p>hcl</p>', 0, '2024-06-03 01:29:52', '2024-06-03 01:29:52'),
(27, 8, '<p>nacl</p>', 0, '2024-06-03 01:29:52', '2024-06-03 01:29:52'),
(28, 9, '<p>water surface</p>', 0, '2024-06-03 01:30:41', '2024-06-03 01:30:41'),
(29, 9, '<p>water&nbsp;</p>', 0, '2024-06-03 01:30:41', '2024-06-03 01:30:41'),
(30, 9, '<p>plasma</p>', 0, '2024-06-03 01:30:41', '2024-06-03 01:30:41'),
(31, 10, '<p>chemical reaction</p>', 0, '2024-06-03 01:31:59', '2024-06-03 01:31:59'),
(32, 10, '<p>bastion</p>', 0, '2024-06-03 01:31:59', '2024-06-03 01:31:59'),
(33, 10, '<p>none&nbsp;</p>', 0, '2024-06-03 01:31:59', '2024-06-03 01:31:59'),
(34, 11, '<p>all of the above</p>', 0, '2024-06-03 01:35:05', '2024-06-03 01:35:05'),
(35, 11, '<p>none</p>', 0, '2024-06-03 01:35:05', '2024-06-03 01:35:05'),
(36, 11, '<p>careful chip layout</p>', 0, '2024-06-03 01:35:05', '2024-06-03 01:35:05'),
(37, 12, '<p>s</p>', 0, '2024-06-03 01:35:42', '2024-06-03 01:35:42'),
(38, 12, '<p>s-1</p>', 0, '2024-06-03 01:35:42', '2024-06-03 01:35:42'),
(39, 12, '<p>s+2</p>', 0, '2024-06-03 01:35:42', '2024-06-03 01:35:42'),
(40, 13, '<p>unchanged</p>', 0, '2024-06-03 01:36:36', '2024-06-03 01:36:36'),
(41, 13, '<p>half</p>', 0, '2024-06-03 01:36:36', '2024-06-03 01:36:36'),
(42, 13, '<p>2X</p>', 0, '2024-06-03 01:36:36', '2024-06-03 01:36:36'),
(43, 14, '<p>Option 1</p>', 1, '2024-06-14 04:30:39', '2024-06-14 04:30:39'),
(44, 14, '<p>Option 2</p>', 0, '2024-06-14 04:30:39', '2024-06-14 04:30:39');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `team_id`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'web', NULL, '2024-02-22 13:37:01', '2024-02-29 05:38:08'),
(2, 'Candidate', 'web', NULL, '2024-02-22 14:00:17', '2024-02-22 14:00:17'),
(3, 'Councellor', 'web', NULL, '2024-02-22 14:01:12', '2024-02-22 14:01:12'),
(4, 'Recruiter', 'web', NULL, '2024-02-22 14:01:12', '2024-02-22 14:01:12'),
(5, 'Academic Coordinator', 'web', NULL, '2024-02-22 14:01:12', '2024-02-22 14:01:12'),
(6, 'Student', 'web', NULL, '2024-02-22 14:01:12', '2024-02-22 14:01:12'),
(7, 'Tutor', 'web', NULL, '2024-02-22 14:01:12', '2024-02-22 14:01:12'),
(8, 'HR', 'web', NULL, '2024-02-22 14:01:12', '2024-02-22 14:01:12'),
(9, 'Mentor', 'web', NULL, '2024-02-22 14:01:12', '2024-02-22 14:01:12'),
(10, 'Placement Coordinator', 'web', NULL, '2024-02-27 15:43:09', '2024-03-15 11:52:56');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 7),
(2, 1),
(2, 7),
(3, 1),
(3, 7),
(4, 1),
(4, 7),
(5, 1),
(5, 7),
(7, 1),
(7, 7),
(8, 1),
(8, 7),
(9, 1),
(9, 7),
(10, 1),
(10, 7),
(15, 1),
(15, 7),
(19, 1),
(19, 6),
(19, 7),
(20, 1),
(20, 6),
(20, 7),
(21, 1),
(21, 7),
(22, 1),
(22, 7),
(23, 1),
(23, 7),
(24, 1),
(24, 7),
(25, 1),
(25, 7),
(26, 1),
(26, 7),
(27, 1),
(27, 7),
(28, 1),
(28, 7),
(29, 1),
(29, 7),
(30, 1),
(30, 7),
(31, 1),
(31, 7),
(32, 1),
(32, 7),
(33, 1),
(33, 7),
(34, 1),
(34, 7),
(35, 1),
(35, 7),
(36, 1),
(36, 7),
(37, 1),
(37, 7),
(38, 1),
(38, 7),
(39, 1),
(39, 7),
(40, 1),
(40, 6),
(40, 7),
(41, 1),
(41, 6),
(41, 7),
(42, 1),
(42, 7),
(43, 1),
(43, 7),
(44, 1),
(44, 7),
(45, 1),
(45, 7),
(46, 1),
(46, 7),
(47, 1),
(47, 7),
(48, 1),
(48, 7),
(49, 1),
(49, 7),
(50, 1),
(50, 7),
(51, 1),
(51, 7),
(52, 1),
(52, 7),
(53, 1),
(53, 7),
(54, 1),
(54, 7),
(55, 6),
(55, 7),
(56, 6),
(56, 7),
(57, 7),
(58, 7),
(59, 7),
(60, 7),
(61, 7),
(62, 7),
(63, 7),
(64, 7),
(65, 7),
(66, 7),
(67, 7),
(68, 7),
(69, 7),
(70, 7),
(71, 7),
(72, 7),
(73, 7),
(74, 7),
(75, 7),
(76, 7),
(77, 7),
(78, 7),
(79, 7),
(80, 7),
(81, 7),
(82, 7),
(83, 7),
(84, 7),
(85, 7),
(86, 7),
(87, 7),
(88, 7),
(89, 7),
(90, 7),
(91, 7),
(92, 7),
(93, 7),
(94, 7),
(95, 7),
(96, 7),
(97, 7),
(98, 7),
(99, 7),
(100, 7),
(101, 7),
(102, 7),
(103, 7),
(104, 7),
(105, 7),
(106, 7),
(107, 7),
(108, 7),
(109, 7),
(110, 7),
(111, 7),
(112, 7),
(113, 7),
(114, 7),
(115, 7),
(116, 7),
(117, 7),
(118, 7),
(119, 7),
(120, 7),
(121, 7),
(122, 7),
(123, 7),
(124, 7);

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `move_next` tinyint(1) NOT NULL,
  `short_description` text DEFAULT NULL,
  `curriculum_id` int(11) NOT NULL,
  `published` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `sort` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `name`, `move_next`, `short_description`, `curriculum_id`, `published`, `created_at`, `updated_at`, `sort`) VALUES
(45, 'SL FR', 0, 'Scripting Language Faculty Reference', 62, NULL, '2024-04-22 05:34:00', '2024-05-07 06:04:03', 2),
(46, 'SL SR', 1, 'Scripting language Students Reference', 62, 0, '2024-04-22 05:34:29', '2024-05-09 07:23:59', 1),
(47, 'CF_SR', 1, 'Students Reference', 63, NULL, '2024-04-22 05:35:07', '2024-04-22 05:35:16', NULL),
(48, 'CF_FR', 1, 'Faculty Reference', 63, NULL, '2024-04-22 05:35:38', '2024-04-22 05:35:43', NULL),
(49, 'SL AZ', 1, 'study', 64, 1, '2024-05-15 03:31:41', '2024-05-15 03:31:41', 1),
(50, 'Faculty Reference', 0, NULL, 65, 1, '2024-05-15 23:59:32', '2024-05-15 23:59:32', 1),
(51, 'Student Reference', 0, NULL, 65, 1, '2024-05-15 23:59:56', '2024-05-15 23:59:56', 2),
(52, 'RTL', 0, NULL, 65, 1, '2024-05-16 00:10:52', '2024-05-16 00:11:08', 3),
(53, 'Student Reference', 0, NULL, 66, 1, '2024-05-16 01:11:52', '2024-05-16 01:11:52', 1),
(54, 'Faculty Reference', 0, NULL, 66, 1, '2024-05-16 01:12:13', '2024-05-16 01:12:13', 0),
(55, 'Student Reference (New)', 0, NULL, 66, 1, '2024-05-16 01:12:35', '2024-05-16 01:12:35', 2),
(56, 'CF_Internship', 0, NULL, 66, 1, '2024-05-16 01:12:47', '2024-05-16 01:12:47', 3),
(57, 'Test SR', 0, NULL, 76, 0, '2024-05-23 01:14:55', '2024-05-23 01:14:55', 1),
(58, 'Test FR', 0, NULL, 76, 0, '2024-05-23 01:15:16', '2024-05-23 01:15:16', 2),
(59, 'FR', 0, NULL, 77, 0, '2024-05-25 01:47:48', '2024-05-25 01:47:48', 1),
(60, 'SR', 0, NULL, 77, 0, '2024-05-25 01:47:57', '2024-05-25 01:47:57', 2),
(61, 'Test June ', 1, NULL, 78, 1, '2024-06-14 03:56:45', '2024-06-14 03:56:45', 1),
(62, 'Test', 0, NULL, 79, 1, '2024-06-14 04:42:27', '2024-06-14 04:43:18', 1),
(63, 'CL June 2024', 1, NULL, 83, 1, '2024-06-27 23:20:01', '2024-06-27 23:20:08', 1),
(64, 'CF FR', 1, NULL, 80, 1, '2024-06-27 23:22:58', '2024-06-27 23:22:58', 1),
(65, 'CF SR', 1, NULL, 80, 1, '2024-06-27 23:23:12', '2024-06-27 23:23:12', 2),
(66, 'SL_FR', 0, 'Scripting Language', 81, 1, '2024-06-27 23:28:28', '2024-06-27 23:29:37', 1),
(67, 'SL_SR', 0, 'Scripting Language', 81, 1, '2024-06-27 23:29:06', '2024-06-27 23:29:42', 2),
(68, 'DDF_FR', 0, 'DDF', 82, 1, '2024-06-27 23:34:04', '2024-06-27 23:34:04', 1),
(69, 'DDF_SR', 0, 'DDF', 82, 1, '2024-06-27 23:34:25', '2024-06-27 23:34:31', 1);

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Andhra Pradesh', NULL, NULL),
(2, 'Arunachal Pradesh', NULL, NULL),
(3, 'Assam', NULL, NULL),
(4, 'Bihar', NULL, NULL),
(5, 'Chhattisgarh', NULL, NULL),
(6, 'Goa', NULL, NULL),
(7, 'Gujarat', NULL, NULL),
(8, 'Haryana', NULL, NULL),
(9, 'Himachal Pradesh', NULL, NULL),
(10, 'Jharkhand', NULL, NULL),
(11, 'Karnataka', NULL, NULL),
(12, 'Kerala', NULL, NULL),
(13, 'Madhya Pradesh', NULL, NULL),
(14, 'Maharashtra', NULL, NULL),
(15, 'Manipur', NULL, NULL),
(16, 'Meghalaya', NULL, NULL),
(17, 'Mizoram', NULL, NULL),
(18, 'Nagaland', NULL, NULL),
(19, 'Odisha', NULL, NULL),
(20, 'Punjab', NULL, NULL),
(21, 'Rajasthan', NULL, NULL),
(22, 'Sikkim', NULL, NULL),
(23, 'Tamil Nadu', NULL, NULL),
(24, 'Telangana', NULL, NULL),
(25, 'Tripura', NULL, NULL),
(26, 'Uttar Pradesh', NULL, NULL),
(27, 'Uttarakhand', NULL, NULL),
(28, 'West Bengal', NULL, NULL),
(29, 'Andaman and Nicobar Islands', NULL, NULL),
(30, 'Chandigarh', NULL, NULL),
(31, 'Dadra and Nagar Haveli and Daman and Diu', NULL, NULL),
(32, 'Lakshadweep', NULL, NULL),
(33, 'Delhi', NULL, NULL),
(34, 'Puducherry', NULL, NULL),
(35, 'Ladakh', NULL, NULL),
(36, 'Jammu and Kashmir', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sub_categories`
--

INSERT INTO `sub_categories` (`id`, `name`, `category_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Short Term IT Courses', 1, 1, '2024-03-13 17:00:38', '2024-03-15 14:22:56'),
(2, 'vlsi', 1, 0, '2024-03-13 17:00:54', '2024-03-13 17:00:54');

-- --------------------------------------------------------

--
-- Table structure for table `syllabi`
--

CREATE TABLE `syllabi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `day` varchar(255) DEFAULT NULL,
  `batch_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `syllabus` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `tutor_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Not Completed',
  `comments` text DEFAULT NULL,
  `team_id` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabi`
--

INSERT INTO `syllabi` (`id`, `day`, `batch_id`, `course_id`, `syllabus`, `subject`, `tutor_id`, `date`, `status`, `comments`, `team_id`, `created_at`, `updated_at`) VALUES
(1, '1', 1, 4, 'Phisical Design', 'Abc', 1, '2024-05-16', 'Completed', 'Leave', 1, '2024-05-22 05:54:06', '2024-05-24 03:48:43'),
(2, '2', 1, 4, 'Phisical Design', 'Xyz', 1, '2024-05-16', 'Completed', 'j', 1, '2024-05-22 05:54:37', '2024-05-23 23:36:35'),
(3, '3', 1, 4, 'Phisical Design', 'pqr', 1, '2024-05-16', 'Completed', 'jk', 1, '2024-05-22 05:54:48', '2024-05-24 03:48:50'),
(4, '1', 18, 2, 'DRM DRC ', 'Sub Topics DRM DRC', 61, '2024-06-15', 'Partially Done', 'Leave', 1, '2024-06-15 01:40:36', '2024-06-15 01:41:20'),
(5, '2', 18, 2, 'Layout', 'Sub Topics DRM DRC', 61, '2024-06-16', 'Partially Done', NULL, 1, '2024-06-15 01:42:01', '2024-06-15 01:42:01');

-- --------------------------------------------------------

--
-- Table structure for table `teaching_materials`
--

CREATE TABLE `teaching_materials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `material_source` varchar(255) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `unlimited_view` tinyint(1) DEFAULT NULL,
  `maximum_views` int(11) DEFAULT NULL,
  `prerequisite` tinyint(1) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `privacy_allow_access` varchar(255) DEFAULT NULL,
  `privacy_downloadable` tinyint(1) DEFAULT NULL,
  `published` tinyint(1) DEFAULT NULL,
  `sort` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `doc_type` tinyint(5) DEFAULT NULL,
  `maximum_marks` int(11) DEFAULT NULL,
  `passing_percentage` int(11) DEFAULT NULL,
  `result_declaration` varchar(255) DEFAULT NULL,
  `maximum_attempts` int(11) DEFAULT NULL,
  `general_instructions` text DEFAULT NULL,
  `start_submission` datetime DEFAULT NULL,
  `stop_submission` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teaching_materials`
--

INSERT INTO `teaching_materials` (`id`, `section_id`, `name`, `material_source`, `file`, `content`, `unlimited_view`, `maximum_views`, `prerequisite`, `description`, `privacy_allow_access`, `privacy_downloadable`, `published`, `sort`, `created_at`, `updated_at`, `doc_type`, `maximum_marks`, `passing_percentage`, `result_declaration`, `maximum_attempts`, `general_instructions`, `start_submission`, `stop_submission`) VALUES
(41, 45, 'Day 1_SL', 'other', '01HW2QX9660EP90E1MXDW9J9QA.pdf', NULL, 1, 0, 1, 'Day 1_SL', 'app', 0, 0, 2, '2024-04-22 05:38:56', '2024-04-26 01:05:51', 1, 0, 0, '', 0, NULL, NULL, NULL),
(42, 46, 'Day_2 SR', 'other', '01HW2QYKRH1QG9AEKWYPP1HNJX.pdf', NULL, NULL, 54, 1, 'SL', 'app', 0, NULL, 2, '2024-04-22 05:39:40', '2024-05-22 06:32:28', 1, 0, 0, '', 0, NULL, NULL, NULL),
(43, 46, 'Day3', 'other', '01HYCV3AWYC9T8575CM4VR423E.jpg', NULL, 0, 1, 1, 'Its is created for the students to study', NULL, 1, 1, 1, '2024-05-09 04:57:09', '2024-05-22 06:32:28', 1, 0, 0, '1', -1, NULL, NULL, NULL),
(44, 50, '	 DDF - Day 0', 'other', '01HXZYSWBFJ7FCCV23VZMR4SY3.pdf', NULL, 1, NULL, 0, '	\nDDF - Day 0', 'app', 0, 1, 1, '2024-05-16 00:13:05', '2024-05-16 00:13:05', 1, 0, 0, '', 0, NULL, NULL, NULL),
(45, 50, '	 DDF - Day 1', 'other', '01HXZYTWVNVED8AJHWJXWKBJ8H.pdf', NULL, 1, NULL, 0, '	\nDDF - Day 1', 'app', 0, 1, 2, '2024-05-16 00:13:39', '2024-05-16 00:15:07', 1, 0, 0, '', 0, NULL, NULL, NULL),
(46, 50, '	 DDF - Day 2', 'other', '01HXZYW8DREJ67D9GAGPHYE8EQ.pdf', NULL, 1, NULL, 0, '	\nDDF - Day 2', 'app', 0, 1, 3, '2024-05-16 00:14:23', '2024-05-16 00:15:18', 1, 0, 0, '', 0, NULL, NULL, NULL),
(47, 50, '	 DDF - Day 4', 'other', '01HXZZ9BWP6GAXXE5H1GR1YYRE.pdf', NULL, 1, NULL, 0, '	\nDDF - Day 4', 'app', 0, 1, 4, '2024-05-16 00:21:33', '2024-05-16 00:21:33', 1, 0, 0, '', 0, NULL, NULL, NULL),
(48, 51, '	 DDF Material-Day 1', 'other', '01HXZZCQCZXK2PGTAGG3GH88FN.pdf', NULL, 1, NULL, 0, '	\nDDF Material-Day 1', 'app', 0, 1, 1, '2024-05-16 00:23:23', '2024-05-16 00:23:23', 1, 0, 0, '', 0, NULL, NULL, NULL),
(49, 51, '	 DDF Material-Day 2', 'other', '01HXZZDWRBPFJKNRVNS3D78Z35.pdf', NULL, 1, NULL, 0, '	\nDDF Material-Day 2', 'app', 0, 1, 2, '2024-05-16 00:24:01', '2024-05-16 00:24:01', 1, 0, 0, '', 0, NULL, NULL, NULL),
(50, 51, '	 DDF Material-Day 3', 'other', '01HXZZEMBNXMYN2NYYMXP1S178.pdf', NULL, 1, NULL, 0, '	\nDDF Material-Day 3', 'app', 0, 0, 3, '2024-05-16 00:24:25', '2024-05-16 00:24:25', 1, 0, 0, '', 0, NULL, NULL, NULL),
(51, 51, '	 DDF Material-Day 4', 'other', '01HY00GN5P79RQE1ZZ4WCWJ8JH.pdf', NULL, 1, NULL, 0, '	\nDDF Material-Day 4', 'app', 0, 1, 4, '2024-05-16 00:43:00', '2024-05-16 00:43:00', 1, 0, 0, '', 0, NULL, NULL, NULL),
(52, 51, '	 DDF Material-Day 5', 'other', '01HY01GBE37ZAZJWG1N02S5MHF.pdf', NULL, 1, NULL, 0, '	\nDDF Material-Day 5', 'app', 0, 0, 5, '2024-05-16 00:55:42', '2024-05-16 01:00:19', 1, 0, 0, '', 0, NULL, NULL, NULL),
(53, 52, 'RTL', 'other', '01HY01DR1Q33P0BXVFKCRCS1RD.pdf', NULL, 1, NULL, 0, 'RTL', 'app', 0, 1, 1, '2024-05-16 00:58:53', '2024-05-16 00:58:53', 1, 0, 0, '', 0, NULL, NULL, NULL),
(54, 50, '	 DDF - Day 5', 'other', '01HY01FDK21FM3V1Q8PGR0WQ6F.pdf', NULL, 1, NULL, 0, '	 DDF - Day 5', 'app', 0, 1, 5, '2024-05-16 00:59:48', '2024-05-16 00:59:48', 1, 0, 0, '', 0, NULL, NULL, NULL),
(55, 54, 'DAY_2_FR_CF', 'other', '01HY02H5AWNA845WGEDMJ5TF05.pdf', NULL, 1, NULL, 0, 'DAY_2_FR_CF', 'app', 0, 1, 1, '2024-05-16 01:18:14', '2024-05-16 01:18:14', 1, 0, 0, '', 0, NULL, NULL, NULL),
(56, 54, 'DAY_FR_CF_3', 'other', '01HY02JDE2ZSBB5SWMXJH247QN.pdf', NULL, 1, NULL, 0, 'DAY_FR_CF_3', 'app', 0, 1, 2, '2024-05-16 01:18:55', '2024-05-16 01:18:55', 1, 0, 0, '', 0, NULL, NULL, NULL),
(57, 54, 'DAY_FR_CF_4', 'other', '01HY02K9ADK3Z8PQ6675DDGVZ6.pdf', NULL, 1, NULL, 0, 'DAY_FR_CF_4', 'app', 0, 1, 3, '2024-05-16 01:19:24', '2024-05-16 01:19:24', 1, 0, 0, '', 0, NULL, NULL, NULL),
(58, 54, 'DAY_FR_CF_5', 'other', '01HY02MAXPHC0BQ1S60AJDGZ2B.pdf', NULL, 1, NULL, 0, 'DAY_FR_CF_4', 'app', 0, 1, 4, '2024-05-16 01:19:58', '2024-05-16 01:20:21', 1, 0, 0, '', 0, NULL, NULL, NULL),
(59, 53, 'CF Day 1', 'other', '01HY02PC88BV0GZC211H729MFS.pdf', NULL, 1, NULL, 0, 'CF Day 1', 'app', 0, 1, 1, '2024-05-16 01:21:05', '2024-05-16 01:21:05', 1, 0, 0, '', 0, NULL, NULL, NULL),
(60, 53, 'CF Day 2', 'other', '01HY02QCJC8WZWZMDTKKNWF7NW.pdf', NULL, 1, NULL, 0, 'CF Day 1', 'app', 0, 1, 2, '2024-05-16 01:21:38', '2024-05-16 01:21:38', 1, 0, 0, '', 0, NULL, NULL, NULL),
(61, 53, 'CF Day 3', 'other', '01HY02RXZV82N6XE2AMPZC0GS0.pdf', NULL, 1, NULL, 0, 'CF Day 3', 'app', 0, 0, 3, '2024-05-16 01:22:29', '2024-05-16 01:22:29', 1, 0, 0, '', 0, NULL, NULL, NULL),
(62, 53, 'CF Day 4', 'other', '01HY02TE6MHJPCG62SMANDBHQN.pdf', NULL, 1, NULL, 0, 'CF Day 4', 'app', 0, 1, 4, '2024-05-16 01:23:18', '2024-05-16 01:23:18', 1, 0, 0, '', 0, NULL, NULL, NULL),
(63, 55, 'CF_Week_1_SR_1_Mosfet', 'other', '01HY037PZK670SSK7E7FRXE5QD.pdf', NULL, 1, NULL, 0, 'CF_Week_1_SR_1_Mosfet', 'app', 0, 1, 1, '2024-05-16 01:30:33', '2024-05-16 01:30:33', 1, 0, 0, '', 0, NULL, NULL, NULL),
(64, 55, 'CF_Week_1_SR_Mosfet_2', 'other', '01HY038SJ5KF3VGX61ENKH5BYX.pdf', NULL, 1, NULL, 0, 'CF_Week_1_SR_Mosfet_2', 'app', 0, 1, 2, '2024-05-16 01:31:08', '2024-05-16 01:31:08', 1, 0, 0, '', 0, NULL, NULL, NULL),
(65, 55, 'CF_Week_1_SR_Mosfet_3', 'other', '01HY03A7N065365KP0JJYWQJ76.pdf', NULL, 1, NULL, 0, 'CF_Week_1_SR_Mosfet_3', 'app', 0, 1, 3, '2024-05-16 01:31:56', '2024-05-16 01:31:56', 1, 0, 0, '', 0, NULL, NULL, NULL),
(66, 56, 'Mosfet', 'other', '01HY03BD7F4SHEJYHFRWDEAZ76.pdf', NULL, 1, NULL, 0, 'Mosfet', 'app', 0, 1, 1, '2024-05-16 01:32:34', '2024-05-16 01:32:34', 1, 0, 0, '', 0, NULL, NULL, NULL),
(67, 46, 'Test assignment', NULL, NULL, NULL, NULL, NULL, 0, 'fd', NULL, 0, NULL, 4, '2024-05-20 23:13:47', '2024-05-22 06:32:28', 2, 5, 20, '1', -1, NULL, NULL, NULL),
(68, 46, 'assignement 2024', NULL, '01J0DCFS7ZX4793YKNWBA6WH0G.pdf', NULL, NULL, NULL, 1, 'ds', NULL, 0, NULL, 6, '2024-05-21 00:16:56', '2024-06-15 01:53:46', 2, 15, 100, '1', 1, NULL, '2024-06-15 00:00:00', '2024-06-22 00:00:00'),
(69, 46, 'day required..', 'other', '01HYCVXM93CNH9B155P83X2QWZ.jpg', NULL, 1, NULL, 1, 'ff', NULL, 0, 1, 3, '2024-05-21 00:32:50', '2024-05-22 06:32:28', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(70, 46, 'Youtube Link', 'url', NULL, 'https://www.youtube.com/embed/EngW7tLk6R8?si=AQmD6vytk856IesU', 1, NULL, 0, 'This is youtube link', 'app', 0, 0, 5, '2024-05-22 06:31:33', '2024-05-22 06:34:54', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(71, 57, 'Day 1', 'other', '01HYJ39DB763QM0ZHY6GVQSC3V.pdf', NULL, 1, NULL, 1, 'Day 1 Test', NULL, 0, 0, 1, '2024-05-23 01:17:48', '2024-05-23 01:17:48', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(72, 57, 'Day 2', 'other', '01HYJ3F0A2R573YZKA7FJ3FCF2.pdf', NULL, 1, NULL, 1, 'Day 2', NULL, 0, 0, 2, '2024-05-23 01:20:52', '2024-05-23 01:20:52', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(73, 59, 'Testing 1', 'url', NULL, 'https://www.youtube.com/watch?v=sCSTCihe68w&t=3s', 1, NULL, 0, 'Youtube ', NULL, 0, 0, 1, '2024-05-25 01:49:20', '2024-05-25 01:49:20', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(74, 59, '1', 'content', NULL, '<iframe src=\"https://docs.google.com/forms/d/e/1FAIpQLSe6wfDSPL9oTC6XRdH0HR9SCqYuJfhy-Y8I6oGWVZwPTktBvg/viewform?embedded=true\" width=\"640\" height=\"1275\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading…</iframe>', 1, NULL, 0, '1', NULL, 0, 0, 1, '2024-05-25 02:00:29', '2024-05-25 02:00:29', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(75, 46, 'DDF - Day 0', NULL, NULL, NULL, NULL, NULL, 0, 'testing', 'app', 0, NULL, 5, '2024-06-04 08:02:46', '2024-06-04 08:02:46', 2, 100, 33, '1', 1, NULL, '2024-06-04 13:31:13', '2024-06-04 13:31:13'),
(76, 47, 'Day 1 Test_CF', 'other', '01J0AR82X1GZCWWGXPV0QZQW8D.pdf', NULL, 1, NULL, 1, 'Day 1', 'app', 0, 0, 1, '2024-06-14 01:21:33', '2024-06-14 01:21:33', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(77, 47, 'Day 2_Test ', 'other', '01J0AR9KNF3MVY2WC19C9TPQ88.pdf', NULL, 1, NULL, 1, 'Day 2', 'app', 1, 0, 2, '2024-06-14 01:22:23', '2024-06-14 01:22:23', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(78, 61, 'Day 1', 'other', '01J0B15KVPJSC0W09K3229M5QQ.pdf', NULL, 1, NULL, 1, 'w', 'app', 1, 1, 1, '2024-06-14 03:57:29', '2024-06-14 03:57:29', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(79, 62, 'dfd', 'other', NULL, NULL, 0, 1, 0, 'dsds', NULL, 0, 0, 1, '2024-06-14 04:43:41', '2024-06-14 04:43:41', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(80, 46, 'Assignment test 1', NULL, NULL, NULL, NULL, NULL, 0, '1', 'app', 1, NULL, 1, '2024-06-15 01:52:53', '2024-06-15 01:52:53', 2, 25, 50, '1', -1, NULL, '2024-06-15 07:21:52', '2024-06-15 07:21:52'),
(81, 46, 'Test 15006', 'other', '01J0DE3WNJ193S2J9TK80ZSDHK.jpg', NULL, 1, NULL, 0, 'Test', NULL, 0, 0, 1, '2024-06-15 02:22:13', '2024-06-15 02:22:13', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(82, 46, 'Samsung', NULL, NULL, NULL, NULL, NULL, 0, 'see all answers are visible', NULL, 1, NULL, 4, '2024-06-27 04:06:45', '2024-06-27 04:06:45', 2, 7, 6, '1', 3, NULL, '2024-06-27 09:34:56', '2024-06-28 09:34:56'),
(83, 63, 'Week 1', NULL, '01J1EJZP3F42WC8ZB435PNJQC8.pdf', NULL, NULL, NULL, 1, 'Week 1', 'app', 0, NULL, 1, '2024-06-27 23:22:15', '2024-06-27 23:22:15', 2, 50, 50, '1', -1, NULL, '2024-06-28 10:00:29', '2024-06-29 04:50:29'),
(84, 64, 'Day 1_CF_FR', 'other', '01J1EK46TTYXHN746WXY07EGMN.pdf', NULL, 1, NULL, 0, 'Mosfet', NULL, 0, 1, 0, '2024-06-27 23:24:43', '2024-06-27 23:24:43', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(85, 64, 'Day 2_CF_FR', 'other', '01J1EK5K00ZKZB3KVQ667TDK5K.pdf', NULL, 1, NULL, 0, 'Mosfet', NULL, 0, 0, 2, '2024-06-27 23:25:28', '2024-06-27 23:25:28', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(86, 65, 'Week_1_CF_SR', 'other', '01J1EK87NWP98ABS8EBR5KBY2C.pdf', NULL, 1, NULL, 1, 'Week 1', 'app', 0, 1, 1, '2024-06-27 23:26:55', '2024-06-27 23:27:06', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(87, 65, 'Week 2_CF_SR', 'other', '01J1EK9HGV1F4Y9EQNMCPCV6EA.pdf', NULL, 1, NULL, 1, 'Week 2', 'app', 1, 0, 2, '2024-06-27 23:27:38', '2024-06-27 23:27:46', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(88, 66, 'Day 1_SL_FR', 'other', '01J1EKFBMBS4XRK8A42R3ZSHSS.pdf', NULL, 1, NULL, 0, 'Scripting Language', NULL, 0, 0, 1, '2024-06-27 23:30:48', '2024-06-27 23:30:48', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(89, 66, 'Day_2_SL_FR', 'other', '01J1EKH0Q8EP63D7P21ARE71E6.pdf', NULL, 1, NULL, 0, 'Scripting Language', NULL, 0, 1, 2, '2024-06-27 23:31:43', '2024-06-27 23:31:43', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(90, 67, 'Day_1_SL_SR', 'other', '01J1EKJZVCTA45QEW7BFRBPVP8.pdf', NULL, 1, NULL, 1, 'SL', 'app', 0, 1, 1, '2024-06-27 23:32:47', '2024-06-27 23:32:47', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(91, 67, 'Day 2_SL_SR', 'other', '01J1EKMKR45JMZX1C5T7EDB307.pdf', NULL, 1, NULL, 1, 'SL', 'app', 1, 1, 2, '2024-06-27 23:33:40', '2024-06-27 23:33:40', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(92, 68, 'Day2_DDF_FR', 'other', '01J1EKTHDRJF0X1R4HKD35DPF8.pdf', NULL, 1, NULL, 0, 'DDF', NULL, 0, 1, 1, '2024-06-27 23:36:55', '2024-06-27 23:39:14', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(93, 68, 'Day_3_DDF_FR', 'other', '01J1EKXXFSRSKKPB6XZZ6N2NK9.pdf', NULL, 1, NULL, 0, 'DDF', NULL, 0, 1, 2, '2024-06-27 23:38:49', '2024-06-27 23:39:14', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(94, 69, 'Day_2_DDF_SR', 'other', '01J1EM09327W03YHHRM2DKYSTB.pdf', NULL, 1, NULL, 1, 'DDF', 'app', 0, 1, -1, '2024-06-27 23:40:03', '2024-06-27 23:40:53', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(95, 69, 'Day 3_DDF_SR', 'other', '01J1EM1GX1JN39X0655NJ2AQXZ.pdf', NULL, 1, NULL, 1, 'DDF', 'app', 0, 1, 1, '2024-06-27 23:40:43', '2024-06-27 23:40:43', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teaching_material_statuses`
--

CREATE TABLE `teaching_material_statuses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `teaching_material_id` bigint(20) NOT NULL,
  `batch_id` bigint(20) NOT NULL,
  `file` varchar(255) DEFAULT NULL,
  `obtained_marks` double(13,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teaching_material_statuses`
--

INSERT INTO `teaching_material_statuses` (`id`, `user_id`, `teaching_material_id`, `batch_id`, `file`, `obtained_marks`, `created_at`, `updated_at`) VALUES
(1, 11, 41, 1, NULL, 0.00, '2024-05-15 03:27:50', '2024-05-15 03:27:50'),
(2, 11, 42, 1, NULL, 0.00, '2024-05-21 00:28:29', '2024-05-21 00:28:29'),
(3, 11, 43, 1, NULL, 0.00, '2024-05-21 00:36:13', '2024-05-21 00:36:13'),
(4, 11, 68, 1, NULL, 0.00, '2024-05-21 00:38:28', '2024-05-21 00:38:28'),
(5, 11, 69, 1, NULL, 0.00, '2024-05-21 00:38:52', '2024-05-21 00:38:52'),
(6, 11, 70, 1, NULL, 0.00, '2024-05-23 23:48:12', '2024-05-23 23:48:12'),
(7, 11, 67, 1, NULL, 0.00, '2024-05-23 23:50:09', '2024-05-23 23:50:09'),
(8, 11, 67, 1, NULL, 0.00, '2024-05-23 23:50:11', '2024-05-23 23:50:11'),
(9, 11, 67, 1, NULL, 0.00, '2024-05-23 23:50:12', '2024-05-23 23:50:12'),
(10, 11, 48, 6, NULL, 0.00, '2024-06-03 06:56:32', '2024-06-03 06:56:32'),
(11, 11, 49, 6, NULL, 0.00, '2024-06-03 06:56:34', '2024-06-03 06:56:34'),
(12, 11, 50, 6, NULL, 0.00, '2024-06-03 06:56:36', '2024-06-03 06:56:36'),
(13, 11, 51, 6, NULL, 0.00, '2024-06-03 06:56:38', '2024-06-03 06:56:38'),
(14, 11, 52, 6, NULL, 0.00, '2024-06-03 06:56:40', '2024-06-03 06:56:40'),
(15, 11, 53, 6, NULL, 0.00, '2024-06-03 06:56:42', '2024-06-03 06:56:42'),
(16, 60, 43, 1, NULL, 0.00, '2024-06-07 00:55:22', '2024-06-07 00:55:22'),
(17, 60, 42, 1, NULL, 0.00, '2024-06-07 00:55:46', '2024-06-07 00:55:46'),
(18, 60, 69, 1, NULL, 0.00, '2024-06-07 00:56:09', '2024-06-07 00:56:09'),
(19, 60, 67, 1, NULL, 0.00, '2024-06-07 00:56:40', '2024-06-07 00:56:40'),
(20, 60, 70, 1, NULL, 0.00, '2024-06-07 00:57:19', '2024-06-07 00:57:19'),
(21, 60, 75, 1, NULL, 0.00, '2024-06-07 00:57:23', '2024-06-07 00:57:23');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `pincode` int(11) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `online_branch` tinyint(1) NOT NULL,
  `allow_registration` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `slug`, `contact_number`, `address`, `country_id`, `city_id`, `state_id`, `pincode`, `website`, `online_branch`, `allow_registration`, `created_at`, `updated_at`) VALUES
(1, 'Sumedha Institute of Technology-Hyderabad', 'sumedha-institute-of-technology-hyderabad', '864353576', 'Delhi', NULL, NULL, NULL, 500085, 'www.sumedhait.com', 0, 1, NULL, '2024-05-25 01:27:05'),
(2, 'Sumedha Institute of Technology - Bengaluru', 'sumedha-institute-of-technology-bengaluru', '', '', NULL, NULL, NULL, 0, '', 0, 0, NULL, NULL),
(3, 'SymbioTech', 'symbioTech', '', '', NULL, NULL, NULL, 0, '', 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `team_user`
--

CREATE TABLE `team_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `team_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `team_user`
--

INSERT INTO `team_user` (`id`, `team_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(2, 2, 1, NULL, NULL),
(3, 3, 1, NULL, NULL),
(4, 1, 8, NULL, NULL),
(5, 1, 9, NULL, NULL),
(6, 1, 10, NULL, NULL),
(7, 1, 11, NULL, NULL),
(8, 1, 12, NULL, NULL),
(9, 1, 12, NULL, NULL),
(10, 1, 13, NULL, NULL),
(11, 1, 13, NULL, NULL),
(12, 1, 14, NULL, NULL),
(13, 1, 14, NULL, NULL),
(14, 1, 15, NULL, NULL),
(15, 1, 15, NULL, NULL),
(16, 1, 16, NULL, NULL),
(17, 1, 16, NULL, NULL),
(18, 1, 17, NULL, NULL),
(19, 1, 17, NULL, NULL),
(20, 1, 18, NULL, NULL),
(21, 1, 18, NULL, NULL),
(22, 1, 19, NULL, NULL),
(23, 1, 19, NULL, NULL),
(24, 1, 20, NULL, NULL),
(25, 1, 20, NULL, NULL),
(26, 1, 21, NULL, NULL),
(27, 1, 21, NULL, NULL),
(28, 1, 22, NULL, NULL),
(29, 1, 22, NULL, NULL),
(30, 1, 23, NULL, NULL),
(31, 1, 23, NULL, NULL),
(32, 1, 24, NULL, NULL),
(33, 1, 24, NULL, NULL),
(34, 1, 25, NULL, NULL),
(35, 1, 25, NULL, NULL),
(36, 1, 26, NULL, NULL),
(37, 1, 26, NULL, NULL),
(38, 1, 27, NULL, NULL),
(39, 1, 27, NULL, NULL),
(40, 1, 28, NULL, NULL),
(41, 1, 28, NULL, NULL),
(42, 1, 29, NULL, NULL),
(43, 1, 29, NULL, NULL),
(44, 1, 30, NULL, NULL),
(45, 1, 30, NULL, NULL),
(46, 1, 31, NULL, NULL),
(47, 1, 31, NULL, NULL),
(48, 1, 32, NULL, NULL),
(49, 1, 32, NULL, NULL),
(50, 1, 33, NULL, NULL),
(51, 1, 33, NULL, NULL),
(52, 1, 34, NULL, NULL),
(53, 1, 34, NULL, NULL),
(54, 1, 35, NULL, NULL),
(55, 1, 35, NULL, NULL),
(56, 1, 36, NULL, NULL),
(57, 1, 36, NULL, NULL),
(58, 1, 37, NULL, NULL),
(59, 1, 37, NULL, NULL),
(60, 1, 38, NULL, NULL),
(61, 1, 38, NULL, NULL),
(62, 1, 3, NULL, NULL),
(63, 1, 39, NULL, NULL),
(64, 1, 39, NULL, NULL),
(65, 1, 40, NULL, NULL),
(66, 1, 40, NULL, NULL),
(67, 1, 4, NULL, NULL),
(68, 1, 41, NULL, NULL),
(69, 1, 42, NULL, NULL),
(70, 1, 43, NULL, NULL),
(71, 1, 44, NULL, NULL),
(72, 1, 45, NULL, NULL),
(73, 1, 46, NULL, NULL),
(74, 1, 47, NULL, NULL),
(75, 1, 48, NULL, NULL),
(76, 1, 49, NULL, NULL),
(77, 1, 50, NULL, NULL),
(78, 1, 5, NULL, NULL),
(79, 1, 6, NULL, NULL),
(80, 1, 56, NULL, NULL),
(81, 1, 56, NULL, NULL),
(82, 1, 57, NULL, NULL),
(83, 1, 57, NULL, NULL),
(84, 1, 7, NULL, NULL),
(85, 1, 8, NULL, NULL),
(86, 1, 9, NULL, NULL),
(87, 1, 10, NULL, NULL),
(88, 1, 11, NULL, NULL),
(89, 1, 12, NULL, NULL),
(90, 1, 13, NULL, NULL),
(91, 1, 14, NULL, NULL),
(92, 1, 15, NULL, NULL),
(93, 1, 59, NULL, NULL),
(94, 1, 59, NULL, NULL),
(95, 1, 16, NULL, NULL),
(96, 1, 17, NULL, NULL),
(97, 1, 60, NULL, NULL),
(98, 1, 61, NULL, NULL),
(99, 1, 18, NULL, NULL),
(100, 1, 19, NULL, NULL),
(101, 1, 20, NULL, NULL),
(102, 1, 21, NULL, NULL),
(103, 1, 22, NULL, NULL),
(104, 1, 23, NULL, NULL),
(105, 1, 24, NULL, NULL),
(106, 1, 25, NULL, NULL),
(107, 1, 26, NULL, NULL),
(108, 1, 62, NULL, NULL),
(109, 1, 63, NULL, NULL),
(110, 1, 64, NULL, NULL),
(111, 1, 65, NULL, NULL),
(112, 1, 66, NULL, NULL),
(113, 1, 67, NULL, NULL),
(114, 1, 27, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `country_code` varchar(10) DEFAULT '+91',
  `phone` varchar(255) DEFAULT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `registration_number` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `qualification_id` int(11) DEFAULT NULL,
  `qualification` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`qualification`)),
  `year_of_passed_out` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `school` varchar(255) DEFAULT NULL,
  `aadhaar_number` varchar(255) DEFAULT NULL,
  `linkedin_profile` varchar(255) DEFAULT NULL,
  `upload_resume` varchar(255) DEFAULT NULL,
  `upload_aadhar` varchar(255) DEFAULT NULL,
  `upload_picture` varchar(255) DEFAULT NULL,
  `upload_marklist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `upload_agreement` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `parent_name` varchar(255) DEFAULT NULL,
  `parent_contact` varchar(255) DEFAULT NULL,
  `parent_email` varchar(255) DEFAULT NULL,
  `parent_aadhar` varchar(255) DEFAULT NULL,
  `parent_occupation` varchar(255) DEFAULT NULL,
  `residential_address` text DEFAULT NULL,
  `designation_id` int(11) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `domain_id` int(11) DEFAULT NULL,
  `subject` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `receive_email_notification` tinyint(1) DEFAULT 0,
  `receive_sms_notification` tinyint(1) DEFAULT 0,
  `avatar_url` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `session_id`, `password`, `country_code`, `phone`, `role_id`, `remember_token`, `created_at`, `updated_at`, `registration_number`, `birthday`, `contact_number`, `gender`, `qualification_id`, `qualification`, `year_of_passed_out`, `address`, `city_id`, `city`, `state_id`, `pincode`, `school`, `aadhaar_number`, `linkedin_profile`, `upload_resume`, `upload_aadhar`, `upload_picture`, `upload_marklist`, `upload_agreement`, `parent_name`, `parent_contact`, `parent_email`, `parent_aadhar`, `parent_occupation`, `residential_address`, `designation_id`, `experience`, `domain_id`, `subject`, `is_active`, `receive_email_notification`, `receive_sms_notification`, `avatar_url`, `deleted_at`) VALUES
(1, 'Admin', 'admin@mylearning.live', NULL, 'oeMSzEcdJW3q6IjB', '$2y$12$Zwf52xcnZ1u68EEATgNmvubCMOZ3jkFGcY0Wru9Q2rX9AuMdkFGxG', '+91', '7984966990', 1, 'dIzhsOWlMBTdIpZvoNWLpt5CCroCDfDPWKZqh8zAXKf9KpKuu7dwqABP8PRo', '2024-02-21 18:44:06', '2024-07-04 05:38:02', NULL, NULL, NULL, NULL, NULL, '[{\"qualification\":\"MBA\",\"year\":\"2022\",\"institute_name\":\"Rk College\",\"qualification_id\":\"1\",\"percentage\":\"100\"}]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '987654321012', NULL, '01J08JSVC1HJCHGY0JZM9N0JZY.jpg', '01J08JSVC5VJH8C4PJFJC7Z961.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '01HWCGPM4PBD6SSNXVS3PW4D58.png', NULL),
(3, 'tutor', 'tutor@mylearning.live', NULL, 'y9xmQ66dy2u2qTg5', '$2y$12$QIjIjXpakwXdli0MPSpvZ.9AoLwPnN4XXBjSRDOu1Otn8guFPbkcu', '+91', '9876543210', 7, NULL, '2024-02-24 15:26:20', '2024-06-27 04:01:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(4, 'Nishant', 'nishant@theargusconsulting.com', NULL, '', '$2y$12$KJDo6iw7Bkv0tblKBpwnEeNPNHsHtv4f4ezY.ino/9jiskrQDjv7u', '+91', '7984966990', 1, NULL, '2024-02-27 14:42:34', '2024-02-27 14:42:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(5, 'nishant', 'n1sh4nt.d3v+9@gmail.com', NULL, '', '$2y$12$t8hmH4vON5AgFfrkjqSFeen4OjS5zbU.qIi0Dhe9BUODo/ad9Why6', '+91', '9876543210', 1, NULL, '2024-02-27 21:14:50', '2024-02-29 15:49:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(6, 'Nishant', 'n1sh4nt.d3v+1@gmail.com', NULL, '', '$2y$12$KoohI2bTZDPFcUPDEiQsrOFpfQVrN51SMqp1X.SoGaycuSBsQGIT.', '+91', '1234567892', 6, NULL, '2024-02-29 13:15:24', '2024-06-26 23:19:27', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '01J0DF1BMY48FXCST6VHRANVW4.webp', '2024-06-26 23:19:27'),
(7, 'Riahan Bark', 'n1sh4nt.d3v+3@gmail.com', NULL, '', '$2y$12$jSdAOpqz9Fdg6/VaGnHNme3Gej5nzAXZEZkNWkgZReM0inX19tBYS', '+91', '789456123', 6, NULL, '2024-02-29 15:50:23', '2024-03-15 13:37:27', '1324', NULL, NULL, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(8, 'Pooja Yadav', 'satviks@theargusconsulting.com', NULL, '', '$2y$12$qLN3s7MaLgwKEVxmq.E01et5cogrVxUH87NeYmOnT2qOjC7kF9JaW', '+91', '9876543210', 1, NULL, '2024-03-13 17:14:50', '2024-05-03 00:20:49', 'admin1', NULL, NULL, 'Female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, '2024-05-03 00:20:49'),
(10, 'NIshant Tutor', 'nishant+tutor@theargusconsulting.com', NULL, '', '$2y$12$eH77jzk0iSrz1ZWLn0pjTu5B8ejQwZ0XF6jjyOSxuIM0uaPDQO5XC', '+91', '9876543210', 7, NULL, '2024-03-28 13:57:15', '2024-03-28 13:57:15', NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(11, 'Student Profile', 'student@mylearning.live', NULL, 'u3ulkda0ADNWuBrV', '$2y$12$xFMZcvcrxDy2jWpw.LaaeugR2Vf2funqHazbMgcNj79FtP7Hqsg2S', '+91', '1545', 6, 'K1uQ6FDJLCuhw2pympE3KhR4qP7V59ULvIvZWVtlZf2o4YQWRT4HKzv9VVfv', '2024-04-01 12:12:46', '2024-07-04 05:37:19', '123', '1990-12-12', NULL, 'Male', 1, '[{\"year\":\"2010\",\"institute_name\":\"Ipu\",\"percentage\":\"65\",\"qualification_name\":\"Diploma\",\"qualification_id\":\"4\"},{\"year\":\"2013\",\"institute_name\":\"RK \",\"percentage\":\"90\",\"qualification_name\":\"Master of Science\",\"qualification_id\":\"1\"}]', '2015', 'Model', 1, 'New delhi', 1, '387755', 'Abc', '321654987123', NULL, '1IS6JzIiKDne7wVRCLi00Tkr9Vj0SFsBlvdpykCv.pdf', '5RC3d3zcirXofhl4wsJOtksetZSz4Sx1n5DqXOlM.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 'aR4GXkOL5yHkg1V7XfrThH8e87oofScx5qXulFSz.jpg', NULL),
(39, 'Nishant', 'n1sh4nt.d3v+1904@gmail.com', NULL, 'luUfHz7Jey8jNCoL', '$2y$12$BF9UDT7qRnKgJS9.sG/ZDOttZRQ7FuoT3W6iABKpQz..oE9KjDGhy', '+91', '7984966990', 6, NULL, '2024-04-18 23:40:03', '2024-06-14 03:51:47', '123', NULL, NULL, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '01J0B0V5WP5ZZK6WW23NKQCVG5.jpg', NULL),
(40, 'test', 'test@test.com', NULL, '', '$2y$12$SYAqNcxt4cMmhEnSzyA3Vud2nJyUVLuzAujJ3.NU.kav3fM02iR6e', '+91', '5789456130', 6, NULL, '2024-04-22 01:03:09', '2024-05-13 01:14:11', '46240772', '2001-11-01', NULL, 'Male', NULL, NULL, '2001', 'ffffew324423', 1, NULL, 2, '110051', 'gurmeetgewrger3423', 'fwefewgwvdsvs', NULL, '01HW28E87VRK3FPT8R6W8DHSAN.pdf', '01HW28E87XY2TBTSH49PFP45AY.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 0, NULL, NULL),
(46, 'Test 1', 'test1@student.sumedhait.com', NULL, '', '$2y$12$Jsop1Gkq.nKY3CYIIxXfPenzVJ4hBkJ6Oe3mgTakLIBsi6yXeZ3qy', '+91', '9347524011', 0, NULL, '2024-04-26 01:45:01', '2024-05-22 23:55:52', 'SUMHYDPD01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(47, 'Test 2', 'test2@student.sumedhait.com', NULL, '', '$2y$12$Iy.Dh7SZEcqCq3hSl0uD9.gQjvHzHy36/IZSPgSD22TTp2UT.wDda', '+91', '9100098487', 0, NULL, '2024-04-26 01:45:02', '2024-04-26 01:45:02', 'SUMHYDPD02', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(48, 'Test 3', 'test3@student.sumedhait.com', NULL, '', '$2y$12$XOXpsuKzNv4mUQ3I.NREreC7I0xRUIB25bYtZSlbGbF4yTB3j6D6i', '+91', '9515933955', 0, NULL, '2024-04-26 01:45:02', '2024-06-25 03:05:28', 'SUMHYDPD03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 0, 0, NULL, '2024-06-25 03:05:28'),
(49, 'Test 4', 'test4@student.sumedhait.com', NULL, '', '$2y$12$wV.orXpUHdOBQict5MaSfuvzzrh3hg.SJsBSHzbvr/iHqEwbql3t6', '+91', '8790905787', 0, NULL, '2024-04-26 01:45:02', '2024-04-26 01:45:02', 'SUMHYDPD04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(50, 'Test 5', 'test5@student.sumedhait.com', NULL, '', '$2y$12$Rz6GjpVWfITy7FcTK1IfCuOkYjCk6aEuhIqJ9RWs7Tiq9riK./ium', '+91', '8790305787', 0, NULL, '2024-04-26 01:45:03', '2024-04-26 01:45:03', 'SUMHYDPD05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(56, 'tester', 'tester@tester.com', NULL, 'MC6Fb4YQrT0OjzzM', '$2y$12$FUBY89O.DNtUhMaDNZgK3.2B2tfWp3CvoH1GygGXa2UV6LiZ9Se2O', '+91', '1234567890', 6, NULL, '2024-05-13 00:20:07', '2024-06-16 12:52:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(57, 'Demo', 'demo@gmail.com', NULL, 'DSsRgaU05keweC6d', '$2y$12$/w0EPIsef8dYCFQnBsHrlu6l9ZMCcp/DWGZS5F8m8RTkYQqTMU/bq', '+91', '7574744758', 6, NULL, '2024-05-15 03:41:30', '2024-07-04 05:36:14', '123', '2024-05-01', NULL, 'Male', 1, NULL, '2018', 'adarsh nagar', 2, NULL, 1, '110033', 'sssjis', '638372826262', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, NULL, NULL),
(59, 'Vamsi Test', 'vamsikumar7995@gmail.com', NULL, 'uK0GeoXtXYtHjYCo', '$2y$12$/Q7fg1igQ5u/x0vTizfPaezfFhwWVU0RqSvIVC6Ls8ehJe1hRqwlS', '+91', '9100098487', 6, NULL, '2024-05-23 00:06:09', '2024-05-25 01:30:55', 'sumtest1', '1995-09-07', NULL, 'Male', 1, NULL, '2017', '1-48/1, Kotha Naguluru, Krishna DT ', NULL, NULL, NULL, '521230', 'Gemini English Medium School', '1000 5000 6000 9000', 'https://in.linkedin.com/in/vamsi-kumar-addagiri-9721341a3', '01HYMJWV4NSM70YX4P0ZPM8RG0.pdf', '01HYMJWV4RGG6Q8GGFX9AR2BG2.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '01HYMK5N4M3377WHWE4S3CH7PN.webp', NULL),
(60, 'Manju Bhargavi', 'test7@student.sumedhait.com', NULL, '9vZ7dQjgDqj7Wips', '$2y$12$tW.YmYx5kJoQWl98zQZeXOgixls9QCQ0pH5cX2tZHD858d1.Oc8d.', '+91', '9398229787', 6, '9Po94k1tj6acMfNUhXyjekt86Y3sdFkBDFnJdLljtunX5jHMPYtEJ5npuJSR', '2024-06-07 00:41:37', '2024-06-29 01:18:28', 'Manju123', '2001-08-20', NULL, 'Female', NULL, '[{\"qualification_id\":\"2\",\"year\":\"2024\",\"institute_name\":\"VJIET\",\"percentage\":\"80\"}]', NULL, 'Atapaka, Kaikaluru', NULL, 'Eluru', 1, '521333', 'Sri Chaitanya Techno School', '471033439834', 'https://www.linkedin.com/in/velpuri-manjubhargavi-309768254/', '01HZRTCRFHS9X43C2Z0X1G8XPD.pptx', '01HZRTCRHBJGKB0ZH0P9YXPZ02.pptx', NULL, NULL, NULL, 'Lakshman Rao', NULL, 'vlrao@gmail.com', NULL, 'Farmer', 'Atapaka, Kaikaluru', NULL, NULL, 1, NULL, 1, 0, 0, '01J1EJN4RW6WDXZ136XRGS4TFF.png', NULL),
(61, 'Test Tutor', 'test6@student.sumedhait.com', NULL, 'z3h1I7uYNUYLhh3V', '$2y$12$Y7E3xQ9jnEfjgFwaPFuyIOsOTe8kiu7LUhvkmsJ3GQCJ0D.yJKbVW', '+91', '9100098487', 7, NULL, '2024-06-07 01:33:19', '2024-06-28 06:51:05', NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(62, 'testing1234', 'test1@test.com', NULL, 'KyAQJfpQhW2OOGOF', '$2y$12$dm8QsNGkbCRtHZD.9Uvsd.7Ek7./piJr2JxJhomX.1adgQBJtyOs6', '+91', '7894512301', 6, NULL, '2024-06-16 12:54:53', '2024-06-16 12:55:58', '46240772', NULL, NULL, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(63, 'testadmin', 'testadmin@testadmin.com', NULL, 'iPu8ZFsQTCTHwob1', '$2y$12$1ISvsq6yPat6kacaIqcUSelvPxxWVJMwlI0N8F824rTJ1ik.7PX.u', '+91', '7894561237', 1, NULL, '2024-06-19 02:12:58', '2024-07-02 23:59:38', NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(64, 'sanchit', 'sanchit@theargusconsulting.com', NULL, 'cMDMeWv8LXYaTgBc', '$2y$12$75KNQNjmBU9sbY0JcvBmEeXG1bj0Ld.aAIGwtUU5mQTwhM18et2be', '+91', '798651320', 6, NULL, '2024-06-19 02:14:51', '2024-07-03 00:03:51', '978456213', '2024-06-14', NULL, 'Male', NULL, '[{\"year\":\"2023\",\"institute_name\":\"Ip\",\"percentage\":\"89\",\"qualification_name\":\"Master of Science\",\"qualification_id\":\"1\"}]', NULL, 'Vvg', NULL, 'Fgh', 2, '369852', NULL, '963258741236', NULL, 'awSKi40kklJ7wi6GM95dEOrSh30mc8i0q2u8iM2u.pdf', 'XPdmgD8QEEdUchVfz0qnVCwN6m8lh5FZiv8dWtHL.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 'xPJ80np2YX4TKdTPLmPRS8FfR18lPjuQYcx8F1WV.jpg', NULL),
(65, 'Kodanda Rama Rao', 'ramnelkod@sumedhait.com', NULL, NULL, '$2y$12$gt1cQTBWg9rhYLMP53zsEuZY6JsIlaiaimxC/JazmEkOfszRaBIva', '+91', '8790949859', 7, NULL, '2024-06-27 04:52:49', '2024-06-27 04:52:49', NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '01J1CKG874B293QWB35TQG7W9R.png', NULL),
(66, 'Charles Daniel Rajendra', 'charles.daniel@sumedhait.com', NULL, NULL, '$2y$12$c0z8zMufJWN6hoymrY8V3epW4SN3oEYcozrJisMXnCIPqOOFthCdC', '+91', '9985981503', 7, NULL, '2024-06-27 04:59:49', '2024-06-27 05:00:26', NULL, NULL, NULL, 'Male', NULL, '[]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '01J1CKY6KQG8DDH6ATV42PT5GY.png', NULL),
(67, 'Anusha', 'anusha.ch@sumedhait.com', NULL, NULL, '$2y$12$1T2knX8BgiZP0ds6Id3WMutkI9jsAybmz8BhwGX7izDZAL0BuMj86', '+91', '987654321', 7, NULL, '2024-06-27 07:12:12', '2024-06-27 07:12:12', NULL, NULL, NULL, 'Female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_types`
--

CREATE TABLE `user_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `authentication_log`
--
ALTER TABLE `authentication_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `authentication_log_authenticatable_type_authenticatable_id_index` (`authenticatable_type`,`authenticatable_id`);

--
-- Indexes for table `batches`
--
ALTER TABLE `batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `batch_curriculum`
--
ALTER TABLE `batch_curriculum`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `batch_section`
--
ALTER TABLE `batch_section`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `batch_teaching_materials`
--
ALTER TABLE `batch_teaching_materials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `batch_user`
--
ALTER TABLE `batch_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branchable`
--
ALTER TABLE `branchable`
  ADD KEY `branchable_id_index` (`branchable_type`,`branchable_id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branch_user`
--
ALTER TABLE `branch_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_user_user_id_foreign` (`user_id`),
  ADD KEY `team_user_team_id_foreign` (`branch_id`);

--
-- Indexes for table `breezy_sessions`
--
ALTER TABLE `breezy_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `breezy_sessions_authenticatable_type_authenticatable_id_index` (`authenticatable_type`,`authenticatable_id`);

--
-- Indexes for table `calendars`
--
ALTER TABLE `calendars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `classrooms`
--
ALTER TABLE `classrooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `countries_name_unique` (`name`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `curricula`
--
ALTER TABLE `curricula`
  ADD KEY `curricula_curricula_type_curricula_id_index` (`curricula_type`,`curricula_id`);

--
-- Indexes for table `curriculum`
--
ALTER TABLE `curriculum`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `domains`
--
ALTER TABLE `domains`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exports`
--
ALTER TABLE `exports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exports_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_import_rows`
--
ALTER TABLE `failed_import_rows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `failed_import_rows_import_id_foreign` (`import_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `imports`
--
ALTER TABLE `imports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `imports_user_id_foreign` (`user_id`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `old_teams`
--
ALTER TABLE `old_teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `qualifications`
--
ALTER TABLE `qualifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question_banks`
--
ALTER TABLE `question_banks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question_bank_chapters`
--
ALTER TABLE `question_bank_chapters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question_bank_difficulties`
--
ALTER TABLE `question_bank_difficulties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question_bank_subjects`
--
ALTER TABLE `question_bank_subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question_bank_types`
--
ALTER TABLE `question_bank_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question_options`
--
ALTER TABLE `question_options`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syllabi`
--
ALTER TABLE `syllabi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teaching_materials`
--
ALTER TABLE `teaching_materials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teaching_material_statuses`
--
ALTER TABLE `teaching_material_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team_user`
--
ALTER TABLE `team_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_user_user_id_foreign` (`user_id`),
  ADD KEY `team_user_team_id_foreign` (`team_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_types`
--
ALTER TABLE `user_types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `authentication_log`
--
ALTER TABLE `authentication_log`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=910;

--
-- AUTO_INCREMENT for table `batches`
--
ALTER TABLE `batches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `batch_curriculum`
--
ALTER TABLE `batch_curriculum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `batch_section`
--
ALTER TABLE `batch_section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `batch_teaching_materials`
--
ALTER TABLE `batch_teaching_materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `batch_user`
--
ALTER TABLE `batch_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `branch_user`
--
ALTER TABLE `branch_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `breezy_sessions`
--
ALTER TABLE `breezy_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `calendars`
--
ALTER TABLE `calendars`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `classrooms`
--
ALTER TABLE `classrooms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `curriculum`
--
ALTER TABLE `curriculum`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domains`
--
ALTER TABLE `domains`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `exports`
--
ALTER TABLE `exports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_import_rows`
--
ALTER TABLE `failed_import_rows`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `holidays`
--
ALTER TABLE `holidays`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `imports`
--
ALTER TABLE `imports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `old_teams`
--
ALTER TABLE `old_teams`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=270;

--
-- AUTO_INCREMENT for table `qualifications`
--
ALTER TABLE `qualifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `question_banks`
--
ALTER TABLE `question_banks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `question_bank_chapters`
--
ALTER TABLE `question_bank_chapters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `question_bank_difficulties`
--
ALTER TABLE `question_bank_difficulties`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `question_bank_subjects`
--
ALTER TABLE `question_bank_subjects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `question_bank_types`
--
ALTER TABLE `question_bank_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `question_options`
--
ALTER TABLE `question_options`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `syllabi`
--
ALTER TABLE `syllabi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `teaching_materials`
--
ALTER TABLE `teaching_materials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `teaching_material_statuses`
--
ALTER TABLE `teaching_material_statuses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `team_user`
--
ALTER TABLE `team_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `user_types`
--
ALTER TABLE `user_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `batch_user`
--
ALTER TABLE `batch_user`
  ADD CONSTRAINT `batch_team_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `branch_user`
--
ALTER TABLE `branch_user`
  ADD CONSTRAINT `team_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `exports`
--
ALTER TABLE `exports`
  ADD CONSTRAINT `exports_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `failed_import_rows`
--
ALTER TABLE `failed_import_rows`
  ADD CONSTRAINT `failed_import_rows_import_id_foreign` FOREIGN KEY (`import_id`) REFERENCES `imports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `imports`
--
ALTER TABLE `imports`
  ADD CONSTRAINT `imports_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
