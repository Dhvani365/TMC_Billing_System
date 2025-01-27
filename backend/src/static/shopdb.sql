-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 27, 2025 at 05:27 PM
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
  `wholesale_price` decimal(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT;

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
