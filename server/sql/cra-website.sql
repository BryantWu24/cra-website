-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2021-11-09 11:20:14
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
  `FRoleName` varchar(20) NOT NULL,
  `FListId` varchar(36) NOT NULL,
  `FListKey` varchar(20) NOT NULL,
  `FListName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `auth`
--

INSERT INTO `auth` (`FAuthId`, `FRoleId`, `FRoleName`, `FListId`, `FListKey`, `FListName`) VALUES
('3b540d20-8aca-424c-8437-920d2e9e7428', '08292820-6f86-4566-bbb2-af267187ab1b', 'BakeryUser', '026eebc2-e025-4390-958c-78e86f0516a0', 'Bakery', '麵包坊'),
('0be4ee7c-b1a0-4059-b237-36040de6dc89', 'b68110de-98a5-4922-83d4-ee76da075f7d', 'BakeryManager', '026eebc2-e025-4390-958c-78e86f0516a0', 'Bakery', '麵包坊'),
('3c962bd9-22e8-4b09-940f-c4d7e9f1b463', 'b68110de-98a5-4922-83d4-ee76da075f7d', 'BakeryManager', 'fb3ae05d-030b-4ba0-8dc6-9e0f65808bc6', 'Bakery Manage', '麵包坊管理平台'),
('06f6d77d-0d31-4ae5-9e16-172dfa763724', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'Administrator', '026eebc2-e025-4390-958c-78e86f0516a0', 'Bakery', '麵包坊'),
('a84bafbf-9a15-4deb-8dd2-b219da3659a1', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'Administrator', 'fb3ae05d-030b-4ba0-8dc6-9e0f65808bc6', 'Bakery Manage', '麵包坊管理平台'),
('966be30f-1bc5-40f6-8915-3f86ced797f7', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'Administrator', '63d3834a-9814-45e2-8995-a11512bbc608', 'Dashboard', '儀錶板'),
('11717fc0-4cde-4a1a-bfbc-0a56c04b358a', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'Administrator', 'ac03a4ab-8432-402a-8bde-449a2e276303', 'Tool', '工具區'),
('7d67a76b-8674-43eb-8e77-f92da5ebe847', '9e2b52eb-b05f-4b1a-994a-7c227bb30913', 'Administrator', 'c2f3dafe-46bf-4a72-9f7c-d3eac8120e41', 'Database', '資料庫管理');

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
('d2c1f75b-1043-496c-ac7b-b130e222e1da', '7299b5ba-439a-494a-9c07-99d46e9d47e3', '細砂糖'),
('d2c1f75b-1043-496c-ac7b-b130e222e1da', '4fa755ee-40cd-456e-a6cd-1b11b842bc0e', '鮮奶'),
('d2c1f75b-1043-496c-ac7b-b130e222e1da', '680008c2-61f7-4720-a950-fd5754f9aa03', '高筋麵粉'),
('d2c1f75b-1043-496c-ac7b-b130e222e1da', 'a973149c-6194-45e1-a90e-8084c097c3a3', '低筋麵粉'),
('bdef2f5a-3209-4dce-a929-d6556833f2f6', '680008c2-61f7-4720-a950-fd5754f9aa03', '高筋麵粉'),
('bdef2f5a-3209-4dce-a929-d6556833f2f6', 'e4dfea9d-c025-4143-b2a6-2e3610dc7d50', '無鹽奶油'),
('bdef2f5a-3209-4dce-a929-d6556833f2f6', '4fa755ee-40cd-456e-a6cd-1b11b842bc0e', '鮮奶'),
('8a07656e-2f66-4172-80c0-f7e604365a8e', 'e4dfea9d-c025-4143-b2a6-2e3610dc7d50', '無鹽奶油'),
('6c51ae31-ed2c-49c8-8e1d-acf6d496a7a2', 'a973149c-6194-45e1-a90e-8084c097c3a3', '低筋麵粉'),
('6c51ae31-ed2c-49c8-8e1d-acf6d496a7a2', '4fa755ee-40cd-456e-a6cd-1b11b842bc0e', '鮮奶'),
('7b961300-7d0a-4916-83eb-20b6b581ede1', '680008c2-61f7-4720-a950-fd5754f9aa03', '高筋麵粉'),
('7b961300-7d0a-4916-83eb-20b6b581ede1', 'e4dfea9d-c025-4143-b2a6-2e3610dc7d50', '無鹽奶油'),
('94f634fc-e870-479d-bacd-07002d0b3c87', '7299b5ba-439a-494a-9c07-99d46e9d47e3', '細砂糖'),
('94f634fc-e870-479d-bacd-07002d0b3c87', '680008c2-61f7-4720-a950-fd5754f9aa03', '高筋麵粉'),
('94f634fc-e870-479d-bacd-07002d0b3c87', 'a973149c-6194-45e1-a90e-8084c097c3a3', '低筋麵粉'),
('94f634fc-e870-479d-bacd-07002d0b3c87', 'e4dfea9d-c025-4143-b2a6-2e3610dc7d50', '無鹽奶油'),
('fede6587-8185-4360-8d81-28d9ce75c4b3', '7299b5ba-439a-494a-9c07-99d46e9d47e3', '細砂糖'),
('fede6587-8185-4360-8d81-28d9ce75c4b3', 'a973149c-6194-45e1-a90e-8084c097c3a3', '低筋麵粉'),
('fede6587-8185-4360-8d81-28d9ce75c4b3', '4fa755ee-40cd-456e-a6cd-1b11b842bc0e', '鮮奶'),
('f6518055-5d9b-4300-b351-5fcc4ee1b2c1', 'a973149c-6194-45e1-a90e-8084c097c3a3', '低筋麵粉'),
('f6518055-5d9b-4300-b351-5fcc4ee1b2c1', '4fa755ee-40cd-456e-a6cd-1b11b842bc0e', '鮮奶'),
('267b17c1-4e21-4812-8d02-15f5b50fa0e4', 'a973149c-6194-45e1-a90e-8084c097c3a3', '低筋麵粉'),
('267b17c1-4e21-4812-8d02-15f5b50fa0e4', '4fa755ee-40cd-456e-a6cd-1b11b842bc0e', '鮮奶'),
('e1c472fa-8449-4c4c-bac2-0b6c4f9f5d6a', '680008c2-61f7-4720-a950-fd5754f9aa03', '高筋麵粉'),
('e1c472fa-8449-4c4c-bac2-0b6c4f9f5d6a', 'e4dfea9d-c025-4143-b2a6-2e3610dc7d50', '無鹽奶油'),
('e709f7ab-ffe6-400b-8ea3-38a07ff6ad6a', '680008c2-61f7-4720-a950-fd5754f9aa03', '高筋麵粉'),
('e709f7ab-ffe6-400b-8ea3-38a07ff6ad6a', 'e4dfea9d-c025-4143-b2a6-2e3610dc7d50', '無鹽奶油');

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_item`
--

CREATE TABLE `bakery_item` (
  `FBakeryItemId` varchar(36) NOT NULL,
  `FName` varchar(30) NOT NULL,
  `FUnitPrice` int(100) NOT NULL,
  `FStorageCount` int(100) NOT NULL,
  `FStorageDays` int(100) NOT NULL,
  `FStorageMethod` varchar(300) NOT NULL,
  `FBakeryIngredientId` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `bakery_item`
--

INSERT INTO `bakery_item` (`FBakeryItemId`, `FName`, `FUnitPrice`, `FStorageCount`, `FStorageDays`, `FStorageMethod`, `FBakeryIngredientId`) VALUES
('c89f69f2-2e21-40ab-bdc8-182ae54d0c59', '麵包一', 1, 1, 12, 'q', 'd2c1f75b-1043-496c-ac7b-b130e222e1da'),
('13af2503-37f1-4c79-845d-3a7f95b30b73', '吐司', 90, 10, 30, '吐司保存方法', 'bdef2f5a-3209-4dce-a929-d6556833f2f6'),
('5f4c4b4a-2e9c-4473-b442-7a12c5575be5', '123', 12, 0, 0, '放冰箱', '8a07656e-2f66-4172-80c0-f7e604365a8e'),
('361fa9ca-bdcb-4bcb-91cf-f48952d0b8ec', 'asd', 1, 1, 1, '12小時內未食用完必須冰冷藏', '6c51ae31-ed2c-49c8-8e1d-acf6d496a7a2'),
('02c392bb-4f4b-48e8-a223-ed24e8fcfeba', '22', 22, 22, 22, '12小時內未食用完必須冰冷藏', '7b961300-7d0a-4916-83eb-20b6b581ede1'),
('81780e1a-63e6-4ee6-903c-0dfed5b14d3d', '1', 1, 1, 1, '1', '94f634fc-e870-479d-bacd-07002d0b3c87'),
('2554d0e5-a3b2-4faa-9d7d-7b778793cc17', '12222', 0, 222, 2222, '2222', 'fede6587-8185-4360-8d81-28d9ce75c4b3'),
('8b2b537a-eb04-4a7d-b319-d2c721019daa', 'asd', 0, 444, 44, '44', 'f6518055-5d9b-4300-b351-5fcc4ee1b2c1'),
('2a57210f-c591-4681-9e42-72bac1aeb6e9', 'zzzz', 0, 11, 11, '11', '267b17c1-4e21-4812-8d02-15f5b50fa0e4'),
('bbe3685a-5c61-4d43-a0cd-e90315f8a149', 'gggg', 0, 11, 11, '11', 'e1c472fa-8449-4c4c-bac2-0b6c4f9f5d6a'),
('bcac1290-8f40-4409-b55f-53d42713e5f8', 'll', 0, 2, 2, '2', 'e709f7ab-ffe6-400b-8ea3-38a07ff6ad6a');

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_material`
--

CREATE TABLE `bakery_material` (
  `FBakeryMaterialId` varchar(36) NOT NULL,
  `FName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `bakery_material`
--

INSERT INTO `bakery_material` (`FBakeryMaterialId`, `FName`) VALUES
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
  `FUserId` varchar(36) NOT NULL,
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
  `FName` varchar(20) NOT NULL,
  `FCount` int(10) NOT NULL,
  `FUnitPrice` int(10) NOT NULL,
  `FTotalPrice` int(10) NOT NULL,
  `FCreateTime` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 資料表結構 `bakery_store`
--

CREATE TABLE `bakery_store` (
  `FBakeryStoreId` varchar(36) NOT NULL,
  `FBakeryItemId` varchar(36) NOT NULL,
  `FCount` int(10) NOT NULL,
  `FUpdateTime` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
