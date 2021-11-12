-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2021-11-12 09:15:59
-- 伺服器版本： 10.4.21-MariaDB
-- PHP 版本： 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫: `cra-website`
--

-- --------------------------------------------------------

--
-- 資料表結構 `auth`
--

CREATE TABLE `auth` (
  `FAuthId` varchar(36) NOT NULL,
  `FRoleId` varchar(36) NOT NULL,
  `FListId` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `auth`
--

INSERT INTO `auth` (`FAuthId`, `FRoleId`, `FListId`) VALUES
('3b540d20-8aca-424c-8437-920d2e9e7428', '08292820-6f86-4566-bbb2-af267187ab1b', '026eebc2-e025-4390-958c-78e86f0516a0'),
('0be4ee7c-b1a0-4059-b237-36040de6dc89', 'b68110de-98a5-4922-83d4-ee76da075f7d', '026eebc2-e025-4390-958c-78e86f0516a0'),
('3c962bd9-22e8-4b09-940f-c4d7e9f1b463', 'b68110de-98a5-4922-83d4-ee76da075f7d', 'fb3ae05d-030b-4ba0-8dc6-9e0f65808bc6'),
('06f6d77d-0d31-4ae5-9e16-172dfa763724', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', '026eebc2-e025-4390-958c-78e86f0516a0'),
('a84bafbf-9a15-4deb-8dd2-b219da3659a1', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'fb3ae05d-030b-4ba0-8dc6-9e0f65808bc6'),
('966be30f-1bc5-40f6-8915-3f86ced797f7', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', '63d3834a-9814-45e2-8995-a11512bbc608'),
('11717fc0-4cde-4a1a-bfbc-0a56c04b358a', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'ac03a4ab-8432-402a-8bde-449a2e276303'),
('7d67a76b-8674-43eb-8e77-f92da5ebe847', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'c2f3dafe-46bf-4a72-9f7c-d3eac8120e41');

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_ingredients`
--

CREATE TABLE `bakery_ingredients` (
  `FBakeryIngredientId` varchar(36) NOT NULL,
  `FBakeryMaterialId` varchar(36) NOT NULL,
  `FBakeryMaterialName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `bakery_ingredients`
--

INSERT INTO `bakery_ingredients` (`FBakeryIngredientId`, `FBakeryMaterialId`, `FBakeryMaterialName`) VALUES
('d9d58f47-b562-43c1-b0e5-37c4e3cd62d0', '4fa755ee-40cd-456e-a6cd-1b11b842bc0e', '鮮奶'),
('47913586-a805-48bb-bc85-63d6810da3eb', 'e4dfea9d-c025-4143-b2a6-2e3610dc7d50', '無鹽奶油'),
('849cc311-e984-4974-afb0-a7963074bacf', 'a973149c-6194-45e1-a90e-8084c097c3a3', '低筋麵粉'),
('05a2272a-8a96-4592-8c32-68c2365cf421', '7299b5ba-439a-494a-9c07-99d46e9d47e3', '細砂糖'),
('05a2272a-8a96-4592-8c32-68c2365cf421', 'e2ff9e41-620b-43cc-a362-8e20cf16c3b8', '33'),
('05a2272a-8a96-4592-8c32-68c2365cf421', 'c6354d52-738c-4f07-92dc-7e413687b3fd', 'test1');

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_item`
--

CREATE TABLE `bakery_item` (
  `FBakeryItemId` varchar(36) NOT NULL,
  `FBakeryItemName` varchar(30) NOT NULL,
  `FUnitPrice` int(100) NOT NULL,
  `FStorageCount` int(100) NOT NULL,
  `FStorageDays` int(100) NOT NULL,
  `FStorageMethod` varchar(300) NOT NULL,
  `FBakeryIngredientId` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `bakery_item`
--

INSERT INTO `bakery_item` (`FBakeryItemId`, `FBakeryItemName`, `FUnitPrice`, `FStorageCount`, `FStorageDays`, `FStorageMethod`, `FBakeryIngredientId`) VALUES
('29a1fc2e-815d-4440-b449-33c6f58ea5da', '111', 111, 10, 11, '11', 'd9d58f47-b562-43c1-b0e5-37c4e3cd62d0'),
('d70fe723-1432-4651-a106-6f070994aac1', '444', 4, 10, 44, '44', '47913586-a805-48bb-bc85-63d6810da3eb'),
('03ff4567-a03d-4721-bc53-265bc0dcf741', '55', 55, 10, 55, '12小時內未食用完必須冰冷藏', '05a2272a-8a96-4592-8c32-68c2365cf421');

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_material`
--

CREATE TABLE `bakery_material` (
  `FBakeryMaterialId` varchar(36) NOT NULL,
  `FBakeryMaterialName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `bakery_material`
--

INSERT INTO `bakery_material` (`FBakeryMaterialId`, `FBakeryMaterialName`) VALUES
('7299b5ba-439a-494a-9c07-99d46e9d47e3', '細砂糖'),
('680008c2-61f7-4720-a950-fd5754f9aa03', '高筋麵粉'),
('a973149c-6194-45e1-a90e-8084c097c3a3', '低筋麵粉'),
('e4dfea9d-c025-4143-b2a6-2e3610dc7d50', '無鹽奶油'),
('4fa755ee-40cd-456e-a6cd-1b11b842bc0e', '鮮奶'),
('e2ff9e41-620b-43cc-a362-8e20cf16c3b8', '33'),
('c6354d52-738c-4f07-92dc-7e413687b3fd', 'test1');

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_order`
--

CREATE TABLE `bakery_order` (
  `FOrderId` varchar(36) NOT NULL,
  `FUserId` varchar(36) NOT NULL,
  `FTotalPrice` int(100) NOT NULL,
  `FCreateDate` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `bakery_order`
--

INSERT INTO `bakery_order` (`FOrderId`, `FUserId`, `FTotalPrice`, `FCreateDate`) VALUES
('e514aa92-a18e-44df-99da-c952262cf228', '19451217-1dd2-11b2-8000-080027b246c3', 541, '2021-11-10 11:40:59.156728'),
('27855af3-7a5e-42c1-b9a9-d2f1075dd144', '19451217-1dd2-11b2-8000-080027b246c3', 721, '2021-11-10 11:48:13.256836'),
('d983fc6c-a3bd-4cf6-91a5-6f71ad9769ec', '19451217-1dd2-11b2-8000-080027b246c3', 1, '2021-11-10 11:50:09.818422'),
('21b1ace4-95d5-4c4a-b09b-c463d7d8c6f9', '19451217-1dd2-11b2-8000-080027b246c3', 630, '2021-11-10 11:50:40.252173'),
('77231861-c05c-4f2d-91f8-412193e0c78f', '19451217-1dd2-11b2-8000-080027b246c3', 4, '2021-11-11 15:22:29.585535'),
('12e1126f-16e1-4ba4-b72c-425b910964b3', '19451217-1dd2-11b2-8000-080027b246c3', 4, '2021-11-11 15:22:51.054141'),
('3c17c517-a2ad-4e5d-88bd-ae19b6ede172', '19451217-1dd2-11b2-8000-080027b246c3', 4, '2021-11-11 15:22:59.981138'),
('a49954b6-d85b-42e1-afc6-38cbf77efc79', '19451217-1dd2-11b2-8000-080027b246c3', 4, '2021-11-11 15:23:03.181458'),
('0473d26e-b793-40fd-8236-8a0e0ce195a2', '19451217-1dd2-11b2-8000-080027b246c3', 4, '2021-11-11 15:23:41.750266'),
('703cd09b-7bbd-4f10-af17-96f77edb30e2', '19451217-1dd2-11b2-8000-080027b246c3', 110, '2021-11-11 17:46:16.354089');

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_order_detail`
--

CREATE TABLE `bakery_order_detail` (
  `FOrderDetailId` varchar(36) NOT NULL,
  `FOrderId` varchar(36) NOT NULL,
  `FBakeryItemId` varchar(36) NOT NULL,
  `FName` varchar(20) NOT NULL,
  `FCount` int(10) NOT NULL,
  `FUnitPrice` int(10) NOT NULL,
  `FTotalPrice` int(10) NOT NULL,
  `FCreateTime` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `bakery_order_detail`
--

INSERT INTO `bakery_order_detail` (`FOrderDetailId`, `FOrderId`, `FBakeryItemId`, `FName`, `FCount`, `FUnitPrice`, `FTotalPrice`, `FCreateTime`) VALUES
('1c7c94c2-0003-41cd-a731-f64970352742', 'e514aa92-a18e-44df-99da-c952262cf228', '13af2503-37f1-4c79-845d-3a7f95b30b73', '吐司', 6, 90, 540, '2021-11-10 11:40:59.172686'),
('541a7c1d-1558-4d2b-bdc3-3a0bc9947088', 'e514aa92-a18e-44df-99da-c952262cf228', '361fa9ca-bdcb-4bcb-91cf-f48952d0b8ec', 'asd', 1, 1, 1, '2021-11-10 11:40:59.172686'),
('fd674ea0-41f3-4d7c-84b2-7ce436a2a584', '27855af3-7a5e-42c1-b9a9-d2f1075dd144', '361fa9ca-bdcb-4bcb-91cf-f48952d0b8ec', 'asd', 1, 1, 1, '2021-11-10 11:48:13.262265'),
('ede6e42e-d63a-45c3-8058-fb64a3f37209', '27855af3-7a5e-42c1-b9a9-d2f1075dd144', '13af2503-37f1-4c79-845d-3a7f95b30b73', '吐司', 8, 90, 720, '2021-11-10 11:48:13.262265'),
('03b90901-a683-446b-ad82-147fac6424ec', 'd983fc6c-a3bd-4cf6-91a5-6f71ad9769ec', 'c89f69f2-2e21-40ab-bdc8-182ae54d0c59', '麵包一', 1, 1, 1, '2021-11-10 11:50:09.821673'),
('d3166be7-13b0-4466-98c8-2cd9a75267e6', '21b1ace4-95d5-4c4a-b09b-c463d7d8c6f9', '13af2503-37f1-4c79-845d-3a7f95b30b73', '吐司', 7, 90, 630, '2021-11-10 11:50:40.256922');

-- --------------------------------------------------------

--
-- 資料表結構 `list`
--

CREATE TABLE `list` (
  `FListId` varchar(36) NOT NULL,
  `FListName` varchar(20) NOT NULL,
  `FListKey` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `list`
--

INSERT INTO `list` (`FListId`, `FListName`, `FListKey`) VALUES
('026eebc2-e025-4390-958c-78e86f0516a0', '麵包坊', 'Bakery'),
('63d3834a-9814-45e2-8995-a11512bbc608', '儀錶板', 'Dashboard'),
('fb3ae05d-030b-4ba0-8dc6-9e0f65808bc6', '麵包坊管理平台', 'Bakery Manage'),
('ac03a4ab-8432-402a-8bde-449a2e276303', '工具區', 'Tools'),
('c2f3dafe-46bf-4a72-9f7c-d3eac8120e41', '資料庫管理', 'Database');

-- --------------------------------------------------------

--
-- 資料表結構 `role`
--

CREATE TABLE `role` (
  `FRoleId` varchar(36) NOT NULL,
  `FRoleName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `role`
--

INSERT INTO `role` (`FRoleId`, `FRoleName`) VALUES
('08292820-6f86-4566-bbb2-af267187ab1b', 'BakeryUser'),
('9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'Administrator'),
('b68110de-98a5-4922-83d4-ee76da075f7d', 'BakeryManage');

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `FUserId` varchar(36) NOT NULL,
  `FUserName` varchar(20) NOT NULL,
  `FEmail` int(11) NOT NULL,
  `FRoleId` varchar(36) NOT NULL,
  `FPhone` int(10) NOT NULL,
  `FAccount` varchar(15) NOT NULL,
  `FPassword` varchar(15) NOT NULL,
  `FGender` varchar(6) NOT NULL,
  `FCreateTime` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `FAvatar` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`FUserId`, `FUserName`, `FEmail`, `FRoleId`, `FPhone`, `FAccount`, `FPassword`, `FGender`, `FCreateTime`, `FAvatar`) VALUES
('06423d2c-1d62-429b-b6f9-de0a8d4ea95f', 'Bakery Manager', 0, 'b68110de-98a5-4922-83d4-ee76da075f7d', 9, 'bakerymanager', '111111', 'male', '2021-10-28 11:28:07.903053', ''),
('19451217-1dd2-11b2-8000-080027b246c3', 'Administrator', 0, '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 922123456, 'admin', '111111', 'male', '2021-10-26 16:34:26.000000', ''),
('86725079-b11f-4076-b4b4-a8a5bc9a351d', 'BakeryUser', 0, '08292820-6f86-4566-bbb2-af267187ab1b', 222, 'bakeryuser', '111111', 'female', '2021-10-26 16:34:26.000000', '');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`FRoleId`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`FUserId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
