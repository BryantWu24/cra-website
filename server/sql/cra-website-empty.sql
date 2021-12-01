-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2021-12-01 09:15:20
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
('7d67a76b-8674-43eb-8e77-f92da5ebe847', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'c2f3dafe-46bf-4a72-9f7c-d3eac8120e41'),
('e12f11b6-f275-49ea-aba5-0122e7969a93', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'bd6495a3-9bc5-4cbf-b936-b08e1c0a3263'),
('ea3b8aec-143f-49f0-8267-4ee573ed8218', 'b68110de-98a5-4922-83d4-ee76da075f7d', 'bd6495a3-9bc5-4cbf-b936-b08e1c0a3263');

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_ingredients`
--

CREATE TABLE `bakery_ingredients` (
  `FBakeryIngredientId` varchar(36) NOT NULL,
  `FBakeryMaterialId` varchar(36) NOT NULL,
  `FBakeryMaterialName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_item`
--

CREATE TABLE `bakery_item` (
  `FBakeryItemId` varchar(36) NOT NULL,
  `FBakeryItemName` varchar(30) NOT NULL,
  `FBakeryItemUrl` varchar(350) NOT NULL,
  `FUnitPrice` int(100) NOT NULL,
  `FStorageCount` int(100) NOT NULL,
  `FStorageDays` int(100) NOT NULL,
  `FStorageMethod` varchar(300) NOT NULL,
  `FBakeryIngredientId` varchar(36) NOT NULL,
  `FUpdateTime` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
('4fa755ee-40cd-456e-a6cd-1b11b842bc0e', '鮮奶');

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_order`
--

CREATE TABLE `bakery_order` (
  `FOrderId` varchar(36) NOT NULL,
  `FOrderNumber` varchar(20) NOT NULL,
  `FUserId` varchar(36) NOT NULL,
  `FOrderStatusId` varchar(36) NOT NULL,
  `FTotalPrice` int(100) NOT NULL,
  `FCreateDate` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_order_detail`
--

CREATE TABLE `bakery_order_detail` (
  `FOrderDetailId` varchar(36) NOT NULL,
  `FOrderId` varchar(36) NOT NULL,
  `FBakeryItemId` varchar(36) NOT NULL,
  `FBakeryItemName` varchar(20) NOT NULL,
  `FCount` int(10) NOT NULL,
  `FUnitPrice` int(10) NOT NULL,
  `FTotalPrice` int(10) NOT NULL,
  `FCreateTime` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_order_status`
--

CREATE TABLE `bakery_order_status` (
  `FOrderStatusId` varchar(36) NOT NULL,
  `FOrderStatusName` varchar(10) NOT NULL,
  `FOrder` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `bakery_order_status`
--

INSERT INTO `bakery_order_status` (`FOrderStatusId`, `FOrderStatusName`, `FOrder`) VALUES
('aeff66f8-90df-43f4-874f-6192561ec115', '備料中', 2),
('f8f46d96-a98b-4113-9cb0-88ff32e81dc1', '製作中', 3),
('8c2101d9-5934-4e80-bae2-37053d04fe76', '待出貨', 4),
('7df08db2-91f1-41ec-8f86-60bcb7a3564e', '等待確認訂單', 1),
('778248e2-d5f3-4927-84c5-43184e6acc3c', '已完成', 5);

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
('026eebc2-e025-4390-958c-78e86f0516a0', '烘焙坊', 'Bakery'),
('63d3834a-9814-45e2-8995-a11512bbc608', '儀錶板', 'Dashboard'),
('fb3ae05d-030b-4ba0-8dc6-9e0f65808bc6', '烘焙坊後台系統', 'Bakery Manage'),
('ac03a4ab-8432-402a-8bde-449a2e276303', '工具區', 'Tools'),
('c2f3dafe-46bf-4a72-9f7c-d3eac8120e41', '資料庫管理', 'Database'),
('bd6495a3-9bc5-4cbf-b936-b08e1c0a3263', '烘焙坊訂單系統', 'Bakery Order');

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
('86725079-b11f-4076-b4b4-a8a5bc9a351d', 'BakeryUser', 0, '08292820-6f86-4566-bbb2-af267187ab1b', 222, 'bakeryuser', '111111', 'female', '2021-10-26 16:34:26.000000', ''),
('d3754727-2d2d-4833-a7c6-c77a023dde2c', '快速登入測試', 1, '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 0, 'a', 'a', 'male', '2021-11-15 10:02:24.217654', '');

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
