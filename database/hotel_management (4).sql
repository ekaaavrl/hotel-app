-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 28, 2025 at 06:17 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel_management`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_additional_fee` (IN `res_id` INT)   BEGIN
    DECLARE total_fee DECIMAL(10,2);

    SELECT SUM(fee) INTO total_fee
    FROM room_service_requests
    WHERE reservation_id = res_id AND status = 'completed';

    IF total_fee IS NULL THEN
        SET total_fee = 0;
    END IF;

    UPDATE payments
    SET additional_fee = total_fee
    WHERE reservation_id = res_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_additional_fee_and_notes` (IN `res_id` INT)   BEGIN
    DECLARE total_fee DECIMAL(10,2);
    DECLARE all_notes TEXT;

    -- Hitung total fee dari layanan yang selesai
    SELECT SUM(fee) INTO total_fee
    FROM room_service_requests
    WHERE reservation_id = res_id AND status = 'completed';

    IF total_fee IS NULL THEN
        SET total_fee = 0;
    END IF;

    -- Ambil semua deskripsi layanan yang selesai
    SELECT GROUP_CONCAT(CONCAT('• ', service_description) SEPARATOR '\n')
    INTO all_notes
    FROM room_service_requests
    WHERE reservation_id = res_id AND status = 'completed';

    IF all_notes IS NULL THEN
        SET all_notes = '';
    END IF;

    -- Update tabel payments
    UPDATE payments
    SET additional_fee = total_fee,
        notes = all_notes
    WHERE reservation_id = res_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `guests`
--

CREATE TABLE `guests` (
  `guest_id` int NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_general_ci,
  `id_number` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nationality` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guests`
--

INSERT INTO `guests` (`guest_id`, `full_name`, `email`, `phone_number`, `address`, `id_number`, `nationality`, `created_at`) VALUES
(1, 'Andi Wijaya', 'andi@example.com', '081234567890', 'Jl. Merdeka No.10', 'ID12345678', 'Indonesia', '2025-07-03 04:15:02'),
(2, 'Siti Aminah', 'siti@example.com', '082345678901', 'Jl. Sudirman No.20', 'ID87654321', 'Indonesia', '2025-07-03 04:15:02'),
(3, 'Budi', 'budi@example.com', '08123456789', 'Jakarta Selatan', '01289137286372', 'Indonesia', '2025-07-08 03:23:34'),
(4, 'Panji Petualang', 'panji@example.com', '08567891011', 'Amazon', '3240320239984', 'Indonesia', '2025-07-14 14:13:47'),
(5, 'aksjak', 'kjdha@example.com', '021838291', 'New York', '3294829420912', 'WNA', '2025-07-19 16:10:34'),
(7, 'jahdka', 'lkajsla@example.com', '08020192323', 'Bogor', '32030483082093', 'Indonesia', '2025-07-21 09:57:19'),
(28, 'aksjaljlajs', 'adhkahsl@example.com', '08943874864', 'lkahskjagdk', '3247279287474', 'amdadhkajd', '2025-07-21 10:11:52'),
(29, 'Fasya Hasna', 'fasya@example.com', '08892732371', 'Gunung Putri', '3203984938430', 'Indonesia', '2025-07-21 16:02:25'),
(30, 'eka', 'eka@example.com', '08923827319', 'Jakarta', '3294343984392', 'Indonesia', '2025-07-22 07:09:47'),
(31, 'avril', 'avril@example.com', '083293823121', 'Jakarta Pusat', '323943948937483', 'Indonesia', '2025-07-22 07:26:28'),
(32, 'ayam', 'ayam@example.com', '089348398232', 'Kamboja', '021290183293829', 'Kamboja', '2025-07-22 11:52:51'),
(33, 'baru', 'baru@example.com', '02133823922', 'Surabaya', '329382938108313', 'Indonesia', '2025-07-22 14:17:29'),
(34, 'fufufafa', 'fufufafa@example.com', '021939389242', 'kasjakdjak', '32323293892380', 'kaskahdka', '2025-07-24 16:05:50'),
(35, 'ana', 'ana@example.com', '021394394', 'Bali', '9348923803', 'Indonesia', '2025-07-25 05:24:05'),
(36, 'agung', 'agung@example.com', '021932039', 'Cilodong', '3298392832938', 'Indonesia', '2025-07-25 11:27:30'),
(37, 'b', 'b@example.com', '0212933432', 'b', '323839283424', 'b', '2025-07-25 14:02:05'),
(38, 'c', 'c@example.com', '0120182012', 'c', '0309392839283', 'c', '2025-07-25 14:57:17'),
(39, 'n', 'n@gmail.com', '920901', 's', '827392', 's', '2025-07-25 15:19:56'),
(40, 'abc', 'abc@example.com', '020830230', 'abc', '12102', 'abc', '2025-07-25 15:47:43'),
(41, 'pppp', 'ppp@example.com', '00823409', 'ppp', '0180121', 'ppp', '2025-07-25 17:04:02'),
(42, 'fix', 'fix@example.com', '0283928392', 'fix', '223232', 'fix', '2025-07-26 04:51:44'),
(43, 'ariana', 'ariana@example.com', '02382938', 'saksjal', '92832', 'kajska', '2025-07-26 11:00:54'),
(44, 'ekav', 'ekav@example.com', '08938293', 'Depok', '29832', 'Indonesia', '2025-07-27 05:10:57'),
(46, 'Avrilia', 'avril@example.com', '0282038', 'Bandung', '822983', 'Indonesia', '2025-07-27 08:00:23'),
(47, 'Pattrick', 'pattrick@example.com', '09200110', 'Bikini bottom', '93829830', 'WNA', '2025-07-27 08:19:18'),
(48, 'tumblr', 'tumblr@example.com', '019201', 'Surabaya', '01920', 'Indonesia', '2025-07-27 08:55:15'),
(49, 'Ana Frozen', 'ana@example.com', '029320', 'Arendelle', '92389', 'WNA', '2025-07-27 10:01:18');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int NOT NULL,
  `reservation_id` int DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_method` enum('cash','credit_card','debit_card','online','bank_transfer') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `additional_fee` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `reservation_id`, `amount_paid`, `payment_date`, `payment_method`, `notes`, `additional_fee`) VALUES
(1, 1, 650000.00, '2025-07-03 04:15:02', 'credit_card', 'Lunas', 50000),
(2, 2, 0.00, '2025-07-03 04:15:02', 'cash', 'Not paid yet (will pay at check-in)', 0),
(7, 15, 2400000.00, '2025-07-22 11:54:26', 'bank_transfer', 'Sisa bayar laundry', 200000),
(8, 16, 1000000.00, '2025-07-22 14:55:50', 'cash', 'DP', 50000),
(10, 17, 2000000.00, '2025-07-24 16:07:11', 'credit_card', 'Baru bayar reservasi', 50000),
(11, 18, 3200000.00, '2025-07-25 08:14:05', 'bank_transfer', 'Lunasssssssssssssz', 200000),
(12, 22, 0.00, '2025-07-25 11:30:57', 'cash', 'Auto generated from reservation', 0),
(13, 23, 200000.00, '2025-07-25 11:35:50', 'cash', 'baru DP', 300000),
(32, 40, 900000.00, '2025-07-27 08:12:54', 'cash', 'Lunas', 0),
(35, 43, 1550000.00, '2025-07-27 08:56:10', 'cash', 'Lunas', 200000),
(36, 44, 1000000.00, '2025-07-27 10:02:36', 'cash', 'dp dulu', 150000);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int NOT NULL,
  `guest_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `check_in_date` datetime DEFAULT NULL,
  `check_out_date` datetime DEFAULT NULL,
  `number_of_guests` int DEFAULT NULL,
  `status` enum('booked','checked_in','checked_out','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'booked',
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `guest_id`, `room_id`, `check_in_date`, `check_out_date`, `number_of_guests`, `status`, `total_price`, `created_at`) VALUES
(1, 1, 1, '2025-06-16 00:00:00', '2025-06-18 00:00:00', 1, 'checked_out', 600000.00, '2025-07-03 04:15:02'),
(2, 2, 2, '2025-06-18 00:00:00', '2025-06-20 00:00:00', 2, 'booked', NULL, '2025-07-03 04:15:02'),
(3, 3, 3, '2025-08-23 00:00:00', '2025-08-25 00:00:00', 1, 'booked', NULL, '2025-07-08 04:17:49'),
(4, 3, 3, '2025-07-08 00:00:00', '2025-07-10 00:00:00', 1, 'booked', NULL, '2025-07-08 10:34:00'),
(5, 1, 4, '2025-07-08 00:00:00', '2025-07-15 00:00:00', 1, 'booked', NULL, '2025-07-08 10:36:53'),
(6, 5, 9, '2025-07-19 00:00:00', '2025-07-22 00:00:00', 1, 'booked', NULL, '2025-07-19 16:11:30'),
(7, 2, 10, '2025-07-21 00:00:00', '2025-07-23 00:00:00', 2, 'checked_in', NULL, '2025-07-21 09:32:36'),
(8, 3, 102, '2025-07-21 00:00:00', '2025-07-22 00:00:00', 3, 'checked_in', NULL, '2025-07-21 09:36:07'),
(11, 29, 20, '2025-07-18 00:00:00', '2025-07-22 00:00:00', 1, 'checked_in', NULL, '2025-07-21 16:03:03'),
(13, 30, 101, '2025-07-21 00:00:00', '2025-07-23 00:00:00', 3, 'checked_in', 900000.00, '2025-07-22 07:10:25'),
(14, 31, 23, '2025-07-22 00:00:00', '2025-07-28 00:00:00', 2, 'checked_in', 2400000.00, '2025-07-22 07:29:11'),
(15, 32, 71, '2025-07-22 00:00:00', '2025-07-30 00:00:00', 2, 'checked_in', 2400000.00, '2025-07-22 11:53:32'),
(16, 33, 201, '2025-07-22 00:00:00', '2025-07-28 00:00:00', 5, 'booked', 3600000.00, '2025-07-22 14:18:15'),
(17, 34, 400, '2025-07-24 00:00:00', '2025-07-30 00:00:00', 10, 'booked', 5400000.00, '2025-07-24 16:06:20'),
(18, 35, 201, '2025-07-25 00:00:00', '2025-07-30 00:00:00', 5, 'booked', 3000000.00, '2025-07-25 05:24:45'),
(19, 36, 11, '2025-07-25 00:00:00', '2025-08-01 00:00:00', 2, 'booked', 2100000.00, '2025-07-25 11:29:07'),
(20, 36, 11, '2025-07-25 00:00:00', '2025-08-01 00:00:00', 2, 'booked', 2100000.00, '2025-07-25 11:29:08'),
(21, 36, 11, '2025-07-25 00:00:00', '2025-08-01 00:00:00', 2, 'booked', 2100000.00, '2025-07-25 11:29:10'),
(22, 36, 20, '2025-07-25 00:00:00', '2025-07-27 00:00:00', 2, 'booked', 600000.00, '2025-07-25 11:30:57'),
(23, 36, 90, '2025-07-24 00:00:00', '2025-07-26 00:00:00', 2, 'checked_in', 600000.00, '2025-07-25 11:35:50'),
(24, 5, 97, '2025-07-25 00:00:00', '2025-07-26 00:00:00', 2, 'booked', 300000.00, '2025-07-25 13:47:13'),
(26, 37, 97, '2025-07-25 00:00:00', '2025-07-26 00:00:00', 2, 'booked', 300000.00, '2025-07-25 14:26:31'),
(27, 38, 109, '2025-07-25 00:00:00', '2025-07-26 00:00:00', 3, 'booked', 450000.00, '2025-07-25 14:58:01'),
(28, 39, 400, '2025-07-25 00:00:00', '2025-07-26 00:00:00', 10, 'checked_in', 900000.00, '2025-07-25 15:20:34'),
(29, 40, 131, '2025-07-25 00:00:00', '2025-07-30 00:00:00', 3, 'booked', 2250000.00, '2025-07-25 15:48:17'),
(32, 41, 23, '2025-07-26 00:00:00', '2025-07-30 00:00:00', 2, 'booked', 1200000.00, '2025-07-26 04:15:37'),
(33, 42, 7, '2025-07-26 00:00:00', '2025-07-30 00:00:00', 2, 'booked', 1200000.00, '2025-07-26 04:52:11'),
(34, 29, 100, '2025-07-24 00:00:00', '2025-07-28 00:00:00', 2, 'cancelled', 1200000.00, '2025-07-26 05:56:12'),
(35, 43, 209, '2025-07-26 19:00:00', '2025-07-30 05:00:00', 1, 'booked', 2400000.00, '2025-07-26 11:01:58'),
(37, 44, 51, '2025-07-27 07:30:00', '2025-07-30 18:30:00', 1, 'booked', 1200000.00, '2025-07-27 05:27:08'),
(40, 46, 12, '2025-07-27 18:00:00', '2025-07-30 14:00:00', 2, 'booked', 900000.00, '2025-07-27 08:12:54'),
(42, 47, 3, '2025-07-27 17:50:00', '2025-07-30 17:50:00', 1, 'booked', NULL, '2025-07-27 08:34:02'),
(43, 48, 101, '2025-07-27 20:30:00', '2025-07-30 20:30:00', 1, 'checked_in', 1350000.00, '2025-07-27 08:56:10'),
(44, 49, 301, '2025-07-27 17:00:00', '2025-07-30 19:00:00', 10, 'checked_in', 3600000.00, '2025-07-27 10:02:36');

--
-- Triggers `reservations`
--
DELIMITER $$
CREATE TRIGGER `trg_after_insert_reservation` AFTER INSERT ON `reservations` FOR EACH ROW BEGIN
    INSERT INTO payments (reservation_id, amount_paid, payment_method, notes, additional_fee)
    VALUES (NEW.reservation_id, 0, 'cash', '', 0);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int NOT NULL,
  `room_number` varchar(10) NOT NULL,
  `room_type_id` int DEFAULT NULL,
  `price_per_night` decimal(10,2) DEFAULT NULL,
  `status` enum('available','occupied','maintenance') DEFAULT 'available',
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_number`, `room_type_id`, `price_per_night`, `status`, `description`) VALUES
(1, '101', 1, 300000.00, 'maintenance', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(2, '102', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(3, '103', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(4, '104', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(5, '105', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(6, '106', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(7, '107', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(8, '108', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(9, '109', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(10, '110', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(11, '111', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(12, '112', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(13, '113', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(14, '114', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(15, '115', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(16, '116', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(17, '117', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(18, '118', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(19, '119', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(20, '120', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(21, '121', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(22, '122', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(23, '123', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(24, '124', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(25, '125', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(26, '126', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(27, '127', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(28, '128', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(29, '129', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(30, '130', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(31, '131', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(32, '132', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(33, '133', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(34, '134', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(35, '135', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(36, '136', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(37, '137', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(38, '138', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(39, '139', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(40, '140', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(41, '141', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(42, '142', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(43, '143', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(44, '144', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(45, '145', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(46, '146', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(47, '147', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(48, '148', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(49, '149', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(50, '150', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(51, '151', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(52, '152', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(53, '153', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(54, '154', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(55, '155', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(56, '156', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(57, '157', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(58, '158', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(59, '159', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(60, '160', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(61, '161', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(62, '162', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(63, '163', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(64, '164', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(65, '165', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(66, '166', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(67, '167', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(68, '168', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(69, '169', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(70, '170', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(71, '171', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(72, '172', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(73, '173', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(74, '174', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(75, '175', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(76, '176', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(77, '177', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(78, '178', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(79, '179', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(80, '180', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(81, '181', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(82, '182', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(83, '183', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(84, '184', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(85, '185', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(86, '186', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(87, '187', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(88, '188', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(89, '189', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(90, '190', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(91, '191', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(92, '192', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(93, '193', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(94, '194', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(95, '195', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(96, '196', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(97, '197', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(98, '198', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(99, '199', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(100, '200', 1, 300000.00, 'available', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi'),
(101, '201', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(102, '202', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(103, '203', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(104, '204', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(105, '205', 2, 450000.00, 'maintenance', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(106, '206', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(107, '207', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(108, '208', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(109, '209', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(110, '210', 2, 450000.00, 'maintenance', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(111, '211', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(112, '212', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(113, '213', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(114, '214', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(115, '215', 2, 450000.00, 'maintenance', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(116, '216', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(117, '217', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(118, '218', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(119, '219', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(120, '220', 2, 450000.00, 'maintenance', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(121, '221', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(122, '222', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(123, '223', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(124, '224', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(125, '225', 2, 450000.00, 'maintenance', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(126, '226', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(127, '227', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(128, '228', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(129, '229', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(130, '230', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(131, '231', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(132, '232', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(133, '233', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(134, '234', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(135, '235', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(136, '236', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(137, '237', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(138, '238', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(139, '239', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(140, '240', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(141, '241', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(142, '242', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(143, '243', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(144, '244', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(145, '245', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(146, '246', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(147, '247', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(148, '248', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(149, '249', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(150, '250', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(151, '251', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(152, '252', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(153, '253', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(154, '254', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(155, '255', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(156, '256', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(157, '257', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(158, '258', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(159, '259', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(160, '260', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(161, '261', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(162, '262', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(163, '263', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(164, '264', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(165, '265', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(166, '266', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(167, '267', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(168, '268', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(169, '269', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(170, '270', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(171, '271', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(172, '272', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(173, '273', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(174, '274', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(175, '275', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(176, '276', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(177, '277', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(178, '278', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(179, '279', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(180, '280', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(181, '281', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(182, '282', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(183, '283', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(184, '284', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(185, '285', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(186, '286', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(187, '287', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(188, '288', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(189, '289', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(190, '290', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(191, '291', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(192, '292', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(193, '293', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(194, '294', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(195, '295', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(196, '296', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(197, '297', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(198, '298', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(199, '299', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(200, '300', 2, 450000.00, 'available', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi'),
(201, '301', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(202, '302', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(203, '303', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(204, '304', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(205, '305', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(206, '306', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(207, '307', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(208, '308', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(209, '309', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(210, '310', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(211, '311', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(212, '312', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(213, '313', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(214, '314', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(215, '315', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(216, '316', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(217, '317', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(218, '318', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(219, '319', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(220, '320', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(221, '321', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(222, '322', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(223, '323', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(224, '324', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(225, '325', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(226, '326', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(227, '327', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(228, '328', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(229, '329', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(230, '330', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(231, '331', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(232, '332', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(233, '333', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(234, '334', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(235, '335', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(236, '336', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(237, '337', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(238, '338', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(239, '339', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(240, '340', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(241, '341', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(242, '342', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(243, '343', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(244, '344', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(245, '345', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(246, '346', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(247, '347', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(248, '348', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(249, '349', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(250, '350', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(251, '351', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(252, '352', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(253, '353', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(254, '354', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(255, '355', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(256, '356', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(257, '357', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(258, '358', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(259, '359', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(260, '360', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(261, '361', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(262, '362', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(263, '363', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(264, '364', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(265, '365', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(266, '366', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(267, '367', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(268, '368', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(269, '369', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(270, '370', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(271, '371', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(272, '372', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(273, '373', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(274, '374', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(275, '375', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(276, '376', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(277, '377', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(278, '378', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(279, '379', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(280, '380', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(281, '381', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(282, '382', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(283, '383', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(284, '384', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(285, '385', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(286, '386', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(287, '387', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(288, '388', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(289, '389', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(290, '390', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(291, '391', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(292, '392', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(293, '393', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(294, '394', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(295, '395', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(296, '396', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(297, '397', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(298, '398', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(299, '399', 3, 600000.00, 'available', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(300, '400', 3, 600000.00, 'occupied', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan'),
(301, '401', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(302, '402', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(303, '403', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(304, '404', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(305, '405', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(306, '406', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(307, '407', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(308, '408', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(309, '409', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(310, '410', 4, 900000.00, 'occupied', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(311, '411', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(312, '412', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(313, '413', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(314, '414', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(315, '415', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(316, '416', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(317, '417', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(318, '418', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(319, '419', 4, 900000.00, 'occupied', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(320, '420', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(321, '421', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(322, '422', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(323, '423', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(324, '424', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(325, '425', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(326, '426', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(327, '427', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(328, '428', 4, 900000.00, 'occupied', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(329, '429', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(330, '430', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(331, '431', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(332, '432', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(333, '433', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(334, '434', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(335, '435', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(336, '436', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(337, '437', 4, 900000.00, 'occupied', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(338, '438', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(339, '439', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(340, '440', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(341, '441', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(342, '442', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(343, '443', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(344, '444', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(345, '445', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(346, '446', 4, 900000.00, 'occupied', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(347, '447', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(348, '448', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(349, '449', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(350, '450', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(351, '451', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(352, '452', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(353, '453', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(354, '454', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(355, '455', 4, 900000.00, 'occupied', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(356, '456', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(357, '457', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(358, '458', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(359, '459', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(360, '460', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(361, '461', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(362, '462', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(363, '463', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(364, '464', 4, 900000.00, 'occupied', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(365, '465', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(366, '466', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(367, '467', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(368, '468', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(369, '469', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(370, '470', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(371, '471', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(372, '472', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(373, '473', 4, 900000.00, 'occupied', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(374, '474', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(375, '475', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(376, '476', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(377, '477', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(378, '478', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(379, '479', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(380, '480', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(381, '481', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(382, '482', 4, 900000.00, 'occupied', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(383, '483', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(384, '484', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(385, '485', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(386, '486', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(387, '487', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(388, '488', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(389, '489', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(390, '490', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(391, '491', 4, 900000.00, 'occupied', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(392, '492', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(393, '493', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(394, '494', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(395, '495', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(396, '496', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(397, '497', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(398, '498', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(399, '499', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi'),
(400, '500', 4, 900000.00, 'available', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi');

-- --------------------------------------------------------

--
-- Table structure for table `room_service_requests`
--

CREATE TABLE `room_service_requests` (
  `request_id` int NOT NULL,
  `reservation_id` int DEFAULT NULL,
  `service_description` text COLLATE utf8mb4_general_ci,
  `request_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','completed','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `fee` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_service_requests`
--

INSERT INTO `room_service_requests` (`request_id`, `reservation_id`, `service_description`, `request_time`, `status`, `fee`) VALUES
(1, 1, 'Request extra towel and bottled water', '2025-07-03 04:15:02', 'completed', 0),
(2, 1, 'Laundry service pickup', '2025-07-03 04:15:02', 'pending', 0),
(3, 16, 'laundry 2 kg', '2025-07-24 23:50:19', 'pending', 0),
(4, 17, 'laundry', '2025-07-25 00:11:18', 'completed', 0),
(5, 17, 'nambah sarapan', '2025-07-25 01:08:49', 'completed', 0),
(6, 13, 'celimut', '2025-07-25 01:15:37', 'completed', 0),
(7, 14, 'laundry sama apa kek', '2025-07-25 01:47:06', 'completed', 0),
(8, 18, 'Tambah handuk, cleaning service, laundry 3 hari 10kg', '2025-07-25 05:25:37', 'completed', 200000),
(9, 23, 'BANYAK', '2025-07-25 11:47:50', 'completed', 100000),
(10, 26, 'pppppp', '2025-07-25 14:44:12', 'completed', 50000),
(12, 29, 'jahsakhs', '2025-07-25 16:11:14', 'completed', 50000),
(14, 32, 'cikat gigi duyu', '2025-07-26 04:17:03', 'completed', 100000),
(15, 33, 'mau anduk bentuk love', '2025-07-26 05:04:50', 'completed', 100000),
(17, 43, 'mam cianggg duyu', '2025-07-27 09:07:31', 'completed', 200000),
(18, 44, 'tambah anduk', '2025-07-27 10:03:30', 'completed', 150000);

--
-- Triggers `room_service_requests`
--
DELIMITER $$
CREATE TRIGGER `trg_after_delete_service` AFTER DELETE ON `room_service_requests` FOR EACH ROW BEGIN
    CALL update_additional_fee_and_notes(OLD.reservation_id);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_after_insert_service` AFTER INSERT ON `room_service_requests` FOR EACH ROW BEGIN
    CALL update_additional_fee_and_notes(NEW.reservation_id);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_after_update_service` AFTER UPDATE ON `room_service_requests` FOR EACH ROW BEGIN
    IF NEW.status <> OLD.status OR NEW.fee <> OLD.fee OR NEW.reservation_id <> OLD.reservation_id THEN
        CALL update_additional_fee(NEW.reservation_id);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `room_types`
--

CREATE TABLE `room_types` (
  `room_type_id` int NOT NULL,
  `type_name` varchar(50) NOT NULL,
  `description` text,
  `default_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `room_types`
--

INSERT INTO `room_types` (`room_type_id`, `type_name`, `description`, `default_price`) VALUES
(1, 'Single', 'Kamar dengan fasilitas 1 kasur, dan 1 kamar mandi', 300000.00),
(2, 'Double', 'Kamar dengan fasilitas 2 kasur, dan 1 kamar mandi', 450000.00),
(3, 'Deluxe', 'Kamar besar dengan 2 ruangan dengan fasilitas 2 kasur/ruangan, dan 1 kamar mandi per ruangan', 600000.00),
(4, 'Suite', 'Kamar besar yang memiliki 3 ruangan dan 1 ruang tamu beserta dapur kecil, yang dimana per ruangan memiliki 2 kasur dan 1 kamar mandi', 900000.00);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `full_name`, `position`, `email`, `phone_number`, `hire_date`, `status`) VALUES
(1, 'Rina Kusuma', 'Housekeeping', 'rina@hotel.com', '0811111111', '2023-02-27', 'active'),
(5, 'Olaf Frozen', 'Security', 'staff04@hotel.com', '0893748374', NULL, 'active'),
(6, 'Samsudin', 'Staff 2', 'staff05@hotel.com', '0832939245', NULL, 'active'),
(7, 'Elsa Frozen', 'Resepsionis B', 'resep02@gmail.com', '0898937394', NULL, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('admin','resepsionis','manager','staff') DEFAULT 'staff',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `full_name`, `email`, `role`, `status`, `created_at`) VALUES
(1, 'admin01', '$2b$10$gzxSSL8MTvdF2qt0fihFqubhSMSz12yio4EhLtPqtCNT4j1O1JQSS', 'Admin Utama', 'admin@hotel.com', 'admin', 'active', '2025-07-16 04:20:16'),
(2, 'resep01', '$2b$10$HtGp3qFScWR0YW4XmMNRz.UJx1ICbAiC0enU0BiWgwOotO86Aiami', 'Resepsionis A', 'resep@hotel.com', 'resepsionis', 'active', '2025-07-16 04:20:56'),
(3, 'staff01', '$2b$10$bBAAuT1JfGgh.gH4MjnyEuUjuv28fvQs4Rf/X01sRbzoGfWgmvS52', 'Staff 1', 'staff@hotel.com', 'staff', 'active', '2025-07-16 04:21:47'),
(4, 'ekav', '$2b$10$342Nfy9zg55ebxt8gWWa8.HoSjHzHN8ULCTIZqIXFBpqJFUbVcT9K', 'Eka Avriliana', 'ekaaavrl@gmail.com', 'admin', 'active', '2025-07-23 04:51:31'),
(8, 'staff04', '$2b$10$DFeS.o8d.UB9HcAZ/iKHrOGFE52mbF.18yYgUOmdYvawFyXeo8b4q', 'Olaf Frozen', 'staff04@hotel.com', 'staff', 'active', '2025-07-26 03:25:45'),
(9, 'staff05', '$2b$10$L5O5YPR4C7s27d/tGaHX6eLW2Z1M1AhPC.Jm8JWDUwY/FZM8aCUe2', 'Samsudin', 'staff05@hotel.com', 'staff', 'active', '2025-07-26 03:29:37'),
(10, 'resep02', '$2b$10$UfHLUk3RndQQo2JHpHPRWu1evi/ElPpKGjtGbEu2eaZxUkViCtxfu', 'Elsa Frozen', 'resep02@gmail.com', 'staff', 'active', '2025-07-26 03:31:31'),
(11, 'manager', '$2b$10$f7GNHSGH6Jzsmfk82o7S7ORAX8v9Omj14nsGEd1FwuHoEC1iFMqXe', 'Falih Aqmar', 'manager@hotel.com', 'manager', 'active', '2025-07-28 16:17:14');

-- --------------------------------------------------------

--
-- Table structure for table `user_logs`
--

CREATE TABLE `user_logs` (
  `log_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `action_type` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_logs`
--

INSERT INTO `user_logs` (`log_id`, `user_id`, `action_type`, `description`, `log_time`, `ip_address`) VALUES
(1, 1, 'login', 'Admin logged into the system', '2025-07-03 04:15:02', '192.168.1.2'),
(2, 2, 'create_reservation', 'Resepsionis created a new booking for guest_id 2', '2025-07-03 04:15:02', '192.168.1.3'),
(3, 1, 'login', 'Login berhasil', '2025-07-22 15:10:42', '::1'),
(4, 1, 'login', 'Login berhasil', '2025-07-22 15:14:16', '192.168.88.45'),
(5, 2, 'login', 'Login berhasil', '2025-07-22 15:14:40', '192.168.88.45'),
(6, 2, 'login', 'Login berhasil', '2025-07-22 15:16:50', '192.168.88.45'),
(7, 1, 'login', 'Login berhasil', '2025-07-22 15:19:47', '192.168.88.45'),
(8, 1, 'login', 'Login berhasil', '2025-07-22 16:44:59', '192.168.88.45'),
(9, 2, 'login', 'Login berhasil', '2025-07-22 17:24:41', '192.168.88.45'),
(10, 1, 'login', 'Login berhasil', '2025-07-22 17:27:32', '192.168.88.45'),
(11, 2, 'login', 'Login berhasil', '2025-07-22 18:03:58', '192.168.88.45'),
(12, 2, 'login', 'Login berhasil', '2025-07-22 18:05:08', '192.168.88.45'),
(13, 1, 'login', 'Login berhasil', '2025-07-23 04:35:26', '192.168.88.45'),
(14, 1, 'login', 'Login berhasil', '2025-07-23 04:50:44', '192.168.88.45'),
(15, 4, 'login', 'Login berhasil', '2025-07-23 04:51:44', '192.168.88.45'),
(16, 2, 'login', 'Login berhasil', '2025-07-23 04:52:28', '192.168.88.45'),
(17, 1, 'login', 'Login berhasil', '2025-07-23 04:52:51', '192.168.88.45'),
(18, 1, 'login', 'Login berhasil', '2025-07-23 05:17:41', '192.168.88.45'),
(19, 1, 'login', 'Login berhasil', '2025-07-23 05:21:46', '192.168.88.45'),
(20, 2, 'login', 'Login berhasil', '2025-07-23 05:22:17', '192.168.88.45'),
(21, 1, 'login', 'Login berhasil', '2025-07-23 05:33:55', '192.168.88.45'),
(22, 1, 'login', 'Login berhasil', '2025-07-23 14:06:50', '192.168.88.45'),
(23, 4, 'login', 'Login berhasil', '2025-07-23 14:15:05', '192.168.88.45'),
(24, 4, 'login', 'Login berhasil', '2025-07-23 17:13:11', '192.168.88.45'),
(25, 1, 'login', 'Login berhasil', '2025-07-24 11:13:24', '192.168.88.45'),
(26, 4, 'login', 'Login berhasil', '2025-07-24 12:18:05', '192.168.88.45'),
(27, 1, 'login', 'Login berhasil', '2025-07-24 12:26:00', '192.168.88.45'),
(28, 2, 'login', 'Login berhasil', '2025-07-24 12:26:31', '192.168.88.45'),
(29, 1, 'login', 'Login berhasil', '2025-07-24 12:28:56', '192.168.88.45'),
(30, 4, 'login', 'Login berhasil', '2025-07-24 12:38:19', '192.168.88.45'),
(31, 4, 'login', 'Login berhasil', '2025-07-24 12:38:19', '192.168.88.45'),
(32, 1, 'login', 'Login berhasil', '2025-07-24 15:04:40', '192.168.88.45'),
(33, 1, 'login', 'Login berhasil', '2025-07-24 22:43:51', '192.168.88.45'),
(34, 1, 'login', 'Login berhasil', '2025-07-25 01:01:39', '192.168.88.45'),
(35, 1, 'login', 'Login berhasil', '2025-07-25 10:20:44', '192.168.88.45'),
(36, 1, 'login', 'Login berhasil', '2025-07-25 10:51:15', '192.168.88.45'),
(37, 1, 'login', 'Login berhasil', '2025-07-25 13:30:34', '192.168.88.45'),
(38, 1, 'login', 'Login berhasil', '2025-07-25 15:24:19', '192.168.88.45'),
(39, 1, 'login', 'Login berhasil', '2025-07-25 15:46:55', '192.168.88.45'),
(40, 1, 'login', 'Login berhasil', '2025-07-25 17:30:25', '192.168.88.45'),
(41, 1, 'login', 'Login berhasil', '2025-07-26 02:24:50', '192.168.88.45'),
(42, 1, 'login', 'Login berhasil', '2025-07-26 05:52:28', '192.168.88.45'),
(43, 1, 'login', 'Login berhasil', '2025-07-26 09:43:50', '192.168.88.45'),
(44, 1, 'login', 'Login berhasil', '2025-07-26 14:34:45', '192.168.88.45'),
(45, 1, 'login', 'Login berhasil', '2025-07-26 14:35:18', '192.168.88.45'),
(46, 1, 'login', 'Login berhasil', '2025-07-26 14:39:55', '192.168.88.45'),
(47, 1, 'login', 'Login berhasil', '2025-07-26 14:40:07', '192.168.88.45'),
(48, 1, 'login', 'Login berhasil', '2025-07-26 14:44:14', '192.168.88.45'),
(49, 1, 'login', 'Login berhasil', '2025-07-27 04:39:21', '192.168.88.45'),
(50, 1, 'login', 'Login berhasil', '2025-07-27 04:46:01', '192.168.88.45'),
(51, 1, 'login', 'Login berhasil', '2025-07-27 04:53:36', '192.168.88.45'),
(52, 4, 'login', 'Login berhasil', '2025-07-27 04:57:18', '192.168.88.45'),
(53, 4, 'login', 'Login berhasil', '2025-07-27 05:00:33', '192.168.88.45'),
(54, 4, 'logout', 'Logout dari sistem', '2025-07-27 05:00:42', '::1'),
(55, 4, 'login', 'Login berhasil', '2025-07-27 05:00:51', '192.168.88.45'),
(56, 4, 'logout', 'Logout dari sistem', '2025-07-27 05:03:52', '192.168.88.45'),
(57, 4, 'login', 'Login berhasil', '2025-07-27 05:04:05', '192.168.88.45'),
(58, 4, 'logout', 'Logout dari sistem', '2025-07-27 05:04:10', '192.168.88.45'),
(59, 4, 'login', 'Login berhasil', '2025-07-27 05:04:16', '192.168.88.45'),
(60, 4, 'add_guest', 'Menambahkan tamu: ekav', '2025-07-27 05:10:57', '::1'),
(61, 4, 'login', 'Login berhasil', '2025-07-27 06:49:12', '192.168.88.45'),
(62, 4, 'update_payment', 'Mengubah pembayaran ID: 18', '2025-07-27 07:30:29', '::1'),
(63, 4, 'delete_payment', 'Menghapus pembayaran ID: 16', '2025-07-27 07:40:07', '::1'),
(64, 4, 'add_guest', 'Menambahkan tamu: upin', '2025-07-27 07:49:40', '::1'),
(65, 4, 'add_guest', 'Menambahkan tamu: Avril', '2025-07-27 08:00:23', '192.168.88.45'),
(66, 4, 'edit_guest', 'Mengedit tamu ID: 46', '2025-07-27 08:00:44', '192.168.88.45'),
(67, NULL, 'create_reservation', 'Membuat reservasi ID: 38', '2025-07-27 08:01:54', '::1'),
(68, 4, 'delete_guest', 'Menghapus tamu ID: 45', '2025-07-27 08:02:26', '192.168.88.45'),
(69, 4, 'delete_payment', 'Menghapus pembayaran ID: 30', '2025-07-27 08:06:40', '::1'),
(70, NULL, 'delete_reservation', 'Menghapus reservasi ID: 38', '2025-07-27 08:06:55', '::1'),
(71, NULL, 'create_reservation', 'Membuat reservasi ID: 39', '2025-07-27 08:07:53', '::1'),
(72, 4, 'delete_payment', 'Menghapus pembayaran ID: 31', '2025-07-27 08:12:06', '::1'),
(73, NULL, 'delete_reservation', 'Menghapus reservasi ID: 39', '2025-07-27 08:12:14', '192.168.88.45'),
(74, NULL, 'create_reservation', 'Membuat reservasi ID: 40', '2025-07-27 08:12:54', '192.168.88.45'),
(75, 4, 'add_guest', 'Menambahkan tamu: Pattrick', '2025-07-27 08:19:18', '192.168.88.45'),
(76, NULL, 'create_reservation', 'Membuat reservasi ID: 41', '2025-07-27 08:19:59', '192.168.88.45'),
(77, 4, 'update_payment', 'Mengubah pembayaran ID: 33', '2025-07-27 08:31:36', '::1'),
(78, 4, 'delete_payment', 'Menghapus pembayaran ID: 33', '2025-07-27 08:31:53', '::1'),
(79, 4, 'delete_reservation', 'Menghapus reservasi ID: 41', '2025-07-27 08:33:00', '192.168.88.45'),
(80, 4, 'create_reservation', 'Membuat reservasi ID: 42', '2025-07-27 08:34:02', '192.168.88.45'),
(81, 4, 'update_reservation', 'Mengubah reservasi ID: 42', '2025-07-27 08:34:23', '192.168.88.45'),
(82, 4, 'add_guest', 'Menambahkan tamu: tumblr', '2025-07-27 08:55:15', '192.168.88.45'),
(83, 4, 'create_reservation', 'Membuat reservasi ID: 43', '2025-07-27 08:56:10', '192.168.88.45'),
(84, 4, 'update_reservation', 'Mengubah reservasi ID: 43', '2025-07-27 09:07:00', '192.168.88.45'),
(85, 1, 'login', 'Login berhasil', '2025-07-27 09:26:10', '192.168.88.45'),
(86, 1, 'update_payment', 'Mengubah pembayaran ID: 32', '2025-07-27 09:26:40', '::1'),
(87, 1, 'delete_payment', 'Menghapus pembayaran ID: 34', '2025-07-27 09:26:56', '::1'),
(88, 1, 'update_payment', 'Mengubah pembayaran ID: 35', '2025-07-27 09:27:19', '::1'),
(89, 1, 'update_reservation', 'Mengubah reservasi ID: 43', '2025-07-27 09:29:32', '192.168.88.45'),
(90, 1, 'edit_service', 'Mengubah layanan ID: 17', '2025-07-27 09:33:25', '192.168.88.45'),
(91, 1, 'edit_service', 'Mengubah layanan ID: 17', '2025-07-27 09:44:52', '192.168.88.45'),
(92, 1, 'logout', 'Logout dari sistem', '2025-07-27 09:58:28', '192.168.88.45'),
(93, 1, 'login', 'Login berhasil', '2025-07-27 09:58:54', '192.168.88.45'),
(94, 1, 'logout', 'Logout dari sistem', '2025-07-27 09:59:16', '192.168.88.45'),
(95, 2, 'login', 'Login berhasil', '2025-07-27 09:59:31', '192.168.88.45'),
(96, 2, 'add_guest', 'Menambahkan tamu: Ana Frozen', '2025-07-27 10:01:18', '192.168.88.45'),
(97, 2, 'create_reservation', 'Membuat reservasi ID: 44', '2025-07-27 10:02:36', '192.168.88.45'),
(98, 2, 'add_service', 'Menambahkan layanan untuk reservasi ID: 44', '2025-07-27 10:03:31', '192.168.88.45'),
(99, 2, 'edit_service', 'Mengubah layanan ID: 18', '2025-07-27 10:03:35', '192.168.88.45'),
(100, 2, 'update_reservation', 'Mengubah reservasi ID: 44', '2025-07-27 10:03:44', '192.168.88.45'),
(101, 2, 'update_payment', 'Mengubah pembayaran ID: 36', '2025-07-27 10:04:00', '192.168.88.45'),
(102, 2, 'update_payment', 'Mengubah pembayaran ID: 36', '2025-07-27 10:04:12', '192.168.88.45'),
(103, 2, 'logout', 'Logout dari sistem', '2025-07-27 10:04:22', '192.168.88.45'),
(104, 1, 'login', 'Login berhasil', '2025-07-27 10:04:29', '192.168.88.45'),
(105, 1, 'logout', 'Logout dari sistem', '2025-07-27 10:04:46', '192.168.88.45'),
(106, 4, 'login', 'Login berhasil', '2025-07-27 16:41:27', '192.168.88.45'),
(107, 4, 'logout', 'Logout dari sistem', '2025-07-27 17:35:27', '192.168.88.45'),
(108, 2, 'login', 'Login berhasil', '2025-07-27 17:35:34', '192.168.88.45'),
(109, 2, 'logout', 'Logout dari sistem', '2025-07-27 17:41:21', '192.168.88.45'),
(110, 4, 'login', 'Login berhasil', '2025-07-27 17:41:29', '192.168.88.45'),
(111, 4, 'logout', 'Logout dari sistem', '2025-07-27 17:46:22', '192.168.88.45'),
(112, 1, 'login', 'Login berhasil', '2025-07-27 23:14:47', '192.168.88.45'),
(113, 1, 'logout', 'Logout dari sistem', '2025-07-28 00:08:02', '192.168.88.45'),
(114, 1, 'login', 'Login berhasil', '2025-07-28 00:13:49', '192.168.88.45'),
(115, 1, 'logout', 'Logout dari sistem', '2025-07-28 00:33:00', '192.168.88.45'),
(116, 2, 'login', 'Login berhasil', '2025-07-28 00:33:13', '192.168.88.45'),
(117, 2, 'logout', 'Logout dari sistem', '2025-07-28 00:45:22', '192.168.88.45'),
(118, 4, 'login', 'Login berhasil', '2025-07-28 00:45:59', '192.168.88.45'),
(119, 1, 'login', 'Login berhasil', '2025-07-28 12:21:27', '192.168.88.45'),
(120, 1, 'login', 'Login berhasil', '2025-07-28 14:33:55', '192.168.88.45'),
(121, 1, 'edit_service', 'Mengubah layanan ID: 14', '2025-07-28 15:31:14', '192.168.88.45'),
(122, 1, 'edit_service', 'Mengubah layanan ID: 15', '2025-07-28 15:31:40', '192.168.88.45'),
(123, 1, 'edit_service', 'Mengubah layanan ID: 6', '2025-07-28 15:32:07', '192.168.88.45'),
(124, 1, 'logout', 'Logout dari sistem', '2025-07-28 15:52:22', '192.168.88.45'),
(125, 1, 'login', 'Login berhasil', '2025-07-28 15:55:51', '192.168.88.45'),
(126, 1, 'logout', 'Logout dari sistem', '2025-07-28 16:07:10', '192.168.88.45'),
(127, 1, 'login', 'Login berhasil', '2025-07-28 16:07:18', '192.168.88.45'),
(128, 1, 'logout', 'Logout dari sistem', '2025-07-28 16:07:25', '192.168.88.45'),
(129, 4, 'login', 'Login berhasil', '2025-07-28 16:07:31', '192.168.88.45'),
(130, 4, 'logout', 'Logout dari sistem', '2025-07-28 16:11:02', '192.168.88.45'),
(131, 4, 'login', 'Login berhasil', '2025-07-28 16:15:35', '192.168.88.45'),
(132, 4, 'logout', 'Logout dari sistem', '2025-07-28 16:17:19', '192.168.88.45'),
(133, 11, 'login', 'Login berhasil', '2025-07-28 16:17:32', '192.168.88.45'),
(134, 11, 'logout', 'Logout dari sistem', '2025-07-28 16:22:44', '192.168.88.45'),
(135, 1, 'login', 'Login berhasil', '2025-07-28 16:27:33', '192.168.88.45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `guests`
--
ALTER TABLE `guests`
  ADD PRIMARY KEY (`guest_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `reservation_id` (`reservation_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `guest_id` (`guest_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`),
  ADD UNIQUE KEY `room_number` (`room_number`),
  ADD KEY `room_type_id` (`room_type_id`);

--
-- Indexes for table `room_service_requests`
--
ALTER TABLE `room_service_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `reservation_id` (`reservation_id`);

--
-- Indexes for table `room_types`
--
ALTER TABLE `room_types`
  ADD PRIMARY KEY (`room_type_id`),
  ADD UNIQUE KEY `type_name` (`type_name`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_logs`
--
ALTER TABLE `user_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `guests`
--
ALTER TABLE `guests`
  MODIFY `guest_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=401;

--
-- AUTO_INCREMENT for table `room_service_requests`
--
ALTER TABLE `room_service_requests`
  MODIFY `request_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `room_types`
--
ALTER TABLE `room_types`
  MODIFY `room_type_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_logs`
--
ALTER TABLE `user_logs`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`);

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`guest_id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`room_type_id`);

--
-- Constraints for table `room_service_requests`
--
ALTER TABLE `room_service_requests`
  ADD CONSTRAINT `room_service_requests_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`);

--
-- Constraints for table `user_logs`
--
ALTER TABLE `user_logs`
  ADD CONSTRAINT `user_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
