import { mysqlTable, mysqlSchema, type AnyMySqlColumn, primaryKey, varchar, foreignKey, int, text, index, tinyint, datetime, decimal, unique, date, char, smallint, mysqlEnum, bigint, json } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const efmigrationshistory = mysqlTable("__efmigrationshistory", {
	migrationId: varchar("MigrationId", { length: 150 }).notNull(),
	productVersion: varchar("ProductVersion", { length: 32 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.migrationId], name: "__efmigrationshistory_MigrationId"}),
]);

export const aspnetroleclaims = mysqlTable("aspnetroleclaims", {
	id: int("Id").autoincrement().notNull(),
	roleId: varchar("RoleId", { length: 191 }).notNull().references(() => aspnetroles.id, { onDelete: "cascade" } ),
	claimType: text("ClaimType"),
	claimValue: text("ClaimValue"),
},
(table) => [
	primaryKey({ columns: [table.id], name: "aspnetroleclaims_Id"}),
]);

export const aspnetroles = mysqlTable("aspnetroles", {
	id: varchar("Id", { length: 191 }).notNull(),
	name: varchar("Name", { length: 256 }),
	normalizedName: varchar("NormalizedName", { length: 256 }),
	concurrencyStamp: text("ConcurrencyStamp"),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
},
(table) => [
	index("IX_AspNetRoles_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.id], name: "aspnetroles_Id"}),
]);

export const aspnetuserclaims = mysqlTable("aspnetuserclaims", {
	id: int("Id").autoincrement().notNull(),
	userId: varchar("UserId", { length: 191 }).notNull().references(() => aspnetusers.id, { onDelete: "cascade" } ),
	claimType: text("ClaimType"),
	claimValue: text("ClaimValue"),
},
(table) => [
	primaryKey({ columns: [table.id], name: "aspnetuserclaims_Id"}),
]);

export const aspnetuserlogins = mysqlTable("aspnetuserlogins", {
	loginProvider: varchar("LoginProvider", { length: 128 }).notNull(),
	providerKey: varchar("ProviderKey", { length: 128 }).notNull(),
	providerDisplayName: text("ProviderDisplayName"),
	userId: varchar("UserId", { length: 191 }).notNull().references(() => aspnetusers.id, { onDelete: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.loginProvider, table.providerKey], name: "aspnetuserlogins_LoginProvider_ProviderKey"}),
]);

export const aspnetuserroles = mysqlTable("aspnetuserroles", {
	userId: varchar("UserId", { length: 191 }).notNull().references(() => aspnetusers.id, { onDelete: "cascade" } ),
	roleId: varchar("RoleId", { length: 191 }).notNull().references(() => aspnetroles.id, { onDelete: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.userId, table.roleId], name: "aspnetuserroles_UserId_RoleId"}),
]);

export const aspnetusers = mysqlTable("aspnetusers", {
	id: varchar("Id", { length: 191 }).notNull(),
	userName: varchar("UserName", { length: 256 }),
	normalizedUserName: varchar("NormalizedUserName", { length: 256 }),
	email: varchar("Email", { length: 256 }),
	normalizedEmail: varchar("NormalizedEmail", { length: 256 }),
	emailConfirmed: tinyint("EmailConfirmed").default(0).notNull(),
	passwordHash: text("PasswordHash"),
	securityStamp: text("SecurityStamp"),
	concurrencyStamp: text("ConcurrencyStamp"),
	phoneNumber: text("PhoneNumber"),
	phoneNumberConfirmed: tinyint("PhoneNumberConfirmed").default(0).notNull(),
	twoFactorEnabled: tinyint("TwoFactorEnabled").default(0).notNull(),
	lockoutEnd: datetime("LockoutEnd", { mode: 'string'}),
	lockoutEnabled: tinyint("LockoutEnabled").default(1).notNull(),
	accessFailedCount: int("AccessFailedCount").default(0).notNull(),
	firstName: varchar("FirstName", { length: 100 }),
	lastName: varchar("LastName", { length: 100 }),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	avatarUrl: text("AvatarURL"),
	isActive: tinyint("IsActive").default(1).notNull(),
	createdAt: datetime("CreatedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	index("IX_AspNetUsers_TenantID").on(table.tenantId),
	index("IX_AspNetUsers_Email").on(table.email),
	primaryKey({ columns: [table.id], name: "aspnetusers_Id"}),
]);

export const aspnetusertokens = mysqlTable("aspnetusertokens", {
	userId: varchar("UserId", { length: 191 }).notNull().references(() => aspnetusers.id, { onDelete: "cascade" } ),
	loginProvider: varchar("LoginProvider", { length: 128 }).notNull(),
	name: varchar("Name", { length: 128 }).notNull(),
	value: text("Value"),
},
(table) => [
	primaryKey({ columns: [table.userId, table.loginProvider, table.name], name: "aspnetusertokens_UserId_LoginProvider_Name"}),
]);

export const assettype = mysqlTable("assettype", {
	assetTypeId: int("AssetTypeID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
},
(table) => [
	index("IX_AssetType_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.assetTypeId], name: "assettype_AssetTypeID"}),
]);

export const auditlog = mysqlTable("auditlog", {
	auditLogId: int("AuditLogID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	section: varchar("Section", { length: 100 }),
	user: varchar("User", { length: 191 }),
	eventDateUtc: datetime("EventDateUTC", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	event: varchar("Event", { length: 50 }),
	tableName: varchar("TableName", { length: 100 }),
	recordId: varchar("RecordID", { length: 50 }),
	columnName: varchar("ColumnName", { length: 100 }),
	originalValue: text("OriginalValue"),
	newValue: text("NewValue"),
},
(table) => [
	index("IX_AuditLog_TenantID").on(table.tenantId),
	index("IX_AuditLog_TenantID_TableName").on(table.tenantId, table.tableName),
	primaryKey({ columns: [table.auditLogId], name: "auditlog_AuditLogID"}),
]);

export const calls = mysqlTable("calls", {
  id: int("id").primaryKey().autoincrement(),
  subject: varchar("subject", { length: 255 }).notNull(), // e.g., "Follow up with Lead"
  type: mysqlEnum("type", ["Inbound", "Outbound"]).default("Outbound"),
  startTime: datetime("start_time"),
  duration: varchar("duration", { length: 50 }), // e.g., "00:15"
  prospectId: int("prospect_id").references(() => prospects.prospectId), // "Contact Name"
  dealId: int("deal_id").references(() => deals.dealId), // "Related To"
  userId: varchar("user_id", { length: 255 }).references(() => aspnetusers.id), // "Call Owner"
  description: text("description"),
  tenantId: int("tenant_id").notNull(),
});

export const calllogs = mysqlTable("calllogs", {
	callLogId: int("CallLogID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	userName: varchar("UserName", { length: 191 }).notNull(),
	inComming: varchar("InComming", { length: 30 }),
	loggedAt: datetime("LoggedAt", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	callType: varchar("CallType", { length: 20 }),
	calledAt: datetime("CalledAt", { mode: 'string'}),
	durration: decimal("Durration", { precision: 18, scale: 2 }).default('0.00').notNull(),
	phoneImei: text("PhoneIMEI"),
	securityToken: text("SecurityToken"),
	sim1Imei: text("Sim1IMEI"),
	sim1Name: varchar("Sim1Name", { length: 100 }),
	sim2Imei: text("Sim2IMEI"),
	sim2Name: varchar("Sim2Name", { length: 100 }),
	inCommingOn: varchar("InCommingOn", { length: 30 }),
},
(table) => [
	index("IX_CallLogs_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.callLogId], name: "calllogs_CallLogID"}),
]);

export const communicationtypes = mysqlTable("communicationtypes", {
	communicationTypeId: int("CommunicationTypeID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
	isActive: tinyint("IsActive").default(1).notNull(),
},
(table) => [
	index("IX_CommunicationTypes_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.communicationTypeId], name: "communicationtypes_CommunicationTypeID"}),
]);

export const contacttypes = mysqlTable("contacttypes", {
	contactTypeId: int("ContactTypeID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
	isActive: tinyint("IsActive").default(1).notNull(),
},
(table) => [
	index("IX_ContactTypes_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.contactTypeId], name: "contacttypes_ContactTypeID"}),
]);

export const crmpermissions = mysqlTable("crmpermissions", {
	permissionId: int("PermissionID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	roleId: varchar("RoleId", { length: 191 }).notNull().references(() => aspnetroles.id, { onDelete: "cascade" } ),
	module: varchar("Module", { length: 50 }).notNull(),
	canView: tinyint("CanView").default(0).notNull(),
	canCreate: tinyint("CanCreate").default(0).notNull(),
	canEdit: tinyint("CanEdit").default(0).notNull(),
	canDelete: tinyint("CanDelete").default(0).notNull(),
	canExport: tinyint("CanExport").default(0).notNull(),
	canAssign: tinyint("CanAssign").default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.permissionId], name: "crmpermissions_PermissionID"}),
	unique("UQ_CrmPermissions_Role_Module").on(table.tenantId, table.roleId, table.module),
]);

export const dashboardleadsummary = mysqlTable("dashboardleadsummary", {
	id: int("ID").autoincrement().notNull(),
	staffId: text("StaffID"),
	staff: text("Staff"),
	leadDate: datetime("LeadDate", { mode: 'string'}).notNull(),
	totalLeads: int("TotalLeads").notNull(),
	totalAttendedLeads: int("TotalAttendedLeads").notNull(),
	totalUnAttendedLeads: int("TotalUnAttendedLeads").notNull(),
	followUps: int("FollowUps").notNull(),
	nextFollowUps: int("NextFollowUps").notNull(),
	leads: int("Leads").notNull(),
	attendedLeads: int("AttendedLeads").notNull(),
	unAttendedLeads: int("UnAttendedLeads").notNull(),
	year: int("Year").notNull(),
	month: int("Month").notNull(),
	day: int("Day").notNull(),
	minDate: datetime({ mode: 'string'}).notNull(),
	maxDate: datetime({ mode: 'string'}).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "dashboardleadsummary_ID"}),
]);

export const datedimension = mysqlTable("datedimension", {
	dateDimensionId: int("DateDimensionID").default(1).notNull(),
	dateKey: int("DateKey").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	date: date("Date", { mode: 'string' }).notNull(),
	day: tinyint("Day").notNull(),
	daySuffix: char("DaySuffix", { length: 2 }).notNull(),
	weekday: tinyint("Weekday").notNull(),
	weekDayName: varchar("WeekDayName", { length: 10 }).notNull(),
	isWeekend: tinyint("IsWeekend").notNull(),
	isHoliday: tinyint("IsHoliday").notNull(),
	holidayText: varchar("HolidayText", { length: 64 }),
	dowInMonth: tinyint("DOWInMonth").notNull(),
	dayOfYear: smallint("DayOfYear").notNull(),
	weekOfMonth: tinyint("WeekOfMonth").notNull(),
	weekOfYear: tinyint("WeekOfYear").notNull(),
	isoWeekOfYear: tinyint("ISOWeekOfYear").notNull(),
	month: tinyint("Month").notNull(),
	monthName: varchar("MonthName", { length: 10 }).notNull(),
	quarter: tinyint("Quarter").notNull(),
	quarterName: varchar("QuarterName", { length: 6 }).notNull(),
	year: int("Year").notNull(),
	mmyyyy: char("MMYYYY", { length: 6 }).notNull(),
	monthYear: char("MonthYear", { length: 7 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	firstDayOfMonth: date("FirstDayOfMonth", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	lastDayOfMonth: date("LastDayOfMonth", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	firstDayOfQuarter: date("FirstDayOfQuarter", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	lastDayOfQuarter: date("LastDayOfQuarter", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	firstDayOfYear: date("FirstDayOfYear", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	lastDayOfYear: date("LastDayOfYear", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	firstDayOfNextMonth: date("FirstDayOfNextMonth", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	firstDayOfNextYear: date("FirstDayOfNextYear", { mode: 'string' }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.dateDimensionId, table.dateKey], name: "datedimension_DateDimensionID_DateKey"}),
]);

export const deals = mysqlTable("deals", {
    dealId: int("DealId").autoincrement().notNull(),
    tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
    leadId: int("LeadID").references(() => leads.leadId), // Links back to the original lead
    prospectId: int("ProspectID").notNull().references(() => prospects.prospectId),
    inventoryId: int("InventoryID").references(() => invinventories.inventoryId),
    staffId: varchar("StaffID", { length: 36 }).references(() => aspnetusers.id),
    
    // Financial Details
    dealValue: decimal("DealValue", { precision: 18, scale: 2 }).default('0.00').notNull(),
    commissionRate: decimal("CommissionRate", { precision: 5, scale: 2 }).default('0.00'),
    downPayment: decimal("DownPayment", { precision: 18, scale: 2 }).default('0.00'),
    paymentPlan: text("PaymentPlan"), // Description of installments
    
    // Status & Dates
    status: mysqlEnum("Status", ['negotiation', 'closed_won', 'closed_lost', 'pending_legal']).default('negotiation'),
    expectedClosingDate: date("ExpectedClosingDate", { mode: 'string' }),
    closedAt: datetime("ClosedAt", { mode: 'string' }),
    
    notes: text("Notes"),
    createdAt: datetime("CreatedAt", { mode: 'string' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    updatedAt: datetime("UpdatedAt", { mode: 'string' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
    index("IX_Deals_TenantID").on(table.tenantId),
    index("IX_Deals_ProspectID").on(table.prospectId),
    primaryKey({ columns: [table.dealId], name: "deals_DealId" }),
]);

export const fbadaccounts = mysqlTable("fbadaccounts", {
	fbAdAccountId: int("FBAdAccountID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 255 }),
	appId: text("AppID"),
	appSecret: text("AppSecret"),
	appToken: text("AppToken"),
	longLiveToken: text("LongLiveToken"),
	active: tinyint("Active").default(1).notNull(),
},
(table) => [
	index("IX_FBAdAccounts_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.fbAdAccountId], name: "fbadaccounts_FBAdAccountID"}),
]);

export const fbadforms = mysqlTable("fbadforms", {
	fbAdFormId: int("FBAdFormID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	fbAdPageId: int("FBAdPageID").notNull().references(() => fbadpages.fbAdPageId),
	projectId: int("ProjectID").references(() => invprojects.projectId),
	description: varchar("Description", { length: 255 }),
	internalId: text("InternalID"),
	active: tinyint("Active").default(1).notNull(),
	lastSyncAt: datetime("LastSyncAt", { mode: 'string'}),
	initialSyncAt: datetime("InitialSyncAt", { mode: 'string'}),
},
(table) => [
	index("IX_FBAdForms_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.fbAdFormId], name: "fbadforms_FBAdFormID"}),
]);

export const fbadleads = mysqlTable("fbadleads", {
	fbAdLeadId: int("FBAdLeadID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	fbAdFormId: int("FBAdFormID").notNull().references(() => fbadforms.fbAdFormId),
	data: text("Data"),
	internalId: text("InternalID"),
	processed: tinyint("Processed").default(0).notNull(),
	createdAt: datetime("CreatedAT", { mode: 'string'}),
},
(table) => [
	index("IX_FBAdLeads_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.fbAdLeadId], name: "fbadleads_FBAdLeadID"}),
]);

export const fbadpages = mysqlTable("fbadpages", {
	fbAdPageId: int("FBAdPageID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	fbAdAccountId: int("FBAdAccountID").notNull().references(() => fbadaccounts.fbAdAccountId),
	description: varchar("Description", { length: 255 }),
	token: text("Token"),
	internalId: text("InternalID"),
	active: tinyint("Active").default(1).notNull(),
},
(table) => [
	index("IX_FBAdPages_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.fbAdPageId], name: "fbadpages_FBAdPageID"}),
]);

export const fbimportleads = mysqlTable("fbimportleads", {
	fbImportLeadId: int("FBImportLeadID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	saleTeamId: int("SaleTeamID").notNull().references(() => saleteams.saleTeamId),
	leadSourceId: int("LeadSourceID").default(0).notNull().references(() => leadsources.leadSourceId),
	projectId: int("ProjectID").default(0).notNull(),
	importedAt: datetime("ImportedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	leadCsvDetail: text("LeadCSVDetail"),
	rejectedCsvDetail: text("RejectedCSVDetail"),
	posted: tinyint("Posted").default(0).notNull(),
	description: text("Description"),
	leadSummary: text("LeadSummary"),
},
(table) => [
	index("IX_FBImportLeads_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.fbImportLeadId], name: "fbimportleads_FBImportLeadID"}),
]);

export const invareas = mysqlTable("invareas", {
	areaId: int("AreaID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 150 }).notNull(),
	cityId: int("CityID").notNull().references(() => invcities.cityId),
},
(table) => [
	index("IX_invAreas_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.areaId], name: "invareas_AreaID"}),
]);

export const invblocks = mysqlTable("invblocks", {
	blockId: int("BlockID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 150 }).notNull(),
	sectorId: int("SectorID").notNull().references(() => invsectors.sectorId),
},
(table) => [
	index("IX_invBlocks_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.blockId], name: "invblocks_BlockID"}),
]);

export const invcities = mysqlTable("invcities", {
	cityId: int("CityID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 150 }).notNull(),
},
(table) => [
	index("IX_invCities_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.cityId], name: "invcities_CityID"}),
]);

export const invclients = mysqlTable("invclients", {
	clientId: int("ClientID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	prospectId: int("ProspectID").references(() => prospects.prospectId),
	description: varchar("Description", { length: 200 }).notNull(),
	address: text("Address"),
	contactNo: varchar("ContactNo", { length: 30 }),
	fatherName: varchar("FatherName", { length: 150 }),
	idCardNo: varchar("IDCardNo", { length: 30 }),
	notes: text("Notes"),
	profession: varchar("Profession", { length: 150 }),
},
(table) => [
	index("IX_invClients_TenantID").on(table.tenantId),
	index("IX_invClients_ProspectID").on(table.prospectId),
	primaryKey({ columns: [table.clientId], name: "invclients_ClientID"}),
]);

export const invclienttypes = mysqlTable("invclienttypes", {
	clientTypeId: int("ClientTypeID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
},
(table) => [
	index("IX_invClientTypes_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.clientTypeId], name: "invclienttypes_ClientTypeID"}),
]);

export const invfeatures = mysqlTable("invfeatures", {
	featureId: int("FeatureID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
},
(table) => [
	index("IX_invFeatures_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.featureId], name: "invfeatures_FeatureID"}),
]);

export const invinventories = mysqlTable("invinventories", {
	inventoryId: int("InventoryID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	projectId: int("ProjectID").references(() => invprojects.projectId),
	phaseId: int("PhaseId").references(() => invphases.phaseId),
	sectorId: int("SectorId").references(() => invsectors.sectorId),
	blockId: int("BlockId").references(() => invblocks.blockId),
	areaId: int("AreaId").references(() => invareas.areaId),
	cityId: int("CityId").references(() => invcities.cityId),
	description: varchar("Description", { length: 255 }),
	street: text("Street"),
	typeId: int("TypeID").references(() => invtypes.typeId),
	sizeId: int("SizeID").references(() => invsizes.sizeId),
	styleId: int("StyleID").references(() => invstyles.styleId),
	optionId: int("OptionID").references(() => invoptions.optionId),
	purposeId: int("PurposeID").references(() => invpurposes.purposeId),
	floorNumber: int("FloorNumber"),
	facingDirection: varchar("FacingDirection", { length: 20 }),
	price: decimal("Price", { precision: 18, scale: 2 }).default('0.00').notNull(),
	status: mysqlEnum("Status", ['available','reserved','sold','transferred']).default('available').notNull(),
	clientId: int("ClientID").references(() => invclients.clientId),
	clientTypeId: int("ClientTypeID").references(() => invclienttypes.clientTypeId),
	assignedAt: datetime("AssignedAT", { mode: 'string'}),
	assignedBy: varchar("AssignedBy", { length: 36 }),
	assignedTo: varchar("AssignedTo", { length: 36 }),
	transferAt: datetime("TransferAT", { mode: 'string'}),
	transferBy: varchar("TransferBy", { length: 36 }),
	notes: text("Notes"),
	isActive: tinyint("IsActive").default(1).notNull(),
	createdAt: datetime("CreatedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	createdBy: varchar("CreatedBy", { length: 36 }),
	modifiedAt: datetime("ModifiedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	modifiedBy: varchar("ModifiedBy", { length: 36 }),
},
(table) => [
	index("IX_invInventories_TenantID").on(table.tenantId),
	index("IX_invInventories_TenantID_Status").on(table.tenantId, table.status),
	index("IX_invInventories_TenantID_ProjectID").on(table.tenantId, table.projectId),
	primaryKey({ columns: [table.inventoryId], name: "invinventories_InventoryID"}),
]);

export const invinventoryfeatures = mysqlTable("invinventoryfeatures", {
	inventoryId: int("InventoryID").notNull().references(() => invinventories.inventoryId),
	featureId: int("FeatureID").notNull().references(() => invfeatures.featureId),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
},
(table) => [
	primaryKey({ columns: [table.inventoryId, table.featureId], name: "invinventoryfeatures_InventoryID_FeatureID"}),
]);

export const invinventorypricelog = mysqlTable("invinventorypricelog", {
	priceLogId: int("PriceLogID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	inventoryId: int("InventoryID").notNull().references(() => invinventories.inventoryId),
	oldPrice: decimal("OldPrice", { precision: 18, scale: 2 }).notNull(),
	newPrice: decimal("NewPrice", { precision: 18, scale: 2 }).notNull(),
	changedAt: datetime("ChangedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	changedBy: varchar("ChangedBy", { length: 36 }),
	reason: text("Reason"),
},
(table) => [
	index("IX_invInventoryPriceLog_TenantID_InventoryID").on(table.tenantId, table.inventoryId),
	primaryKey({ columns: [table.priceLogId], name: "invinventorypricelog_PriceLogID"}),
]);

export const invoptions = mysqlTable("invoptions", {
	optionId: int("OptionID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
},
(table) => [
	index("IX_invOptions_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.optionId], name: "invoptions_OptionID"}),
]);

export const invphases = mysqlTable("invphases", {
	phaseId: int("PhaseID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 150 }).notNull(),
	projectId: int("ProjectID").notNull().references(() => invprojects.projectId),
},
(table) => [
	index("IX_invPhases_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.phaseId], name: "invphases_PhaseID"}),
]);

export const invprojects = mysqlTable("invprojects", {
	projectId: int("ProjectID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 255 }).notNull(),
	areaId: int("AreaID").references(() => invareas.areaId),
	isActive: tinyint("IsActive").default(1).notNull(),
},
(table) => [
	index("IX_invProjects_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.projectId], name: "invprojects_ProjectID"}),
]);

export const invpurposes = mysqlTable("invpurposes", {
	purposeId: int("PurposeID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
},
(table) => [
	index("IX_invPurposes_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.purposeId], name: "invpurposes_PurposeID"}),
]);

export const invsectors = mysqlTable("invsectors", {
	sectorId: int("SectorID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 150 }).notNull(),
	phaseId: int("PhaseID").notNull().references(() => invphases.phaseId),
},
(table) => [
	index("IX_invSectors_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.sectorId], name: "invsectors_SectorID"}),
]);

export const invsizes = mysqlTable("invsizes", {
	sizeId: int("SizeID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
},
(table) => [
	index("IX_invSizes_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.sizeId], name: "invsizes_SizeID"}),
]);

export const invstyles = mysqlTable("invstyles", {
	styleId: int("StyleID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
},
(table) => [
	index("IX_invStyles_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.styleId], name: "invstyles_StyleID"}),
]);

export const invtypes = mysqlTable("invtypes", {
	typeId: int("TypeID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
},
(table) => [
	index("IX_invTypes_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.typeId], name: "invtypes_TypeID"}),
]);

export const leadcommunications = mysqlTable("leadcommunications", {
	leadCommunicationId: int("LeadCommunicationID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	leadId: int("LeadID").notNull().references(() => leads.leadId, { onDelete: "cascade" } ),
	communicationTypeId: int("CommunicationTypeID").notNull(),
	// Changed by Gemini
	// .references(() => communicationtypes.communicationTypeId),
	statusId: int("StatusID").notNull().references(() => statuses.statusId),
	description: text("Description"),
	outcome: varchar("Outcome", { length: 255 }),
	nextAction: text("NextAction"),
	duration: int("Duration"),
	at: datetime("AT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	followUpOn: datetime("FollowUpOn", { mode: 'string'}),
	by: varchar("By", { length: 36 }),
	teamId: int("TeamID"),
},
(table) => [
	index("IX_LeadCommunications_TenantID_LeadID").on(table.tenantId, table.leadId),
	index("IX_LeadCommunications_TenantID_FollowUpOn").on(table.tenantId, table.followUpOn),
	primaryKey({ columns: [table.leadCommunicationId], name: "leadcommunications_LeadCommunicationID"}),
	// ADD THIS BLOCK TO MANUALLY NAME THE FOREIGN KEY(Gemini):
    foreignKey({
      name: "fk_lead_comm_type", // Short and safe name
      columns: [table.communicationTypeId],
      foreignColumns: [communicationtypes.communicationTypeId],
    }),
]);

export const leads = mysqlTable("leads", {
	leadId: int("LeadID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	leadDate: datetime("LeadDate", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	prospectId: int("ProspectID").notNull().references(() => prospects.prospectId),
	projectId: int("ProjectID").references(() => invprojects.projectId),
	inventoryId: int("InventoryID").references(() => invinventories.inventoryId),
	saleTeamId: int("SaleTeamID").references(() => saleteams.saleTeamId),
	staffId: varchar("StaffID", { length: 36 }).references(() => staffs.staffId),
	leadSourceId: int("LeadSourceID").references(() => leadsources.leadSourceId),
	statusId: int("StatusID").references(() => statuses.statusId),
	budget: decimal("Budget", { precision: 18, scale: 2 }).default('0.00').notNull(),
	priority: mysqlEnum("Priority", ['low','medium','high']).default('medium').notNull(),
	description: text("Description"),
	notes: text("Notes"),
	followUpOn: datetime("FollowUpOn", { mode: 'string'}),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	expectedCloseDate: date("ExpectedCloseDate", { mode: 'string' }),
	closedAt: datetime("ClosedAT", { mode: 'string'}),
	closedBy: varchar("ClosedBy", { length: 36 }),
	lostReason: text("LostReason"),
	assignedAt: datetime("AssignedAT", { mode: 'string'}),
	assignedBy: varchar("AssignedBy", { length: 36 }),
	transferAt: datetime("TransferAT", { mode: 'string'}),
	transferBy: varchar("TransferBy", { length: 36 }),
	fbAdFormId: int("FBAdFormID").references(() => fbadforms.fbAdFormId),
	fbImportLeadId: int("FBImportLeadID").references(() => fbimportleads.fbImportLeadId),
	internalId: bigint("InternalID", { mode: "number" }),
	sno: int("SNo").default(0).notNull(),
	createdAt: datetime("CreatedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	createdBy: varchar("CreatedBy", { length: 36 }),
	updatedAt: datetime("UpdatedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	index("IX_Leads_TenantID").on(table.tenantId),
	index("IX_Leads_TenantID_StatusID").on(table.tenantId, table.statusId),
	index("IX_Leads_TenantID_StaffID").on(table.tenantId, table.staffId),
	index("IX_Leads_TenantID_FollowUpOn").on(table.tenantId, table.followUpOn),
	index("IX_Leads_TenantID_ProspectID").on(table.tenantId, table.prospectId),
	primaryKey({ columns: [table.leadId], name: "leads_LeadID"}),
]);

export const leadsources = mysqlTable("leadsources", {
	leadSourceId: int("LeadSourceID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
	isActive: tinyint("IsActive").default(1).notNull(),
},
(table) => [
	index("IX_LeadSources_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.leadSourceId], name: "leadsources_LeadSourceID"}),
]);

export const leadsummary = mysqlTable("leadsummary", {
	leadId: int("LeadID").autoincrement().notNull(),
	leadDate: datetime("LeadDate", { mode: 'string'}).notNull(),
	assignedAt: datetime("AssignedAT", { mode: 'string'}),
	assignedBy: text("AssignedBy"),
	assignedTo: text("AssignedTo"),
	comments: text("Comments"),
	status: text("Status"),
	statusId: int("StatusID"),
	at: datetime("AT", { mode: 'string'}),
	followUpOn: datetime("FollowUpOn", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.leadId], name: "leadsummary_LeadID"}),
]);

export const prospectaddress = mysqlTable("prospectaddress", {
	prospectAddressId: int("ProspectAddressID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	prospectId: int("ProspectID").notNull().references(() => prospects.prospectId, { onDelete: "cascade" } ),
	label: varchar("Label", { length: 50 }).default('Home'),
	street: text("Street"),
	area: varchar("Area", { length: 150 }),
	city: varchar("City", { length: 100 }),
	country: varchar("Country", { length: 100 }).default('Pakistan'),
	isPrimary: tinyint("IsPrimary").default(0).notNull(),
},
(table) => [
	index("IX_ProspectAddress_TenantID_ProspectID").on(table.tenantId, table.prospectId),
	primaryKey({ columns: [table.prospectAddressId], name: "prospectaddress_ProspectAddressID"}),
]);

export const prospectasset = mysqlTable("prospectasset", {
	prospectAssetId: int("ProspectAssetID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	prospectId: int("ProspectID").notNull().references(() => prospects.prospectId, { onDelete: "cascade" } ),
	assetTypeId: int("AssetTypeID").notNull().references(() => assettype.assetTypeId),
	location: text("Location"),
	notes: text("Notes"),
	value: decimal("Value", { precision: 18, scale: 2 }).default('0.00').notNull(),
},
(table) => [
	index("IX_ProspectAsset_TenantID_ProspectID").on(table.tenantId, table.prospectId),
	primaryKey({ columns: [table.prospectAssetId], name: "prospectasset_ProspectAssetID"}),
]);

export const prospectcontact = mysqlTable("prospectcontact", {
	prospectContactId: int("ProspectContactID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	prospectId: int("ProspectID").notNull().references(() => prospects.prospectId, { onDelete: "cascade" } ),
	contactTypeId: int("ContactTypeID").notNull().references(() => contacttypes.contactTypeId),
	contactNo: varchar("ContactNo", { length: 50 }).notNull(),
	isPrimary: tinyint("IsPrimary").default(0).notNull(),
},
(table) => [
	index("IX_ProspectContact_TenantID_ProspectID").on(table.tenantId, table.prospectId),
	primaryKey({ columns: [table.prospectContactId], name: "prospectcontact_ProspectContactID"}),
]);

export const prospects = mysqlTable("prospects", {
	prospectId: int("ProspectID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	fullName: varchar("FullName", { length: 200 }).notNull(),
	fatherName: varchar("FatherName", { length: 150 }),
	idCardNo: varchar("IDCardNo", { length: 30 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dob: date("DOB", { mode: 'string' }),
	gender: mysqlEnum("Gender", ['male','female','other']),
	maritalStatus: mysqlEnum("MaritalStatus", ['single','married','divorced','widowed']),
	nationality: varchar("Nationality", { length: 100 }).default('Pakistani'),
	profession: varchar("Profession", { length: 150 }),
	primaryPhone: varchar("PrimaryPhone", { length: 30 }),
	email: varchar("Email", { length: 256 }),
	address: text("Address"),
	leadSourceId: int("LeadSourceID").references(() => leadsources.leadSourceId),
	clientTypeId: int("ClientTypeID"),
	tags: json("Tags"),
	profilePhoto: text("ProfilePhoto"),
	notes: text("Notes"),
	isActive: tinyint("IsActive").default(1).notNull(),
	createdAt: datetime("CreatedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	createdBy: varchar("CreatedBy", { length: 36 }),
	updatedAt: datetime("UpdatedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	index("IX_Prospects_TenantID").on(table.tenantId),
	index("IX_Prospects_IDCardNo").on(table.tenantId, table.idCardNo),
	index("IX_Prospects_Email").on(table.tenantId, table.email),
	primaryKey({ columns: [table.prospectId], name: "prospects_ProspectID"}),
]);

export const sajwaltyableads = mysqlTable("sajwaltyableads", {
	leadId: int("LeadID").autoincrement().notNull(),
	leadDate: datetime("LeadDate", { mode: 'string'}).notNull(),
	projectId: int("ProjectID"),
	inventoryId: int("InventoryID"),
	prospectId: int("ProspectID").notNull(),
	saleTeamId: int("SaleTeamID"),
	staffId: varchar("StaffID", { length: 36 }),
	leadSourceId: int("LeadSourceID"),
	fbImportLeadId: int("FBImportLeadID"),
	followUpOn: datetime("FollowUpOn", { mode: 'string'}).notNull(),
	statusId: int("StatusID"),
	sno: int("SNo").notNull(),
	assignedAt: datetime("AssignedAT", { mode: 'string'}),
	assignedBy: varchar("AssignedBy", { length: 36 }),
	transferAt: datetime("TransferAT", { mode: 'string'}),
	transferBy: varchar("TransferBy", { length: 36 }),
},
(table) => [
	primaryKey({ columns: [table.leadId], name: "sajwaltyableads_LeadID"}),
]);

export const saleteammembers = mysqlTable("saleteammembers", {
	saleTeamMemberId: int("SaleTeamMemberID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	saleTeamId: int("SaleTeamID").notNull().references(() => saleteams.saleTeamId),
	staffId: varchar("StaffID", { length: 36 }).notNull().references(() => staffs.staffId),
	active: tinyint("Active").default(1).notNull(),
},
(table) => [
	index("IX_SaleTeamMembers_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.saleTeamMemberId], name: "saleteammembers_SaleTeamMemberID"}),
]);

export const saleteamproject = mysqlTable("saleteamproject", {
	saleTeamProjectId: int("SaleTeamProjectID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	saleTeamId: int("SaleTeamID").notNull().references(() => saleteams.saleTeamId),
	projectId: int("ProjectID").notNull().references(() => invprojects.projectId),
},
(table) => [
	index("IX_SaleTeamProject_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.saleTeamProjectId], name: "saleteamproject_SaleTeamProjectID"}),
]);

export const saleteams = mysqlTable("saleteams", {
	saleTeamId: int("SaleTeamID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 255 }),
	isActive: tinyint("IsActive").default(1).notNull(),
},
(table) => [
	index("IX_SaleTeams_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.saleTeamId], name: "saleteams_SaleTeamID"}),
]);

export const staffs = mysqlTable("staffs", {
	staffId: varchar("StaffID", { length: 36 }).notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	aspNetUserId: varchar("AspNetUserID", { length: 191 }).notNull().references(() => aspnetusers.id),
	aliasName: varchar("AliasName", { length: 100 }),
	avatar: text("Avatar"),
	address: text("Address"),
	contactNo: varchar("ContactNo", { length: 30 }),
	mobile: varchar("Mobile", { length: 30 }),
	phone: varchar("Phone", { length: 30 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dob: date("DOB", { mode: 'string' }),
	fatherName: varchar("FatherName", { length: 150 }),
	idCardNo: varchar("IDCardNo", { length: 30 }),
	notes: text("Notes"),
	teamLeader: tinyint("TeamLeader").default(0).notNull(),
	organizer: tinyint("Organizer").default(0).notNull(),
	management: tinyint("Management").default(0).notNull(),
	isActive: tinyint("IsActive").default(1).notNull(),
	createdAt: datetime("CreatedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	index("IX_Staffs_TenantID").on(table.tenantId),
	index("IX_Staffs_AspNetUserID").on(table.aspNetUserId),
	primaryKey({ columns: [table.staffId], name: "staffs_StaffID"}),
]);

export const statuses = mysqlTable("statuses", {
	statusId: int("StatusID").autoincrement().notNull(),
	tenantId: int("TenantID").notNull().references(() => tenants.tenantId),
	description: varchar("Description", { length: 100 }).notNull(),
	color: varchar("Color", { length: 20 }),
	isActive: tinyint("IsActive").default(1).notNull(),
},
(table) => [
	index("IX_Statuses_TenantID").on(table.tenantId),
	primaryKey({ columns: [table.statusId], name: "statuses_StatusID"}),
]);

export const summary = mysqlTable("summary", {
	leadId: int("LeadID").notNull(),
	leadDate: datetime("LeadDate", { mode: 'string'}),
	assignedAt: datetime("AssignedAT", { mode: 'string'}),
	assignedBy: text("AssignedBy"),
	assignedTo: text("AssignedTo"),
	createdAt: datetime("CreatedAT", { mode: 'string'}),
	createdBy: text("CreatedBy"),
	project: text("Project"),
	comments: text("Comments"),
	client: text("Client"),
	contact: text("Contact"),
	statusId: int("StatusID"),
	status: text("Status"),
	communicationAt: datetime("CommunicationAT", { mode: 'string'}),
	followUpOn: datetime("FollowUpOn", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.leadId], name: "summary_LeadID"}),
]);

export const tenants = mysqlTable("tenants", {
	tenantId: int("TenantID").autoincrement().notNull(),
	name: varchar("Name", { length: 255 }).notNull(),
	slug: varchar("Slug", { length: 100 }).notNull(),
	logoUrl: text("LogoURL"),
	timezone: varchar("Timezone", { length: 100 }).default('Asia/Karachi').notNull(),
	plan: varchar("Plan", { length: 50 }).default('starter').notNull(),
	isActive: tinyint("IsActive").default(1).notNull(),
	createdAt: datetime("CreatedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: datetime("UpdatedAT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.tenantId], name: "tenants_TenantID"}),
	unique("Slug").on(table.slug),
]);

export const tmpCalllogs = mysqlTable("tmp_calllogs", {
	callLogId: int("CallLogID").autoincrement().notNull(),
	inComming: text("InComming"),
	loggedAt: datetime("LoggedAt", { mode: 'string'}).notNull(),
	callType: text("CallType"),
	calledAt: datetime("CalledAt", { mode: 'string'}).notNull(),
	durration: decimal("Durration", { precision: 18, scale: 2 }).notNull(),
	phoneImei: text("PhoneIMEI"),
	securityToken: text("SecurityToken"),
	sim1Imei: text("Sim1IMEI"),
	sim1Name: text("Sim1Name"),
	sim2Imei: text("Sim2IMEI"),
	sim2Name: text("Sim2Name"),
	sim3Imei: text("Sim3IMEI"),
	sim3Name: text("Sim3Name"),
	sim4Imei: text("Sim4IMEI"),
	inCommingOn: text("InCommingOn"),
},
(table) => [
	primaryKey({ columns: [table.callLogId], name: "tmp_calllogs_CallLogID"}),
]);

export const tmpLeads = mysqlTable("tmp_leads", {
	leadid: int().autoincrement().notNull(),
},
(table) => [
	primaryKey({ columns: [table.leadid], name: "tmp_leads_leadid"}),
]);

export const tmpProjects202207020519 = mysqlTable("tmp_projects_20220702_0519", {
	projectId: int("ProjectID").autoincrement().notNull(),
	description: text("Description"),
},
(table) => [
	primaryKey({ columns: [table.projectId], name: "tmp_projects_20220702_0519_ProjectID"}),
]);

export const tmpleadids = mysqlTable("tmpleadids", {
	recordid: text(),
});
