-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `__efmigrationshistory` (
	`MigrationId` varchar(150) NOT NULL,
	`ProductVersion` varchar(32) NOT NULL,
	CONSTRAINT `__efmigrationshistory_MigrationId` PRIMARY KEY(`MigrationId`)
);
--> statement-breakpoint
CREATE TABLE `aspnetroleclaims` (
	`Id` int AUTO_INCREMENT NOT NULL,
	`RoleId` varchar(191) NOT NULL,
	`ClaimType` text,
	`ClaimValue` text,
	CONSTRAINT `aspnetroleclaims_Id` PRIMARY KEY(`Id`)
);
--> statement-breakpoint
CREATE TABLE `aspnetroles` (
	`Id` varchar(191) NOT NULL,
	`Name` varchar(256),
	`NormalizedName` varchar(256),
	`ConcurrencyStamp` text,
	`TenantID` int NOT NULL,
	CONSTRAINT `aspnetroles_Id` PRIMARY KEY(`Id`)
);
--> statement-breakpoint
CREATE TABLE `aspnetuserclaims` (
	`Id` int AUTO_INCREMENT NOT NULL,
	`UserId` varchar(191) NOT NULL,
	`ClaimType` text,
	`ClaimValue` text,
	CONSTRAINT `aspnetuserclaims_Id` PRIMARY KEY(`Id`)
);
--> statement-breakpoint
CREATE TABLE `aspnetuserlogins` (
	`LoginProvider` varchar(128) NOT NULL,
	`ProviderKey` varchar(128) NOT NULL,
	`ProviderDisplayName` text,
	`UserId` varchar(191) NOT NULL,
	CONSTRAINT `aspnetuserlogins_LoginProvider_ProviderKey` PRIMARY KEY(`LoginProvider`,`ProviderKey`)
);
--> statement-breakpoint
CREATE TABLE `aspnetuserroles` (
	`UserId` varchar(191) NOT NULL,
	`RoleId` varchar(191) NOT NULL,
	CONSTRAINT `aspnetuserroles_UserId_RoleId` PRIMARY KEY(`UserId`,`RoleId`)
);
--> statement-breakpoint
CREATE TABLE `aspnetusers` (
	`Id` varchar(191) NOT NULL,
	`UserName` varchar(256),
	`NormalizedUserName` varchar(256),
	`Email` varchar(256),
	`NormalizedEmail` varchar(256),
	`EmailConfirmed` tinyint NOT NULL DEFAULT 0,
	`PasswordHash` text,
	`SecurityStamp` text,
	`ConcurrencyStamp` text,
	`PhoneNumber` text,
	`PhoneNumberConfirmed` tinyint NOT NULL DEFAULT 0,
	`TwoFactorEnabled` tinyint NOT NULL DEFAULT 0,
	`LockoutEnd` datetime,
	`LockoutEnabled` tinyint NOT NULL DEFAULT 1,
	`AccessFailedCount` int NOT NULL DEFAULT 0,
	`FirstName` varchar(100),
	`LastName` varchar(100),
	`TenantID` int NOT NULL,
	`AvatarURL` text,
	`IsActive` tinyint NOT NULL DEFAULT 1,
	`CreatedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `aspnetusers_Id` PRIMARY KEY(`Id`)
);
--> statement-breakpoint
CREATE TABLE `aspnetusertokens` (
	`UserId` varchar(191) NOT NULL,
	`LoginProvider` varchar(128) NOT NULL,
	`Name` varchar(128) NOT NULL,
	`Value` text,
	CONSTRAINT `aspnetusertokens_UserId_LoginProvider_Name` PRIMARY KEY(`UserId`,`LoginProvider`,`Name`)
);
--> statement-breakpoint
CREATE TABLE `assettype` (
	`AssetTypeID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	CONSTRAINT `assettype_AssetTypeID` PRIMARY KEY(`AssetTypeID`)
);
--> statement-breakpoint
CREATE TABLE `auditlog` (
	`AuditLogID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Section` varchar(100),
	`User` varchar(191),
	`EventDateUTC` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`Event` varchar(50),
	`TableName` varchar(100),
	`RecordID` varchar(50),
	`ColumnName` varchar(100),
	`OriginalValue` text,
	`NewValue` text,
	CONSTRAINT `auditlog_AuditLogID` PRIMARY KEY(`AuditLogID`)
);
--> statement-breakpoint
CREATE TABLE `calllogs` (
	`CallLogID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`UserName` varchar(191) NOT NULL,
	`InComming` varchar(30),
	`LoggedAt` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`CallType` varchar(20),
	`CalledAt` datetime,
	`Durration` decimal(18,2) NOT NULL DEFAULT '0.00',
	`PhoneIMEI` text,
	`SecurityToken` text,
	`Sim1IMEI` text,
	`Sim1Name` varchar(100),
	`Sim2IMEI` text,
	`Sim2Name` varchar(100),
	`InCommingOn` varchar(30),
	CONSTRAINT `calllogs_CallLogID` PRIMARY KEY(`CallLogID`)
);
--> statement-breakpoint
CREATE TABLE `communicationtypes` (
	`CommunicationTypeID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	`IsActive` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `communicationtypes_CommunicationTypeID` PRIMARY KEY(`CommunicationTypeID`)
);
--> statement-breakpoint
CREATE TABLE `contacttypes` (
	`ContactTypeID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	`IsActive` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `contacttypes_ContactTypeID` PRIMARY KEY(`ContactTypeID`)
);
--> statement-breakpoint
CREATE TABLE `crmpermissions` (
	`PermissionID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`RoleId` varchar(191) NOT NULL,
	`Module` varchar(50) NOT NULL,
	`CanView` tinyint NOT NULL DEFAULT 0,
	`CanCreate` tinyint NOT NULL DEFAULT 0,
	`CanEdit` tinyint NOT NULL DEFAULT 0,
	`CanDelete` tinyint NOT NULL DEFAULT 0,
	`CanExport` tinyint NOT NULL DEFAULT 0,
	`CanAssign` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `crmpermissions_PermissionID` PRIMARY KEY(`PermissionID`),
	CONSTRAINT `UQ_CrmPermissions_Role_Module` UNIQUE(`TenantID`,`RoleId`,`Module`)
);
--> statement-breakpoint
CREATE TABLE `dashboardleadsummary` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`StaffID` text,
	`Staff` text,
	`LeadDate` datetime NOT NULL,
	`TotalLeads` int NOT NULL,
	`TotalAttendedLeads` int NOT NULL,
	`TotalUnAttendedLeads` int NOT NULL,
	`FollowUps` int NOT NULL,
	`NextFollowUps` int NOT NULL,
	`Leads` int NOT NULL,
	`AttendedLeads` int NOT NULL,
	`UnAttendedLeads` int NOT NULL,
	`Year` int NOT NULL,
	`Month` int NOT NULL,
	`Day` int NOT NULL,
	`minDate` datetime NOT NULL,
	`maxDate` datetime NOT NULL,
	CONSTRAINT `dashboardleadsummary_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `datedimension` (
	`DateDimensionID` int NOT NULL DEFAULT 1,
	`DateKey` int NOT NULL,
	`Date` date NOT NULL,
	`Day` tinyint NOT NULL,
	`DaySuffix` char(2) NOT NULL,
	`Weekday` tinyint NOT NULL,
	`WeekDayName` varchar(10) NOT NULL,
	`IsWeekend` tinyint NOT NULL,
	`IsHoliday` tinyint NOT NULL,
	`HolidayText` varchar(64),
	`DOWInMonth` tinyint NOT NULL,
	`DayOfYear` smallint NOT NULL,
	`WeekOfMonth` tinyint NOT NULL,
	`WeekOfYear` tinyint NOT NULL,
	`ISOWeekOfYear` tinyint NOT NULL,
	`Month` tinyint NOT NULL,
	`MonthName` varchar(10) NOT NULL,
	`Quarter` tinyint NOT NULL,
	`QuarterName` varchar(6) NOT NULL,
	`Year` int NOT NULL,
	`MMYYYY` char(6) NOT NULL,
	`MonthYear` char(7) NOT NULL,
	`FirstDayOfMonth` date NOT NULL,
	`LastDayOfMonth` date NOT NULL,
	`FirstDayOfQuarter` date NOT NULL,
	`LastDayOfQuarter` date NOT NULL,
	`FirstDayOfYear` date NOT NULL,
	`LastDayOfYear` date NOT NULL,
	`FirstDayOfNextMonth` date NOT NULL,
	`FirstDayOfNextYear` date NOT NULL,
	CONSTRAINT `datedimension_DateDimensionID_DateKey` PRIMARY KEY(`DateDimensionID`,`DateKey`)
);
--> statement-breakpoint
CREATE TABLE `fbadaccounts` (
	`FBAdAccountID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(255),
	`AppID` text,
	`AppSecret` text,
	`AppToken` text,
	`LongLiveToken` text,
	`Active` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `fbadaccounts_FBAdAccountID` PRIMARY KEY(`FBAdAccountID`)
);
--> statement-breakpoint
CREATE TABLE `fbadforms` (
	`FBAdFormID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`FBAdPageID` int NOT NULL,
	`ProjectID` int,
	`Description` varchar(255),
	`InternalID` text,
	`Active` tinyint NOT NULL DEFAULT 1,
	`LastSyncAt` datetime,
	`InitialSyncAt` datetime,
	CONSTRAINT `fbadforms_FBAdFormID` PRIMARY KEY(`FBAdFormID`)
);
--> statement-breakpoint
CREATE TABLE `fbadleads` (
	`FBAdLeadID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`FBAdFormID` int NOT NULL,
	`Data` text,
	`InternalID` text,
	`Processed` tinyint NOT NULL DEFAULT 0,
	`CreatedAT` datetime,
	CONSTRAINT `fbadleads_FBAdLeadID` PRIMARY KEY(`FBAdLeadID`)
);
--> statement-breakpoint
CREATE TABLE `fbadpages` (
	`FBAdPageID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`FBAdAccountID` int NOT NULL,
	`Description` varchar(255),
	`Token` text,
	`InternalID` text,
	`Active` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `fbadpages_FBAdPageID` PRIMARY KEY(`FBAdPageID`)
);
--> statement-breakpoint
CREATE TABLE `fbimportleads` (
	`FBImportLeadID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`SaleTeamID` int NOT NULL,
	`LeadSourceID` int NOT NULL DEFAULT 0,
	`ProjectID` int NOT NULL DEFAULT 0,
	`ImportedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`LeadCSVDetail` text,
	`RejectedCSVDetail` text,
	`Posted` tinyint NOT NULL DEFAULT 0,
	`Description` text,
	`LeadSummary` text,
	CONSTRAINT `fbimportleads_FBImportLeadID` PRIMARY KEY(`FBImportLeadID`)
);
--> statement-breakpoint
CREATE TABLE `invareas` (
	`AreaID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(150) NOT NULL,
	`CityID` int NOT NULL,
	CONSTRAINT `invareas_AreaID` PRIMARY KEY(`AreaID`)
);
--> statement-breakpoint
CREATE TABLE `invblocks` (
	`BlockID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(150) NOT NULL,
	`SectorID` int NOT NULL,
	CONSTRAINT `invblocks_BlockID` PRIMARY KEY(`BlockID`)
);
--> statement-breakpoint
CREATE TABLE `invcities` (
	`CityID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(150) NOT NULL,
	CONSTRAINT `invcities_CityID` PRIMARY KEY(`CityID`)
);
--> statement-breakpoint
CREATE TABLE `invclients` (
	`ClientID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`ProspectID` int,
	`Description` varchar(200) NOT NULL,
	`Address` text,
	`ContactNo` varchar(30),
	`FatherName` varchar(150),
	`IDCardNo` varchar(30),
	`Notes` text,
	`Profession` varchar(150),
	CONSTRAINT `invclients_ClientID` PRIMARY KEY(`ClientID`)
);
--> statement-breakpoint
CREATE TABLE `invclienttypes` (
	`ClientTypeID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	CONSTRAINT `invclienttypes_ClientTypeID` PRIMARY KEY(`ClientTypeID`)
);
--> statement-breakpoint
CREATE TABLE `invfeatures` (
	`FeatureID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	CONSTRAINT `invfeatures_FeatureID` PRIMARY KEY(`FeatureID`)
);
--> statement-breakpoint
CREATE TABLE `invinventories` (
	`InventoryID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`ProjectID` int,
	`PhaseId` int,
	`SectorId` int,
	`BlockId` int,
	`AreaId` int,
	`CityId` int,
	`Description` varchar(255),
	`Street` text,
	`TypeID` int,
	`SizeID` int,
	`StyleID` int,
	`OptionID` int,
	`PurposeID` int,
	`FloorNumber` int,
	`FacingDirection` varchar(20),
	`Price` decimal(18,2) NOT NULL DEFAULT '0.00',
	`Status` enum('available','reserved','sold','transferred') NOT NULL DEFAULT 'available',
	`ClientID` int,
	`ClientTypeID` int,
	`AssignedAT` datetime,
	`AssignedBy` varchar(36),
	`AssignedTo` varchar(36),
	`TransferAT` datetime,
	`TransferBy` varchar(36),
	`Notes` text,
	`IsActive` tinyint NOT NULL DEFAULT 1,
	`CreatedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`CreatedBy` varchar(36),
	`ModifiedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`ModifiedBy` varchar(36),
	CONSTRAINT `invinventories_InventoryID` PRIMARY KEY(`InventoryID`)
);
--> statement-breakpoint
CREATE TABLE `invinventoryfeatures` (
	`InventoryID` int NOT NULL,
	`FeatureID` int NOT NULL,
	`TenantID` int NOT NULL,
	CONSTRAINT `invinventoryfeatures_InventoryID_FeatureID` PRIMARY KEY(`InventoryID`,`FeatureID`)
);
--> statement-breakpoint
CREATE TABLE `invinventorypricelog` (
	`PriceLogID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`InventoryID` int NOT NULL,
	`OldPrice` decimal(18,2) NOT NULL,
	`NewPrice` decimal(18,2) NOT NULL,
	`ChangedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`ChangedBy` varchar(36),
	`Reason` text,
	CONSTRAINT `invinventorypricelog_PriceLogID` PRIMARY KEY(`PriceLogID`)
);
--> statement-breakpoint
CREATE TABLE `invoptions` (
	`OptionID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	CONSTRAINT `invoptions_OptionID` PRIMARY KEY(`OptionID`)
);
--> statement-breakpoint
CREATE TABLE `invphases` (
	`PhaseID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(150) NOT NULL,
	`ProjectID` int NOT NULL,
	CONSTRAINT `invphases_PhaseID` PRIMARY KEY(`PhaseID`)
);
--> statement-breakpoint
CREATE TABLE `invprojects` (
	`ProjectID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(255) NOT NULL,
	`AreaID` int,
	`IsActive` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `invprojects_ProjectID` PRIMARY KEY(`ProjectID`)
);
--> statement-breakpoint
CREATE TABLE `invpurposes` (
	`PurposeID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	CONSTRAINT `invpurposes_PurposeID` PRIMARY KEY(`PurposeID`)
);
--> statement-breakpoint
CREATE TABLE `invsectors` (
	`SectorID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(150) NOT NULL,
	`PhaseID` int NOT NULL,
	CONSTRAINT `invsectors_SectorID` PRIMARY KEY(`SectorID`)
);
--> statement-breakpoint
CREATE TABLE `invsizes` (
	`SizeID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	CONSTRAINT `invsizes_SizeID` PRIMARY KEY(`SizeID`)
);
--> statement-breakpoint
CREATE TABLE `invstyles` (
	`StyleID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	CONSTRAINT `invstyles_StyleID` PRIMARY KEY(`StyleID`)
);
--> statement-breakpoint
CREATE TABLE `invtypes` (
	`TypeID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	CONSTRAINT `invtypes_TypeID` PRIMARY KEY(`TypeID`)
);
--> statement-breakpoint
CREATE TABLE `leadcommunications` (
	`LeadCommunicationID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`LeadID` int NOT NULL,
	`CommunicationTypeID` int NOT NULL,
	`StatusID` int NOT NULL,
	`Description` text,
	`Outcome` varchar(255),
	`NextAction` text,
	`Duration` int,
	`AT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`FollowUpOn` datetime,
	`By` varchar(36),
	`TeamID` int,
	CONSTRAINT `leadcommunications_LeadCommunicationID` PRIMARY KEY(`LeadCommunicationID`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`LeadID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`LeadDate` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`ProspectID` int NOT NULL,
	`ProjectID` int,
	`InventoryID` int,
	`SaleTeamID` int,
	`StaffID` varchar(36),
	`LeadSourceID` int,
	`StatusID` int,
	`Budget` decimal(18,2) NOT NULL DEFAULT '0.00',
	`Priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`Description` text,
	`Notes` text,
	`FollowUpOn` datetime,
	`ExpectedCloseDate` date,
	`ClosedAT` datetime,
	`ClosedBy` varchar(36),
	`LostReason` text,
	`AssignedAT` datetime,
	`AssignedBy` varchar(36),
	`TransferAT` datetime,
	`TransferBy` varchar(36),
	`FBAdFormID` int,
	`FBImportLeadID` int,
	`InternalID` bigint,
	`SNo` int NOT NULL DEFAULT 0,
	`CreatedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`CreatedBy` varchar(36),
	`UpdatedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `leads_LeadID` PRIMARY KEY(`LeadID`)
);
--> statement-breakpoint
CREATE TABLE `leadsources` (
	`LeadSourceID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	`IsActive` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `leadsources_LeadSourceID` PRIMARY KEY(`LeadSourceID`)
);
--> statement-breakpoint
CREATE TABLE `leadsummary` (
	`LeadID` int AUTO_INCREMENT NOT NULL,
	`LeadDate` datetime NOT NULL,
	`AssignedAT` datetime,
	`AssignedBy` text,
	`AssignedTo` text,
	`Comments` text,
	`Status` text,
	`StatusID` int,
	`AT` datetime,
	`FollowUpOn` datetime,
	CONSTRAINT `leadsummary_LeadID` PRIMARY KEY(`LeadID`)
);
--> statement-breakpoint
CREATE TABLE `prospectaddress` (
	`ProspectAddressID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`ProspectID` int NOT NULL,
	`Label` varchar(50) DEFAULT 'Home',
	`Street` text,
	`Area` varchar(150),
	`City` varchar(100),
	`Country` varchar(100) DEFAULT 'Pakistan',
	`IsPrimary` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `prospectaddress_ProspectAddressID` PRIMARY KEY(`ProspectAddressID`)
);
--> statement-breakpoint
CREATE TABLE `prospectasset` (
	`ProspectAssetID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`ProspectID` int NOT NULL,
	`AssetTypeID` int NOT NULL,
	`Location` text,
	`Notes` text,
	`Value` decimal(18,2) NOT NULL DEFAULT '0.00',
	CONSTRAINT `prospectasset_ProspectAssetID` PRIMARY KEY(`ProspectAssetID`)
);
--> statement-breakpoint
CREATE TABLE `prospectcontact` (
	`ProspectContactID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`ProspectID` int NOT NULL,
	`ContactTypeID` int NOT NULL,
	`ContactNo` varchar(50) NOT NULL,
	`IsPrimary` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `prospectcontact_ProspectContactID` PRIMARY KEY(`ProspectContactID`)
);
--> statement-breakpoint
CREATE TABLE `prospects` (
	`ProspectID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`FullName` varchar(200) NOT NULL,
	`FatherName` varchar(150),
	`IDCardNo` varchar(30),
	`DOB` date,
	`Gender` enum('male','female','other'),
	`MaritalStatus` enum('single','married','divorced','widowed'),
	`Nationality` varchar(100) DEFAULT 'Pakistani',
	`Profession` varchar(150),
	`PrimaryPhone` varchar(30),
	`Email` varchar(256),
	`Address` text,
	`LeadSourceID` int,
	`ClientTypeID` int,
	`Tags` json,
	`ProfilePhoto` text,
	`Notes` text,
	`IsActive` tinyint NOT NULL DEFAULT 1,
	`CreatedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`CreatedBy` varchar(36),
	`UpdatedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `prospects_ProspectID` PRIMARY KEY(`ProspectID`)
);
--> statement-breakpoint
CREATE TABLE `sajwaltyableads` (
	`LeadID` int AUTO_INCREMENT NOT NULL,
	`LeadDate` datetime NOT NULL,
	`ProjectID` int,
	`InventoryID` int,
	`ProspectID` int NOT NULL,
	`SaleTeamID` int,
	`StaffID` varchar(36),
	`LeadSourceID` int,
	`FBImportLeadID` int,
	`FollowUpOn` datetime NOT NULL,
	`StatusID` int,
	`SNo` int NOT NULL,
	`AssignedAT` datetime,
	`AssignedBy` varchar(36),
	`TransferAT` datetime,
	`TransferBy` varchar(36),
	CONSTRAINT `sajwaltyableads_LeadID` PRIMARY KEY(`LeadID`)
);
--> statement-breakpoint
CREATE TABLE `saleteammembers` (
	`SaleTeamMemberID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`SaleTeamID` int NOT NULL,
	`StaffID` varchar(36) NOT NULL,
	`Active` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `saleteammembers_SaleTeamMemberID` PRIMARY KEY(`SaleTeamMemberID`)
);
--> statement-breakpoint
CREATE TABLE `saleteamproject` (
	`SaleTeamProjectID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`SaleTeamID` int NOT NULL,
	`ProjectID` int NOT NULL,
	CONSTRAINT `saleteamproject_SaleTeamProjectID` PRIMARY KEY(`SaleTeamProjectID`)
);
--> statement-breakpoint
CREATE TABLE `saleteams` (
	`SaleTeamID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(255),
	`IsActive` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `saleteams_SaleTeamID` PRIMARY KEY(`SaleTeamID`)
);
--> statement-breakpoint
CREATE TABLE `staffs` (
	`StaffID` varchar(36) NOT NULL,
	`TenantID` int NOT NULL,
	`AspNetUserID` varchar(191) NOT NULL,
	`AliasName` varchar(100),
	`Avatar` text,
	`Address` text,
	`ContactNo` varchar(30),
	`Mobile` varchar(30),
	`Phone` varchar(30),
	`DOB` date,
	`FatherName` varchar(150),
	`IDCardNo` varchar(30),
	`Notes` text,
	`TeamLeader` tinyint NOT NULL DEFAULT 0,
	`Organizer` tinyint NOT NULL DEFAULT 0,
	`Management` tinyint NOT NULL DEFAULT 0,
	`IsActive` tinyint NOT NULL DEFAULT 1,
	`CreatedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `staffs_StaffID` PRIMARY KEY(`StaffID`)
);
--> statement-breakpoint
CREATE TABLE `statuses` (
	`StatusID` int AUTO_INCREMENT NOT NULL,
	`TenantID` int NOT NULL,
	`Description` varchar(100) NOT NULL,
	`Color` varchar(20),
	`IsActive` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `statuses_StatusID` PRIMARY KEY(`StatusID`)
);
--> statement-breakpoint
CREATE TABLE `summary` (
	`LeadID` int NOT NULL,
	`LeadDate` datetime,
	`AssignedAT` datetime,
	`AssignedBy` text,
	`AssignedTo` text,
	`CreatedAT` datetime,
	`CreatedBy` text,
	`Project` text,
	`Comments` text,
	`Client` text,
	`Contact` text,
	`StatusID` int,
	`Status` text,
	`CommunicationAT` datetime,
	`FollowUpOn` datetime,
	CONSTRAINT `summary_LeadID` PRIMARY KEY(`LeadID`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`TenantID` int AUTO_INCREMENT NOT NULL,
	`Name` varchar(255) NOT NULL,
	`Slug` varchar(100) NOT NULL,
	`LogoURL` text,
	`Timezone` varchar(100) NOT NULL DEFAULT 'Asia/Karachi',
	`Plan` varchar(50) NOT NULL DEFAULT 'starter',
	`IsActive` tinyint NOT NULL DEFAULT 1,
	`CreatedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`UpdatedAT` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `tenants_TenantID` PRIMARY KEY(`TenantID`),
	CONSTRAINT `Slug` UNIQUE(`Slug`)
);
--> statement-breakpoint
CREATE TABLE `tmp_calllogs` (
	`CallLogID` int AUTO_INCREMENT NOT NULL,
	`InComming` text,
	`LoggedAt` datetime NOT NULL,
	`CallType` text,
	`CalledAt` datetime NOT NULL,
	`Durration` decimal(18,2) NOT NULL,
	`PhoneIMEI` text,
	`SecurityToken` text,
	`Sim1IMEI` text,
	`Sim1Name` text,
	`Sim2IMEI` text,
	`Sim2Name` text,
	`Sim3IMEI` text,
	`Sim3Name` text,
	`Sim4IMEI` text,
	`InCommingOn` text,
	CONSTRAINT `tmp_calllogs_CallLogID` PRIMARY KEY(`CallLogID`)
);
--> statement-breakpoint
CREATE TABLE `tmp_leads` (
	`leadid` int AUTO_INCREMENT NOT NULL,
	CONSTRAINT `tmp_leads_leadid` PRIMARY KEY(`leadid`)
);
--> statement-breakpoint
CREATE TABLE `tmp_projects_20220702_0519` (
	`ProjectID` int AUTO_INCREMENT NOT NULL,
	`Description` text,
	CONSTRAINT `tmp_projects_20220702_0519_ProjectID` PRIMARY KEY(`ProjectID`)
);
--> statement-breakpoint
CREATE TABLE `tmpleadids` (
	`recordid` text
);
--> statement-breakpoint
ALTER TABLE `aspnetroleclaims` ADD CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles`(`Id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aspnetroles` ADD CONSTRAINT `FK_AspNetRoles_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aspnetuserclaims` ADD CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers`(`Id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aspnetuserlogins` ADD CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers`(`Id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aspnetuserroles` ADD CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles`(`Id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aspnetuserroles` ADD CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers`(`Id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aspnetusers` ADD CONSTRAINT `FK_AspNetUsers_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aspnetusertokens` ADD CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers`(`Id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assettype` ADD CONSTRAINT `FK_AssetType_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auditlog` ADD CONSTRAINT `FK_AuditLog_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `calllogs` ADD CONSTRAINT `FK_CallLogs_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communicationtypes` ADD CONSTRAINT `FK_CommunicationTypes_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contacttypes` ADD CONSTRAINT `FK_ContactTypes_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crmpermissions` ADD CONSTRAINT `FK_CrmPermissions_Roles` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles`(`Id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crmpermissions` ADD CONSTRAINT `FK_CrmPermissions_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbadaccounts` ADD CONSTRAINT `FK_FBAdAccounts_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbadforms` ADD CONSTRAINT `FK_FBAdForms_FBAdPages` FOREIGN KEY (`FBAdPageID`) REFERENCES `fbadpages`(`FBAdPageID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbadforms` ADD CONSTRAINT `FK_FBAdForms_invProjects` FOREIGN KEY (`ProjectID`) REFERENCES `invprojects`(`ProjectID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbadforms` ADD CONSTRAINT `FK_FBAdForms_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbadleads` ADD CONSTRAINT `FK_FBAdLeads_FBAdForms` FOREIGN KEY (`FBAdFormID`) REFERENCES `fbadforms`(`FBAdFormID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbadleads` ADD CONSTRAINT `FK_FBAdLeads_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbadpages` ADD CONSTRAINT `FK_FBAdPages_FBAdAccounts` FOREIGN KEY (`FBAdAccountID`) REFERENCES `fbadaccounts`(`FBAdAccountID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbadpages` ADD CONSTRAINT `FK_FBAdPages_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbimportleads` ADD CONSTRAINT `FK_FBImportLeads_LeadSources` FOREIGN KEY (`LeadSourceID`) REFERENCES `leadsources`(`LeadSourceID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbimportleads` ADD CONSTRAINT `FK_FBImportLeads_SaleTeams` FOREIGN KEY (`SaleTeamID`) REFERENCES `saleteams`(`SaleTeamID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fbimportleads` ADD CONSTRAINT `FK_FBImportLeads_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invareas` ADD CONSTRAINT `FK_invAreas_invCities` FOREIGN KEY (`CityID`) REFERENCES `invcities`(`CityID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invareas` ADD CONSTRAINT `FK_invAreas_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invblocks` ADD CONSTRAINT `FK_invBlocks_invSectors` FOREIGN KEY (`SectorID`) REFERENCES `invsectors`(`SectorID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invblocks` ADD CONSTRAINT `FK_invBlocks_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invcities` ADD CONSTRAINT `FK_invCities_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invclients` ADD CONSTRAINT `FK_invClients_Prospects` FOREIGN KEY (`ProspectID`) REFERENCES `prospects`(`ProspectID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invclients` ADD CONSTRAINT `FK_invClients_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invclienttypes` ADD CONSTRAINT `FK_invClientTypes_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invfeatures` ADD CONSTRAINT `FK_invFeatures_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invAreas` FOREIGN KEY (`AreaId`) REFERENCES `invareas`(`AreaID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invBlocks` FOREIGN KEY (`BlockId`) REFERENCES `invblocks`(`BlockID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invCities` FOREIGN KEY (`CityId`) REFERENCES `invcities`(`CityID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invClients` FOREIGN KEY (`ClientID`) REFERENCES `invclients`(`ClientID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invClientTypes` FOREIGN KEY (`ClientTypeID`) REFERENCES `invclienttypes`(`ClientTypeID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invOptions` FOREIGN KEY (`OptionID`) REFERENCES `invoptions`(`OptionID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invPhases` FOREIGN KEY (`PhaseId`) REFERENCES `invphases`(`PhaseID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invProjects` FOREIGN KEY (`ProjectID`) REFERENCES `invprojects`(`ProjectID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invPurposes` FOREIGN KEY (`PurposeID`) REFERENCES `invpurposes`(`PurposeID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invSectors` FOREIGN KEY (`SectorId`) REFERENCES `invsectors`(`SectorID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invSizes` FOREIGN KEY (`SizeID`) REFERENCES `invsizes`(`SizeID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invStyles` FOREIGN KEY (`StyleID`) REFERENCES `invstyles`(`StyleID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_invTypes` FOREIGN KEY (`TypeID`) REFERENCES `invtypes`(`TypeID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventories` ADD CONSTRAINT `FK_invInventories_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventoryfeatures` ADD CONSTRAINT `FK_invInventoryFeatures_invFeatures` FOREIGN KEY (`FeatureID`) REFERENCES `invfeatures`(`FeatureID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventoryfeatures` ADD CONSTRAINT `FK_invInventoryFeatures_invInventories` FOREIGN KEY (`InventoryID`) REFERENCES `invinventories`(`InventoryID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventoryfeatures` ADD CONSTRAINT `FK_invInventoryFeatures_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventorypricelog` ADD CONSTRAINT `FK_invInventoryPriceLog_invInventories` FOREIGN KEY (`InventoryID`) REFERENCES `invinventories`(`InventoryID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invinventorypricelog` ADD CONSTRAINT `FK_invInventoryPriceLog_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoptions` ADD CONSTRAINT `FK_invOptions_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invphases` ADD CONSTRAINT `FK_invPhases_invProjects` FOREIGN KEY (`ProjectID`) REFERENCES `invprojects`(`ProjectID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invphases` ADD CONSTRAINT `FK_invPhases_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invprojects` ADD CONSTRAINT `FK_invProjects_invAreas` FOREIGN KEY (`AreaID`) REFERENCES `invareas`(`AreaID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invprojects` ADD CONSTRAINT `FK_invProjects_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invpurposes` ADD CONSTRAINT `FK_invPurposes_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invsectors` ADD CONSTRAINT `FK_invSectors_invPhases` FOREIGN KEY (`PhaseID`) REFERENCES `invphases`(`PhaseID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invsectors` ADD CONSTRAINT `FK_invSectors_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invsizes` ADD CONSTRAINT `FK_invSizes_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invstyles` ADD CONSTRAINT `FK_invStyles_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invtypes` ADD CONSTRAINT `FK_invTypes_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leadcommunications` ADD CONSTRAINT `FK_LeadCommunications_CommunicationTypes` FOREIGN KEY (`CommunicationTypeID`) REFERENCES `communicationtypes`(`CommunicationTypeID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leadcommunications` ADD CONSTRAINT `FK_LeadCommunications_Leads` FOREIGN KEY (`LeadID`) REFERENCES `leads`(`LeadID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leadcommunications` ADD CONSTRAINT `FK_LeadCommunications_Statuses` FOREIGN KEY (`StatusID`) REFERENCES `statuses`(`StatusID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leadcommunications` ADD CONSTRAINT `FK_LeadCommunications_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `FK_Leads_FBAdForms` FOREIGN KEY (`FBAdFormID`) REFERENCES `fbadforms`(`FBAdFormID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `FK_Leads_FBImportLeads` FOREIGN KEY (`FBImportLeadID`) REFERENCES `fbimportleads`(`FBImportLeadID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `FK_Leads_invInventories` FOREIGN KEY (`InventoryID`) REFERENCES `invinventories`(`InventoryID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `FK_Leads_invProjects` FOREIGN KEY (`ProjectID`) REFERENCES `invprojects`(`ProjectID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `FK_Leads_LeadSources` FOREIGN KEY (`LeadSourceID`) REFERENCES `leadsources`(`LeadSourceID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `FK_Leads_Prospects` FOREIGN KEY (`ProspectID`) REFERENCES `prospects`(`ProspectID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `FK_Leads_SaleTeams` FOREIGN KEY (`SaleTeamID`) REFERENCES `saleteams`(`SaleTeamID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `FK_Leads_Staffs` FOREIGN KEY (`StaffID`) REFERENCES `staffs`(`StaffID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `FK_Leads_Statuses` FOREIGN KEY (`StatusID`) REFERENCES `statuses`(`StatusID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `FK_Leads_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leadsources` ADD CONSTRAINT `FK_LeadSources_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prospectaddress` ADD CONSTRAINT `FK_ProspectAddress_Prospects` FOREIGN KEY (`ProspectID`) REFERENCES `prospects`(`ProspectID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prospectaddress` ADD CONSTRAINT `FK_ProspectAddress_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prospectasset` ADD CONSTRAINT `FK_ProspectAsset_AssetType` FOREIGN KEY (`AssetTypeID`) REFERENCES `assettype`(`AssetTypeID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prospectasset` ADD CONSTRAINT `FK_ProspectAsset_Prospects` FOREIGN KEY (`ProspectID`) REFERENCES `prospects`(`ProspectID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prospectasset` ADD CONSTRAINT `FK_ProspectAsset_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prospectcontact` ADD CONSTRAINT `FK_ProspectContact_ContactTypes` FOREIGN KEY (`ContactTypeID`) REFERENCES `contacttypes`(`ContactTypeID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prospectcontact` ADD CONSTRAINT `FK_ProspectContact_Prospects` FOREIGN KEY (`ProspectID`) REFERENCES `prospects`(`ProspectID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prospectcontact` ADD CONSTRAINT `FK_ProspectContact_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prospects` ADD CONSTRAINT `FK_Prospects_LeadSources` FOREIGN KEY (`LeadSourceID`) REFERENCES `leadsources`(`LeadSourceID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prospects` ADD CONSTRAINT `FK_Prospects_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saleteammembers` ADD CONSTRAINT `FK_SaleTeamMembers_SaleTeams` FOREIGN KEY (`SaleTeamID`) REFERENCES `saleteams`(`SaleTeamID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saleteammembers` ADD CONSTRAINT `FK_SaleTeamMembers_Staffs` FOREIGN KEY (`StaffID`) REFERENCES `staffs`(`StaffID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saleteammembers` ADD CONSTRAINT `FK_SaleTeamMembers_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saleteamproject` ADD CONSTRAINT `FK_SaleTeamProject_invProjects` FOREIGN KEY (`ProjectID`) REFERENCES `invprojects`(`ProjectID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saleteamproject` ADD CONSTRAINT `FK_SaleTeamProject_SaleTeams` FOREIGN KEY (`SaleTeamID`) REFERENCES `saleteams`(`SaleTeamID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saleteamproject` ADD CONSTRAINT `FK_SaleTeamProject_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saleteams` ADD CONSTRAINT `FK_SaleTeams_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staffs` ADD CONSTRAINT `FK_Staffs_AspNetUsers` FOREIGN KEY (`AspNetUserID`) REFERENCES `aspnetusers`(`Id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staffs` ADD CONSTRAINT `FK_Staffs_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `statuses` ADD CONSTRAINT `FK_Statuses_Tenants` FOREIGN KEY (`TenantID`) REFERENCES `tenants`(`TenantID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `IX_AspNetRoles_TenantID` ON `aspnetroles` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_AspNetUsers_TenantID` ON `aspnetusers` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_AspNetUsers_Email` ON `aspnetusers` (`Email`);--> statement-breakpoint
CREATE INDEX `IX_AssetType_TenantID` ON `assettype` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_AuditLog_TenantID` ON `auditlog` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_AuditLog_TenantID_TableName` ON `auditlog` (`TenantID`,`TableName`);--> statement-breakpoint
CREATE INDEX `IX_CallLogs_TenantID` ON `calllogs` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_CommunicationTypes_TenantID` ON `communicationtypes` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_ContactTypes_TenantID` ON `contacttypes` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_FBAdAccounts_TenantID` ON `fbadaccounts` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_FBAdForms_TenantID` ON `fbadforms` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_FBAdLeads_TenantID` ON `fbadleads` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_FBAdPages_TenantID` ON `fbadpages` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_FBImportLeads_TenantID` ON `fbimportleads` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invAreas_TenantID` ON `invareas` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invBlocks_TenantID` ON `invblocks` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invCities_TenantID` ON `invcities` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invClients_TenantID` ON `invclients` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invClients_ProspectID` ON `invclients` (`ProspectID`);--> statement-breakpoint
CREATE INDEX `IX_invClientTypes_TenantID` ON `invclienttypes` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invFeatures_TenantID` ON `invfeatures` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invInventories_TenantID` ON `invinventories` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invInventories_TenantID_Status` ON `invinventories` (`TenantID`,`Status`);--> statement-breakpoint
CREATE INDEX `IX_invInventories_TenantID_ProjectID` ON `invinventories` (`TenantID`,`ProjectID`);--> statement-breakpoint
CREATE INDEX `IX_invInventoryPriceLog_TenantID_InventoryID` ON `invinventorypricelog` (`TenantID`,`InventoryID`);--> statement-breakpoint
CREATE INDEX `IX_invOptions_TenantID` ON `invoptions` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invPhases_TenantID` ON `invphases` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invProjects_TenantID` ON `invprojects` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invPurposes_TenantID` ON `invpurposes` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invSectors_TenantID` ON `invsectors` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invSizes_TenantID` ON `invsizes` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invStyles_TenantID` ON `invstyles` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_invTypes_TenantID` ON `invtypes` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_LeadCommunications_TenantID_LeadID` ON `leadcommunications` (`TenantID`,`LeadID`);--> statement-breakpoint
CREATE INDEX `IX_LeadCommunications_TenantID_FollowUpOn` ON `leadcommunications` (`TenantID`,`FollowUpOn`);--> statement-breakpoint
CREATE INDEX `IX_Leads_TenantID` ON `leads` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_Leads_TenantID_StatusID` ON `leads` (`TenantID`,`StatusID`);--> statement-breakpoint
CREATE INDEX `IX_Leads_TenantID_StaffID` ON `leads` (`TenantID`,`StaffID`);--> statement-breakpoint
CREATE INDEX `IX_Leads_TenantID_FollowUpOn` ON `leads` (`TenantID`,`FollowUpOn`);--> statement-breakpoint
CREATE INDEX `IX_Leads_TenantID_ProspectID` ON `leads` (`TenantID`,`ProspectID`);--> statement-breakpoint
CREATE INDEX `IX_LeadSources_TenantID` ON `leadsources` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_ProspectAddress_TenantID_ProspectID` ON `prospectaddress` (`TenantID`,`ProspectID`);--> statement-breakpoint
CREATE INDEX `IX_ProspectAsset_TenantID_ProspectID` ON `prospectasset` (`TenantID`,`ProspectID`);--> statement-breakpoint
CREATE INDEX `IX_ProspectContact_TenantID_ProspectID` ON `prospectcontact` (`TenantID`,`ProspectID`);--> statement-breakpoint
CREATE INDEX `IX_Prospects_TenantID` ON `prospects` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_Prospects_IDCardNo` ON `prospects` (`TenantID`,`IDCardNo`);--> statement-breakpoint
CREATE INDEX `IX_Prospects_Email` ON `prospects` (`TenantID`,`Email`);--> statement-breakpoint
CREATE INDEX `IX_SaleTeamMembers_TenantID` ON `saleteammembers` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_SaleTeamProject_TenantID` ON `saleteamproject` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_SaleTeams_TenantID` ON `saleteams` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_Staffs_TenantID` ON `staffs` (`TenantID`);--> statement-breakpoint
CREATE INDEX `IX_Staffs_AspNetUserID` ON `staffs` (`AspNetUserID`);--> statement-breakpoint
CREATE INDEX `IX_Statuses_TenantID` ON `statuses` (`TenantID`);
*/