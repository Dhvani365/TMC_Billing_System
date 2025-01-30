-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 28, 2025 at 07:38 PM
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
-- Database: `shopdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `bill_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount_type` enum('wholesale','selling') NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bill_items`
--

CREATE TABLE `bill_items` (
  `bill_item_id` int(11) NOT NULL,
  `bill_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `brand_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `brand_name`) VALUES
(1, 'RAJTEX'),
(2, 'RAJBEER');

-- --------------------------------------------------------

--
-- Table structure for table `catalogs`
--

CREATE TABLE `catalogs` (
  `catalog_id` int(11) NOT NULL,
  `catalog_name` varchar(255) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `rate` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `catalogs`
--

INSERT INTO `catalogs` (`catalog_id`, `catalog_name`, `brand_id`, `rate`) VALUES
(1, 'KONDITORI', 1, 1465),
(2, 'KAJARAKH', 1, 555),
(3, 'KNOORIE', 1, 1095),
(4, 'KANTHKALA - TOPAZ', 1, 1525),
(5, 'KSHASHA SILK', 1, 1360),
(6, 'KAAKSHI SILK', 1, 1095),
(7, 'KANTHKALA - LUXE', 1, 1465),
(8, 'KNOORIE - SEASONS', 1, 1095),
(9, 'KAZULE', 1, 555),
(10, 'KANTHKALA -PICHWAI', 1, 1415),
(11, 'KARSHINI SILK', 2, 1295),
(12, 'KANMANI SILK', 2, 1095),
(13, 'KANVI SILK - ROYALS ', 2, 1095),
(14, 'KAIZAA SILK', 2, 1835),
(15, 'KAROL SILK', 2, 1195),
(16, 'KANVI SILK - SENSES', 2, 1095),
(17, 'KIROZAA SILK', 2, 1890),
(18, 'KYAARI TISSUE', 2, 1360),
(19, 'KLAURA SILK', 2, 1260),
(20, 'KAMSAARA SILK', 2, 1625),
(21, 'KIAAN SILK', 2, 1525),
(22, 'KZAINAAB', 2, 1095),
(23, 'KAALA SAVOY', 2, 1195),
(24, 'KAPRI LINEN', 2, 995),
(25, 'KERNIA\'S', 2, 885),
(26, 'KALAMARI', 2, 1195),
(27, 'KALOMA', 2, 995),
(28, 'KOSHA SILK', 2, 1890),
(29, 'KOOKAL SILK', 2, 1315),
(30, 'KAALA RUBY', 2, 1195),
(31, 'KONTESSA SILK', 1, 1360);

-- --------------------------------------------------------

--
-- Table structure for table `catalog_products`
--

CREATE TABLE `catalog_products` (
  `catalog_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `catalog_products`
--

INSERT INTO `catalog_products` (`catalog_id`, `product_id`) VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17),
(3, 18),
(3, 19),
(3, 20),
(3, 21),
(3, 22),
(3, 23),
(4, 24),
(4, 25),
(4, 26),
(4, 27),
(4, 28),
(4, 29),
(4, 30),
(4, 31),
(4, 32),
(4, 33),
(5, 34),
(5, 35),
(5, 36),
(5, 37),
(5, 38),
(5, 39),
(6, 40),
(6, 41),
(6, 42),
(6, 43),
(6, 44),
(6, 45),
(7, 46),
(7, 47),
(7, 48),
(7, 49),
(7, 50),
(7, 51),
(8, 52),
(8, 53),
(8, 54),
(8, 55),
(8, 56),
(8, 57),
(9, 64),
(9, 65),
(9, 66),
(9, 67),
(9, 68),
(9, 69),
(9, 70),
(9, 71),
(9, 72),
(9, 73),
(9, 74),
(9, 75),
(9, 76),
(9, 77),
(9, 78),
(9, 79),
(9, 80),
(9, 81),
(10, 82),
(10, 83),
(10, 84),
(10, 85),
(10, 86),
(10, 87),
(11, 88),
(11, 89),
(11, 90),
(11, 91),
(11, 92),
(11, 93),
(12, 94),
(12, 95),
(12, 96),
(12, 97),
(12, 98),
(12, 99),
(12, 100),
(12, 101),
(12, 102),
(12, 103),
(13, 104),
(13, 105),
(13, 106),
(13, 107),
(13, 108),
(13, 109),
(14, 110),
(14, 111),
(14, 112),
(14, 113),
(14, 114),
(14, 115),
(15, 116),
(15, 117),
(15, 118),
(15, 119),
(15, 120),
(15, 121),
(15, 122),
(16, 123),
(16, 124),
(16, 125),
(16, 126),
(16, 127),
(16, 128),
(17, 129),
(17, 130),
(17, 131),
(17, 132),
(17, 133),
(17, 134),
(17, 135),
(17, 136),
(17, 137),
(17, 138),
(18, 139),
(18, 140),
(18, 141),
(18, 142),
(18, 143),
(18, 144),
(18, 145),
(19, 146),
(19, 147),
(19, 148),
(19, 149),
(19, 150),
(19, 151),
(20, 152),
(20, 153),
(20, 154),
(20, 155),
(20, 156),
(20, 157),
(21, 158),
(21, 159),
(21, 160),
(21, 161),
(21, 162),
(21, 163),
(22, 164),
(22, 165),
(22, 166),
(22, 167),
(22, 168),
(22, 169),
(23, 170),
(23, 171),
(23, 172),
(23, 173),
(23, 174),
(23, 175),
(24, 176),
(24, 177),
(24, 178),
(24, 179),
(24, 180),
(24, 181),
(25, 182),
(25, 183),
(25, 184),
(25, 185),
(25, 186),
(25, 187),
(25, 188),
(25, 189),
(25, 190),
(25, 191),
(26, 192),
(26, 193),
(26, 194),
(26, 195),
(26, 196),
(26, 197),
(27, 198),
(27, 199),
(27, 200),
(27, 201),
(27, 202),
(27, 203),
(28, 204),
(28, 205),
(28, 206),
(28, 207),
(28, 208),
(28, 209),
(29, 210),
(29, 211),
(29, 212),
(29, 213),
(29, 214),
(29, 215),
(30, 216),
(30, 217),
(30, 218),
(30, 219),
(30, 220),
(30, 221),
(31, 58),
(31, 59),
(31, 60),
(31, 61),
(31, 62),
(31, 63);

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `contact_info` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`client_id`, `client_name`, `contact_info`) VALUES
(1, 'MARUTI', NULL),
(2, 'TOYOTA', NULL),
(3, 'CHREVOLET', NULL),
(4, 'SUZUKI', NULL),
(5, 'HONDA', NULL),
(6, 'KIA', NULL),
(7, 'ROYAL ENFIELD', NULL),
(8, 'DUCATI', NULL),
(9, 'VENUE', NULL),
(10, 'BALENO', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `client_discount_structure`
--

CREATE TABLE `client_discount_structure` (
  `clientID` int(11) NOT NULL,
  `party_name` varchar(255) NOT NULL,
  `RAJ_TEX` decimal(10,2) DEFAULT NULL,
  `RAJBEER` decimal(10,2) DEFAULT NULL,
  `SOSY` decimal(10,2) DEFAULT NULL,
  `REWAA` decimal(10,2) DEFAULT NULL,
  `KIMORA_SAREES` decimal(10,2) DEFAULT NULL,
  `KIMORA_SUITS` decimal(10,2) DEFAULT NULL,
  `LT` decimal(10,2) DEFAULT NULL,
  `SHBHSHREE` decimal(10,2) DEFAULT NULL,
  `APPLE` decimal(10,2) DEFAULT NULL,
  `SR` decimal(10,2) DEFAULT NULL,
  `RAJPATH` decimal(10,2) DEFAULT NULL,
  `VRINDAVAN` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_discount_structure`
--

INSERT INTO `client_discount_structure` (`clientID`, `party_name`, `RAJ_TEX`, `RAJBEER`, `SOSY`, `REWAA`, `KIMORA_SAREES`, `KIMORA_SUITS`, `LT`, `SHBHSHREE`, `APPLE`, `SR`, `RAJPATH`, `VRINDAVAN`) VALUES
(1, 'MARUTI', 5.00, 5.00, 5.00, 5.00, 5.00, NULL, 5.00, 5.00, NULL, NULL, 5.00, NULL),
(2, 'TOYOTA', 5.00, 5.00, 5.00, 15.00, 10.00, NULL, NULL, 10.00, NULL, 7.00, NULL, NULL),
(3, 'CHREVOLET', 5.00, 5.00, 5.00, 10.00, 10.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'SUZUKI', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'HONDA', 10.00, 10.00, 5.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'KIA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'ROYAL ENFIELD', 6.00, 6.00, 6.00, 6.00, 6.00, NULL, NULL, 6.00, NULL, NULL, NULL, NULL),
(8, 'DUCATI', 10.00, 10.00, NULL, NULL, 11.00, NULL, NULL, 5.00, NULL, 7.00, NULL, NULL),
(9, 'VENUE', NULL, NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, NULL, 5.00, NULL),
(10, 'BALENO', 12.00, 12.00, NULL, 12.00, 12.00, NULL, NULL, 10.00, NULL, 10.00, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `wholesale_price` decimal(10,2) DEFAULT NULL,
  `selling_price` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `wholesale_price`, `selling_price`, `description`) VALUES
(2, '385001', NULL, NULL, NULL),
(3, '385002', NULL, NULL, NULL),
(4, '385003', NULL, NULL, NULL),
(5, '385004', NULL, NULL, NULL),
(6, '385005', NULL, NULL, NULL),
(7, '385006', NULL, NULL, NULL),
(8, '386001', NULL, NULL, NULL),
(9, '386002', NULL, NULL, NULL),
(10, '386003', NULL, NULL, NULL),
(11, '386004', NULL, NULL, NULL),
(12, '386005', NULL, NULL, NULL),
(13, '386006', NULL, NULL, NULL),
(14, '386007', NULL, NULL, NULL),
(15, '386008', NULL, NULL, NULL),
(16, '386009', NULL, NULL, NULL),
(17, '386010', NULL, NULL, NULL),
(18, '387001', NULL, NULL, NULL),
(19, '387002', NULL, NULL, NULL),
(20, '387003', NULL, NULL, NULL),
(21, '387004', NULL, NULL, NULL),
(22, '387005', NULL, NULL, NULL),
(23, '387006', NULL, NULL, NULL),
(24, '388001', NULL, NULL, NULL),
(25, '388002', NULL, NULL, NULL),
(26, '388003', NULL, NULL, NULL),
(27, '388004', NULL, NULL, NULL),
(28, '388005', NULL, NULL, NULL),
(29, '388006', NULL, NULL, NULL),
(30, '388007', NULL, NULL, NULL),
(31, '388008', NULL, NULL, NULL),
(32, '388009', NULL, NULL, NULL),
(33, '388010', NULL, NULL, NULL),
(34, '389001', NULL, NULL, NULL),
(35, '389002', NULL, NULL, NULL),
(36, '389003', NULL, NULL, NULL),
(37, '389004', NULL, NULL, NULL),
(38, '389005', NULL, NULL, NULL),
(39, '389006', NULL, NULL, NULL),
(40, '390001', NULL, NULL, NULL),
(41, '390002', NULL, NULL, NULL),
(42, '390003', NULL, NULL, NULL),
(43, '390004', NULL, NULL, NULL),
(44, '390005', NULL, NULL, NULL),
(45, '390006', NULL, NULL, NULL),
(46, '391001', NULL, NULL, NULL),
(47, '391002', NULL, NULL, NULL),
(48, '348001', NULL, NULL, NULL),
(49, '391004', NULL, NULL, NULL),
(50, '391005', NULL, NULL, NULL),
(51, '391006', NULL, NULL, NULL),
(52, '394001', NULL, NULL, NULL),
(53, '394002', NULL, NULL, NULL),
(54, '394003', NULL, NULL, NULL),
(55, '394004', NULL, NULL, NULL),
(56, '394005', NULL, NULL, NULL),
(57, '394006', NULL, NULL, NULL),
(58, '395001', NULL, NULL, NULL),
(59, '395002', NULL, NULL, NULL),
(60, '395003', NULL, NULL, NULL),
(61, '395004', NULL, NULL, NULL),
(62, '395005', NULL, NULL, NULL),
(63, '395006', NULL, NULL, NULL),
(64, '396001', NULL, NULL, NULL),
(65, '396002', NULL, NULL, NULL),
(66, '396003', NULL, NULL, NULL),
(67, '396004', NULL, NULL, NULL),
(68, '396005', NULL, NULL, NULL),
(69, '396006', NULL, NULL, NULL),
(70, '396007', NULL, NULL, NULL),
(71, '396008', NULL, NULL, NULL),
(72, '396009', NULL, NULL, NULL),
(73, '396010', NULL, NULL, NULL),
(74, '396011', NULL, NULL, NULL),
(75, '396012', NULL, NULL, NULL),
(76, '396013', NULL, NULL, NULL),
(77, '396014', NULL, NULL, NULL),
(78, '396015', NULL, NULL, NULL),
(79, '396016', NULL, NULL, NULL),
(80, '396017', NULL, NULL, NULL),
(81, '396018', NULL, NULL, NULL),
(82, '397001', NULL, NULL, NULL),
(83, '397002', NULL, NULL, NULL),
(84, '397003', NULL, NULL, NULL),
(85, '397004', NULL, NULL, NULL),
(86, '397005', NULL, NULL, NULL),
(87, '397006', NULL, NULL, NULL),
(88, '1001', NULL, NULL, NULL),
(89, '1002', NULL, NULL, NULL),
(90, '1003', NULL, NULL, NULL),
(91, '1004', NULL, NULL, NULL),
(92, '1005', NULL, NULL, NULL),
(93, '1006', NULL, NULL, NULL),
(94, '2001', NULL, NULL, NULL),
(95, '2002', NULL, NULL, NULL),
(96, '2003', NULL, NULL, NULL),
(97, '2004', NULL, NULL, NULL),
(98, '2005', NULL, NULL, NULL),
(99, '2006', NULL, NULL, NULL),
(100, '2007', NULL, NULL, NULL),
(101, '2008', NULL, NULL, NULL),
(102, '2009', NULL, NULL, NULL),
(103, '2010', NULL, NULL, NULL),
(104, '3001', NULL, NULL, NULL),
(105, '3002', NULL, NULL, NULL),
(106, '3003', NULL, NULL, NULL),
(107, '3004', NULL, NULL, NULL),
(108, '3005', NULL, NULL, NULL),
(109, '3006', NULL, NULL, NULL),
(110, '4001', NULL, NULL, NULL),
(111, '4002', NULL, NULL, NULL),
(112, '4003', NULL, NULL, NULL),
(113, '4004', NULL, NULL, NULL),
(114, '4005', NULL, NULL, NULL),
(115, '4006', NULL, NULL, NULL),
(116, '5001', NULL, NULL, NULL),
(117, '5002', NULL, NULL, NULL),
(118, '5003', NULL, NULL, NULL),
(119, '5004', NULL, NULL, NULL),
(120, '5005', NULL, NULL, NULL),
(121, '5006', NULL, NULL, NULL),
(122, '5007', NULL, NULL, NULL),
(123, '6001', NULL, NULL, NULL),
(124, '6002', NULL, NULL, NULL),
(125, '6003', NULL, NULL, NULL),
(126, '6004', NULL, NULL, NULL),
(127, '6005', NULL, NULL, NULL),
(128, '6006', NULL, NULL, NULL),
(129, '7001', NULL, NULL, NULL),
(130, '7002', NULL, NULL, NULL),
(131, '7003', NULL, NULL, NULL),
(132, '7004', NULL, NULL, NULL),
(133, '7005', NULL, NULL, NULL),
(134, '7006', NULL, NULL, NULL),
(135, '7007', NULL, NULL, NULL),
(136, '7008', NULL, NULL, NULL),
(137, '7009', NULL, NULL, NULL),
(138, '7010', NULL, NULL, NULL),
(139, '8001', NULL, NULL, NULL),
(140, '8002', NULL, NULL, NULL),
(141, '8003', NULL, NULL, NULL),
(142, '8004', NULL, NULL, NULL),
(143, '8005', NULL, NULL, NULL),
(144, '8006', NULL, NULL, NULL),
(145, '8007', NULL, NULL, NULL),
(146, '10001', NULL, NULL, NULL),
(147, '10002', NULL, NULL, NULL),
(148, '10003', NULL, NULL, NULL),
(149, '10004', NULL, NULL, NULL),
(150, '10005', NULL, NULL, NULL),
(151, '10006', NULL, NULL, NULL),
(152, '11001', NULL, NULL, NULL),
(153, '11002', NULL, NULL, NULL),
(154, '11003', NULL, NULL, NULL),
(155, '11004', NULL, NULL, NULL),
(156, '11005', NULL, NULL, NULL),
(157, '11006', NULL, NULL, NULL),
(158, '12001', NULL, NULL, NULL),
(159, '12002', NULL, NULL, NULL),
(160, '12003', NULL, NULL, NULL),
(161, '12004', NULL, NULL, NULL),
(162, '12005', NULL, NULL, NULL),
(163, '12006', NULL, NULL, NULL),
(164, '13001', NULL, NULL, NULL),
(165, '13002', NULL, NULL, NULL),
(166, '13003', NULL, NULL, NULL),
(167, '13004', NULL, NULL, NULL),
(168, '13005', NULL, NULL, NULL),
(169, '13006', NULL, NULL, NULL),
(170, '14001', NULL, NULL, NULL),
(171, '14002', NULL, NULL, NULL),
(172, '14003', NULL, NULL, NULL),
(173, '14004', NULL, NULL, NULL),
(174, '14005', NULL, NULL, NULL),
(175, '14006', NULL, NULL, NULL),
(176, '15001', NULL, NULL, NULL),
(177, '15002', NULL, NULL, NULL),
(178, '15003', NULL, NULL, NULL),
(179, '15004', NULL, NULL, NULL),
(180, '15005', NULL, NULL, NULL),
(181, '15006', NULL, NULL, NULL),
(182, '16001', NULL, NULL, NULL),
(183, '16002', NULL, NULL, NULL),
(184, '16003', NULL, NULL, NULL),
(185, '16004', NULL, NULL, NULL),
(186, '16005', NULL, NULL, NULL),
(187, '16006', NULL, NULL, NULL),
(188, '16007', NULL, NULL, NULL),
(189, '16008', NULL, NULL, NULL),
(190, '16009', NULL, NULL, NULL),
(191, '16010', NULL, NULL, NULL),
(192, '17001', NULL, NULL, NULL),
(193, '17002', NULL, NULL, NULL),
(194, '17003', NULL, NULL, NULL),
(195, '17004', NULL, NULL, NULL),
(196, '17005', NULL, NULL, NULL),
(197, '17006', NULL, NULL, NULL),
(198, '18001', NULL, NULL, NULL),
(199, '18002', NULL, NULL, NULL),
(200, '18003', NULL, NULL, NULL),
(201, '18004', NULL, NULL, NULL),
(202, '18005', NULL, NULL, NULL),
(203, '18006', NULL, NULL, NULL),
(204, '19001', NULL, NULL, NULL),
(205, '19002', NULL, NULL, NULL),
(206, '19003', NULL, NULL, NULL),
(207, '19004', NULL, NULL, NULL),
(208, '19005', NULL, NULL, NULL),
(209, '19006', NULL, NULL, NULL),
(210, '20001', NULL, NULL, NULL),
(211, '20002', NULL, NULL, NULL),
(212, '20003', NULL, NULL, NULL),
(213, '20004', NULL, NULL, NULL),
(214, '20005', NULL, NULL, NULL),
(215, '20006', NULL, NULL, NULL),
(216, '21001', NULL, NULL, NULL),
(217, '21002', NULL, NULL, NULL),
(218, '21003', NULL, NULL, NULL),
(219, '21004', NULL, NULL, NULL),
(220, '21005', NULL, NULL, NULL),
(221, '21006', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `bill_items`
--
ALTER TABLE `bill_items`
  ADD PRIMARY KEY (`bill_item_id`),
  ADD KEY `bill_id` (`bill_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `catalogs`
--
ALTER TABLE `catalogs`
  ADD PRIMARY KEY (`catalog_id`),
  ADD KEY `fk_brand_id` (`brand_id`);

--
-- Indexes for table `catalog_products`
--
ALTER TABLE `catalog_products`
  ADD PRIMARY KEY (`catalog_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`);

--
-- Indexes for table `client_discount_structure`
--
ALTER TABLE `client_discount_structure`
  ADD PRIMARY KEY (`clientID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bill_items`
--
ALTER TABLE `bill_items`
  MODIFY `bill_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `catalogs`
--
ALTER TABLE `catalogs`
  MODIFY `catalog_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=222;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE;

--
-- Constraints for table `bill_items`
--
ALTER TABLE `bill_items`
  ADD CONSTRAINT `bill_items_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bill_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `catalogs`
--
ALTER TABLE `catalogs`
  ADD CONSTRAINT `fk_brand_id` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `catalog_products`
--
ALTER TABLE `catalog_products`
  ADD CONSTRAINT `catalog_products_ibfk_1` FOREIGN KEY (`catalog_id`) REFERENCES `catalogs` (`catalog_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `catalog_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `client_discount_structure`
--
ALTER TABLE `client_discount_structure`
  ADD CONSTRAINT `client_discount_structure_ibfk_1` FOREIGN KEY (`clientID`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
