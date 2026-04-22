import { relations } from "drizzle-orm/relations";
import { aspnetroles, aspnetroleclaims, tenants, aspnetusers, aspnetuserclaims, aspnetuserlogins, aspnetuserroles, aspnetusertokens, assettype, auditlog, calllogs, communicationtypes, contacttypes, crmpermissions, fbadaccounts, fbadpages, fbadforms, invprojects, fbadleads, leadsources, fbimportleads, saleteams, invcities, invareas, invsectors, invblocks, prospects, invclients, invclienttypes, invfeatures, invinventories, invoptions, invphases, invpurposes, invsizes, invstyles, invtypes, invinventoryfeatures, invinventorypricelog, leadcommunications, leads, statuses, staffs, prospectaddress, prospectasset, prospectcontact, saleteammembers, saleteamproject } from "./schema.js";

export const aspnetroleclaimsRelations = relations(aspnetroleclaims, ({one}) => ({
	aspnetrole: one(aspnetroles, {
		fields: [aspnetroleclaims.roleId],
		references: [aspnetroles.id]
	}),
}));

export const aspnetrolesRelations = relations(aspnetroles, ({one, many}) => ({
	aspnetroleclaims: many(aspnetroleclaims),
	tenant: one(tenants, {
		fields: [aspnetroles.tenantId],
		references: [tenants.tenantId]
	}),
	aspnetuserroles: many(aspnetuserroles),
	crmpermissions: many(crmpermissions),
}));

export const tenantsRelations = relations(tenants, ({many}) => ({
	aspnetroles: many(aspnetroles),
	aspnetusers: many(aspnetusers),
	assettypes: many(assettype),
	auditlogs: many(auditlog),
	calllogs: many(calllogs),
	communicationtypes: many(communicationtypes),
	contacttypes: many(contacttypes),
	crmpermissions: many(crmpermissions),
	fbadaccounts: many(fbadaccounts),
	fbadforms: many(fbadforms),
	fbadleads: many(fbadleads),
	fbadpages: many(fbadpages),
	fbimportleads: many(fbimportleads),
	invareas: many(invareas),
	invblocks: many(invblocks),
	invcities: many(invcities),
	invclients: many(invclients),
	invclienttypes: many(invclienttypes),
	invfeatures: many(invfeatures),
	invinventories: many(invinventories),
	invinventoryfeatures: many(invinventoryfeatures),
	invinventorypricelogs: many(invinventorypricelog),
	invoptions: many(invoptions),
	invphases: many(invphases),
	invprojects: many(invprojects),
	invpurposes: many(invpurposes),
	invsectors: many(invsectors),
	invsizes: many(invsizes),
	invstyles: many(invstyles),
	invtypes: many(invtypes),
	leadcommunications: many(leadcommunications),
	leads: many(leads),
	leadsources: many(leadsources),
	prospectaddresses: many(prospectaddress),
	prospectassets: many(prospectasset),
	prospectcontacts: many(prospectcontact),
	prospects: many(prospects),
	saleteammembers: many(saleteammembers),
	saleteamprojects: many(saleteamproject),
	saleteams: many(saleteams),
	staffs: many(staffs),
	statuses: many(statuses),
}));

export const aspnetuserclaimsRelations = relations(aspnetuserclaims, ({one}) => ({
	aspnetuser: one(aspnetusers, {
		fields: [aspnetuserclaims.userId],
		references: [aspnetusers.id]
	}),
}));

export const aspnetusersRelations = relations(aspnetusers, ({one, many}) => ({
	aspnetuserclaims: many(aspnetuserclaims),
	aspnetuserlogins: many(aspnetuserlogins),
	aspnetuserroles: many(aspnetuserroles),
	tenant: one(tenants, {
		fields: [aspnetusers.tenantId],
		references: [tenants.tenantId]
	}),
	aspnetusertokens: many(aspnetusertokens),
	staffs: many(staffs),
}));

export const aspnetuserloginsRelations = relations(aspnetuserlogins, ({one}) => ({
	aspnetuser: one(aspnetusers, {
		fields: [aspnetuserlogins.userId],
		references: [aspnetusers.id]
	}),
}));

export const aspnetuserrolesRelations = relations(aspnetuserroles, ({one}) => ({
	aspnetrole: one(aspnetroles, {
		fields: [aspnetuserroles.roleId],
		references: [aspnetroles.id]
	}),
	aspnetuser: one(aspnetusers, {
		fields: [aspnetuserroles.userId],
		references: [aspnetusers.id]
	}),
}));

export const aspnetusertokensRelations = relations(aspnetusertokens, ({one}) => ({
	aspnetuser: one(aspnetusers, {
		fields: [aspnetusertokens.userId],
		references: [aspnetusers.id]
	}),
}));

export const assettypeRelations = relations(assettype, ({one, many}) => ({
	tenant: one(tenants, {
		fields: [assettype.tenantId],
		references: [tenants.tenantId]
	}),
	prospectassets: many(prospectasset),
}));

export const auditlogRelations = relations(auditlog, ({one}) => ({
	tenant: one(tenants, {
		fields: [auditlog.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const calllogsRelations = relations(calllogs, ({one}) => ({
	tenant: one(tenants, {
		fields: [calllogs.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const communicationtypesRelations = relations(communicationtypes, ({one, many}) => ({
	tenant: one(tenants, {
		fields: [communicationtypes.tenantId],
		references: [tenants.tenantId]
	}),
	leadcommunications: many(leadcommunications),
}));

export const contacttypesRelations = relations(contacttypes, ({one, many}) => ({
	tenant: one(tenants, {
		fields: [contacttypes.tenantId],
		references: [tenants.tenantId]
	}),
	prospectcontacts: many(prospectcontact),
}));

export const crmpermissionsRelations = relations(crmpermissions, ({one}) => ({
	aspnetrole: one(aspnetroles, {
		fields: [crmpermissions.roleId],
		references: [aspnetroles.id]
	}),
	tenant: one(tenants, {
		fields: [crmpermissions.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const fbadaccountsRelations = relations(fbadaccounts, ({one, many}) => ({
	tenant: one(tenants, {
		fields: [fbadaccounts.tenantId],
		references: [tenants.tenantId]
	}),
	fbadpages: many(fbadpages),
}));

export const fbadformsRelations = relations(fbadforms, ({one, many}) => ({
	fbadpage: one(fbadpages, {
		fields: [fbadforms.fbAdPageId],
		references: [fbadpages.fbAdPageId]
	}),
	invproject: one(invprojects, {
		fields: [fbadforms.projectId],
		references: [invprojects.projectId]
	}),
	tenant: one(tenants, {
		fields: [fbadforms.tenantId],
		references: [tenants.tenantId]
	}),
	fbadleads: many(fbadleads),
	leads: many(leads),
}));

export const fbadpagesRelations = relations(fbadpages, ({one, many}) => ({
	fbadforms: many(fbadforms),
	fbadaccount: one(fbadaccounts, {
		fields: [fbadpages.fbAdAccountId],
		references: [fbadaccounts.fbAdAccountId]
	}),
	tenant: one(tenants, {
		fields: [fbadpages.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const invprojectsRelations = relations(invprojects, ({one, many}) => ({
	fbadforms: many(fbadforms),
	invinventories: many(invinventories),
	invphases: many(invphases),
	invarea: one(invareas, {
		fields: [invprojects.areaId],
		references: [invareas.areaId]
	}),
	tenant: one(tenants, {
		fields: [invprojects.tenantId],
		references: [tenants.tenantId]
	}),
	leads: many(leads),
	saleteamprojects: many(saleteamproject),
}));

export const fbadleadsRelations = relations(fbadleads, ({one}) => ({
	fbadform: one(fbadforms, {
		fields: [fbadleads.fbAdFormId],
		references: [fbadforms.fbAdFormId]
	}),
	tenant: one(tenants, {
		fields: [fbadleads.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const fbimportleadsRelations = relations(fbimportleads, ({one, many}) => ({
	leadsource: one(leadsources, {
		fields: [fbimportleads.leadSourceId],
		references: [leadsources.leadSourceId]
	}),
	saleteam: one(saleteams, {
		fields: [fbimportleads.saleTeamId],
		references: [saleteams.saleTeamId]
	}),
	tenant: one(tenants, {
		fields: [fbimportleads.tenantId],
		references: [tenants.tenantId]
	}),
	leads: many(leads),
}));

export const leadsourcesRelations = relations(leadsources, ({one, many}) => ({
	fbimportleads: many(fbimportleads),
	leads: many(leads),
	tenant: one(tenants, {
		fields: [leadsources.tenantId],
		references: [tenants.tenantId]
	}),
	prospects: many(prospects),
}));

export const saleteamsRelations = relations(saleteams, ({one, many}) => ({
	fbimportleads: many(fbimportleads),
	leads: many(leads),
	saleteammembers: many(saleteammembers),
	saleteamprojects: many(saleteamproject),
	tenant: one(tenants, {
		fields: [saleteams.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const invareasRelations = relations(invareas, ({one, many}) => ({
	invcity: one(invcities, {
		fields: [invareas.cityId],
		references: [invcities.cityId]
	}),
	tenant: one(tenants, {
		fields: [invareas.tenantId],
		references: [tenants.tenantId]
	}),
	invinventories: many(invinventories),
	invprojects: many(invprojects),
}));

export const invcitiesRelations = relations(invcities, ({one, many}) => ({
	invareas: many(invareas),
	tenant: one(tenants, {
		fields: [invcities.tenantId],
		references: [tenants.tenantId]
	}),
	invinventories: many(invinventories),
}));

export const invblocksRelations = relations(invblocks, ({one, many}) => ({
	invsector: one(invsectors, {
		fields: [invblocks.sectorId],
		references: [invsectors.sectorId]
	}),
	tenant: one(tenants, {
		fields: [invblocks.tenantId],
		references: [tenants.tenantId]
	}),
	invinventories: many(invinventories),
}));

export const invsectorsRelations = relations(invsectors, ({one, many}) => ({
	invblocks: many(invblocks),
	invinventories: many(invinventories),
	invphase: one(invphases, {
		fields: [invsectors.phaseId],
		references: [invphases.phaseId]
	}),
	tenant: one(tenants, {
		fields: [invsectors.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const invclientsRelations = relations(invclients, ({one, many}) => ({
	prospect: one(prospects, {
		fields: [invclients.prospectId],
		references: [prospects.prospectId]
	}),
	tenant: one(tenants, {
		fields: [invclients.tenantId],
		references: [tenants.tenantId]
	}),
	invinventories: many(invinventories),
}));

export const prospectsRelations = relations(prospects, ({one, many}) => ({
	invclients: many(invclients),
	leads: many(leads),
	prospectaddresses: many(prospectaddress),
	prospectassets: many(prospectasset),
	prospectcontacts: many(prospectcontact),
	leadsource: one(leadsources, {
		fields: [prospects.leadSourceId],
		references: [leadsources.leadSourceId]
	}),
	tenant: one(tenants, {
		fields: [prospects.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const invclienttypesRelations = relations(invclienttypes, ({one, many}) => ({
	tenant: one(tenants, {
		fields: [invclienttypes.tenantId],
		references: [tenants.tenantId]
	}),
	invinventories: many(invinventories),
}));

export const invfeaturesRelations = relations(invfeatures, ({one, many}) => ({
	tenant: one(tenants, {
		fields: [invfeatures.tenantId],
		references: [tenants.tenantId]
	}),
	invinventoryfeatures: many(invinventoryfeatures),
}));

export const invinventoriesRelations = relations(invinventories, ({one, many}) => ({
	invarea: one(invareas, {
		fields: [invinventories.areaId],
		references: [invareas.areaId]
	}),
	invblock: one(invblocks, {
		fields: [invinventories.blockId],
		references: [invblocks.blockId]
	}),
	invcity: one(invcities, {
		fields: [invinventories.cityId],
		references: [invcities.cityId]
	}),
	invclient: one(invclients, {
		fields: [invinventories.clientId],
		references: [invclients.clientId]
	}),
	invclienttype: one(invclienttypes, {
		fields: [invinventories.clientTypeId],
		references: [invclienttypes.clientTypeId]
	}),
	invoption: one(invoptions, {
		fields: [invinventories.optionId],
		references: [invoptions.optionId]
	}),
	invphase: one(invphases, {
		fields: [invinventories.phaseId],
		references: [invphases.phaseId]
	}),
	invproject: one(invprojects, {
		fields: [invinventories.projectId],
		references: [invprojects.projectId]
	}),
	invpurpose: one(invpurposes, {
		fields: [invinventories.purposeId],
		references: [invpurposes.purposeId]
	}),
	invsector: one(invsectors, {
		fields: [invinventories.sectorId],
		references: [invsectors.sectorId]
	}),
	invsize: one(invsizes, {
		fields: [invinventories.sizeId],
		references: [invsizes.sizeId]
	}),
	invstyle: one(invstyles, {
		fields: [invinventories.styleId],
		references: [invstyles.styleId]
	}),
	invtype: one(invtypes, {
		fields: [invinventories.typeId],
		references: [invtypes.typeId]
	}),
	tenant: one(tenants, {
		fields: [invinventories.tenantId],
		references: [tenants.tenantId]
	}),
	invinventoryfeatures: many(invinventoryfeatures),
	invinventorypricelogs: many(invinventorypricelog),
	leads: many(leads),
}));

export const invoptionsRelations = relations(invoptions, ({one, many}) => ({
	invinventories: many(invinventories),
	tenant: one(tenants, {
		fields: [invoptions.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const invphasesRelations = relations(invphases, ({one, many}) => ({
	invinventories: many(invinventories),
	invproject: one(invprojects, {
		fields: [invphases.projectId],
		references: [invprojects.projectId]
	}),
	tenant: one(tenants, {
		fields: [invphases.tenantId],
		references: [tenants.tenantId]
	}),
	invsectors: many(invsectors),
}));

export const invpurposesRelations = relations(invpurposes, ({one, many}) => ({
	invinventories: many(invinventories),
	tenant: one(tenants, {
		fields: [invpurposes.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const invsizesRelations = relations(invsizes, ({one, many}) => ({
	invinventories: many(invinventories),
	tenant: one(tenants, {
		fields: [invsizes.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const invstylesRelations = relations(invstyles, ({one, many}) => ({
	invinventories: many(invinventories),
	tenant: one(tenants, {
		fields: [invstyles.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const invtypesRelations = relations(invtypes, ({one, many}) => ({
	invinventories: many(invinventories),
	tenant: one(tenants, {
		fields: [invtypes.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const invinventoryfeaturesRelations = relations(invinventoryfeatures, ({one}) => ({
	invfeature: one(invfeatures, {
		fields: [invinventoryfeatures.featureId],
		references: [invfeatures.featureId]
	}),
	invinventory: one(invinventories, {
		fields: [invinventoryfeatures.inventoryId],
		references: [invinventories.inventoryId]
	}),
	tenant: one(tenants, {
		fields: [invinventoryfeatures.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const invinventorypricelogRelations = relations(invinventorypricelog, ({one}) => ({
	invinventory: one(invinventories, {
		fields: [invinventorypricelog.inventoryId],
		references: [invinventories.inventoryId]
	}),
	tenant: one(tenants, {
		fields: [invinventorypricelog.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const leadcommunicationsRelations = relations(leadcommunications, ({one}) => ({
	communicationtype: one(communicationtypes, {
		fields: [leadcommunications.communicationTypeId],
		references: [communicationtypes.communicationTypeId]
	}),
	lead: one(leads, {
		fields: [leadcommunications.leadId],
		references: [leads.leadId]
	}),
	status: one(statuses, {
		fields: [leadcommunications.statusId],
		references: [statuses.statusId]
	}),
	tenant: one(tenants, {
		fields: [leadcommunications.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const leadsRelations = relations(leads, ({one, many}) => ({
	leadcommunications: many(leadcommunications),
	fbadform: one(fbadforms, {
		fields: [leads.fbAdFormId],
		references: [fbadforms.fbAdFormId]
	}),
	fbimportlead: one(fbimportleads, {
		fields: [leads.fbImportLeadId],
		references: [fbimportleads.fbImportLeadId]
	}),
	invinventory: one(invinventories, {
		fields: [leads.inventoryId],
		references: [invinventories.inventoryId]
	}),
	invproject: one(invprojects, {
		fields: [leads.projectId],
		references: [invprojects.projectId]
	}),
	leadsource: one(leadsources, {
		fields: [leads.leadSourceId],
		references: [leadsources.leadSourceId]
	}),
	prospect: one(prospects, {
		fields: [leads.prospectId],
		references: [prospects.prospectId]
	}),
	saleteam: one(saleteams, {
		fields: [leads.saleTeamId],
		references: [saleteams.saleTeamId]
	}),
	staff: one(staffs, {
		fields: [leads.staffId],
		references: [staffs.staffId]
	}),
	status: one(statuses, {
		fields: [leads.statusId],
		references: [statuses.statusId]
	}),
	tenant: one(tenants, {
		fields: [leads.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const statusesRelations = relations(statuses, ({one, many}) => ({
	leadcommunications: many(leadcommunications),
	leads: many(leads),
	tenant: one(tenants, {
		fields: [statuses.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const staffsRelations = relations(staffs, ({one, many}) => ({
	leads: many(leads),
	saleteammembers: many(saleteammembers),
	aspnetuser: one(aspnetusers, {
		fields: [staffs.aspNetUserId],
		references: [aspnetusers.id]
	}),
	tenant: one(tenants, {
		fields: [staffs.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const prospectaddressRelations = relations(prospectaddress, ({one}) => ({
	prospect: one(prospects, {
		fields: [prospectaddress.prospectId],
		references: [prospects.prospectId]
	}),
	tenant: one(tenants, {
		fields: [prospectaddress.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const prospectassetRelations = relations(prospectasset, ({one}) => ({
	assettype: one(assettype, {
		fields: [prospectasset.assetTypeId],
		references: [assettype.assetTypeId]
	}),
	prospect: one(prospects, {
		fields: [prospectasset.prospectId],
		references: [prospects.prospectId]
	}),
	tenant: one(tenants, {
		fields: [prospectasset.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const prospectcontactRelations = relations(prospectcontact, ({one}) => ({
	contacttype: one(contacttypes, {
		fields: [prospectcontact.contactTypeId],
		references: [contacttypes.contactTypeId]
	}),
	prospect: one(prospects, {
		fields: [prospectcontact.prospectId],
		references: [prospects.prospectId]
	}),
	tenant: one(tenants, {
		fields: [prospectcontact.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const saleteammembersRelations = relations(saleteammembers, ({one}) => ({
	saleteam: one(saleteams, {
		fields: [saleteammembers.saleTeamId],
		references: [saleteams.saleTeamId]
	}),
	staff: one(staffs, {
		fields: [saleteammembers.staffId],
		references: [staffs.staffId]
	}),
	tenant: one(tenants, {
		fields: [saleteammembers.tenantId],
		references: [tenants.tenantId]
	}),
}));

export const saleteamprojectRelations = relations(saleteamproject, ({one}) => ({
	invproject: one(invprojects, {
		fields: [saleteamproject.projectId],
		references: [invprojects.projectId]
	}),
	saleteam: one(saleteams, {
		fields: [saleteamproject.saleTeamId],
		references: [saleteams.saleTeamId]
	}),
	tenant: one(tenants, {
		fields: [saleteamproject.tenantId],
		references: [tenants.tenantId]
	}),
}));