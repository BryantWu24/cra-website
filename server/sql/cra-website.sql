-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2021-11-10 08:10:21
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
('45b6c145-706d-41fc-a77a-50d153e2e4d6', '680008c2-61f7-4720-a950-fd5754f9aa03', '高筋麵粉'),
('45b6c145-706d-41fc-a77a-50d153e2e4d6', '7299b5ba-439a-494a-9c07-99d46e9d47e3', '細砂糖'),
('45b6c145-706d-41fc-a77a-50d153e2e4d6', 'e4dfea9d-c025-4143-b2a6-2e3610dc7d50', '無鹽奶油'),
('cd8bdb0e-e441-411b-9ebd-9ada2a2b6193', '680008c2-61f7-4720-a950-fd5754f9aa03', '高筋麵粉'),
('cd8bdb0e-e441-411b-9ebd-9ada2a2b6193', 'a973149c-6194-45e1-a90e-8084c097c3a3', '低筋麵粉'),
('20af6228-ea93-435c-9d07-a46ecdf04a13', 'e4dfea9d-c025-4143-b2a6-2e3610dc7d50', '無鹽奶油');

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
('f527182b-667b-451f-9ef0-6146d0baf841', '12', 12, 12, 12, '1', '45b6c145-706d-41fc-a77a-50d153e2e4d6'),
('8f510e97-4c23-48d7-9db2-35a42d548622', '123', 123, 123, 119, '123', 'cd8bdb0e-e441-411b-9ebd-9ada2a2b6193'),
('66fb3392-ae11-4c5a-a8c9-6b18791c206e', 'a', 2, 2, 2, '2', '20af6228-ea93-435c-9d07-a46ecdf04a13');

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

--
-- 傾印資料表的資料 `bakery_order`
--

INSERT INTO `bakery_order` (`FOrderId`, `FUserId`, `FTotalPrice`, `FCreateDate`) VALUES
('e514aa92-a18e-44df-99da-c952262cf228', '19451217-1dd2-11b2-8000-080027b246c3', 541, '2021-11-10 11:40:59.156728'),
('27855af3-7a5e-42c1-b9a9-d2f1075dd144', '19451217-1dd2-11b2-8000-080027b246c3', 721, '2021-11-10 11:48:13.256836'),
('d983fc6c-a3bd-4cf6-91a5-6f71ad9769ec', '19451217-1dd2-11b2-8000-080027b246c3', 1, '2021-11-10 11:50:09.818422'),
('21b1ace4-95d5-4c4a-b09b-c463d7d8c6f9', '19451217-1dd2-11b2-8000-080027b246c3', 630, '2021-11-10 11:50:40.252173');

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
-- 資料表結構 `bakery_store`
--

CREATE TABLE `bakery_store` (
  `FBakeryStoreId` varchar(36) NOT NULL,
  `FBakeryItemId` varchar(36) NOT NULL,
  `FName` varchar(20) NOT NULL,
  `FCount` int(10) NOT NULL,
  `FUpdateTime` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `bakery_store`
--

INSERT INTO `bakery_store` (`FBakeryStoreId`, `FBakeryItemId`, `FName`, `FCount`, `FUpdateTime`) VALUES
('27a1ce12-2396-4ee4-ab1b-368842afe0c4', '22e48d37-84c3-4d8d-ba75-3657776912cc', 'Product-01', 30, '2021-11-10 13:41:01.336903'),
('248bb53b-966b-40e3-993e-2ce922a66c27', 'fcc21306-c58a-44f8-93cf-fc491c6cd0a3', '123', 123, '2021-11-10 14:26:07.045518'),
('fadeec32-0df5-45d9-b52a-ad66bd5271a4', '2e513fbc-e592-4f35-875a-9bb70391d136', '111', 11, '2021-11-10 14:33:14.106422'),
('9db71d28-188e-4c1c-8413-ef393b0f244f', '053adefb-66d0-482e-b053-739c70bed392', '1', 1, '2021-11-10 14:37:07.150881'),
('ff7b6880-5b3b-43a6-a468-a7e05bb07cfc', 'dd1656ce-6e98-41bb-ba3a-42ce55876e69', '11', 11, '2021-11-10 14:38:29.691577'),
('d94c02c3-46f3-40ef-95bf-b55c195db1ea', 'a503fe0c-e3b8-45f4-8ac2-f17f22765586', '11', 11, '2021-11-10 14:38:41.539277'),
('94a5fcf4-8938-423b-a66d-4ab19787124c', 'd0c0070d-2f2d-45ea-877c-74578521ab9e', '111', 11, '2021-11-10 14:41:31.191995'),
('3b6815ee-e6f6-4b07-8927-c2da4335ce94', 'a339371f-219a-47cd-8847-f4033b94d294', '111', 1121, '2021-11-10 14:42:46.564119'),
('9fadfb10-8618-46c0-a5e1-9792c1a98e7d', 'b7cadace-daed-4749-b4c2-70941421db20', '11111', 20, '2021-11-10 14:46:22.096489'),
('1f460f0a-d814-4940-afcc-74807c52d10f', 'bf30efc4-4f3d-4fc0-ae88-537888f0436c', 'sss', 2, '2021-11-10 14:48:02.355015'),
('225f8e6a-b4ef-4ab8-9d6a-2195584035d4', '4f735f34-23ba-4672-94b4-e64c8c2ac1f3', '111222', 1125, '2021-11-10 14:49:57.716508'),
('cb55a2cd-2c19-4286-953c-e211069c7475', '7d7b57c2-bc34-4408-9db1-1e32a665911b', '1', 1, '2021-11-10 14:52:20.497012'),
('e7bdb036-463b-4871-a9b3-f0ccbb467c56', '00e1fe9f-842e-43aa-9aac-75b208a06907', '2', 2, '2021-11-10 14:53:07.249656'),
('4fe236ce-9b2c-4ee3-885e-f0a77c3318cd', 'f527182b-667b-451f-9ef0-6146d0baf841', '12', 12, '2021-11-10 14:58:43.480567'),
('834b32ff-9992-4386-ba9a-0c25465f210e', '8f510e97-4c23-48d7-9db2-35a42d548622', '123', 123, '2021-11-10 15:04:40.061710'),
('b6947b8a-091b-439b-b148-aec61907eef5', '66fb3392-ae11-4c5a-a8c9-6b18791c206e', 'a', 2, '2021-11-10 15:05:42.916017');

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
