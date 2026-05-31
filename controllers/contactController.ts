/// <reference path="../types/express.d.ts" />
import { db } from "../lib/index.js";
import {
    prospects,
    prospectcontact,
    leads,
    statuses,
    invprojects,
    invinventories,
    meetings,
    prospectaddress,
} from "../lib/db/schema.js";
import { eq, and, desc, sql } from "drizzle-orm";
import type { Request, Response } from "express";

const contactController = {
    /**
 * POST /createContact
 */
    createContact: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId; // 🔹 dynamic
            const body = req.body;

            // Basic validation
            if (!body.fullName?.trim()) {
                return res.status(400).json({ success: false, message: "fullName is required" });
            }

            await db.transaction(async (tx) => {
                // Insert prospect
                const [result] = await tx.insert(prospects).values({
                    tenantId: tenantId,
                    fullName: body.fullName.trim(),
                    gender: body.gender ?? null,
                    maritalStatus: body.maritalStatus ?? null,
                    nationality: body.nationality ?? "Pakistani",
                    profession: body.profession ?? null,
                    email: body.email ?? null,
                    primaryPhone: body.primaryPhone ?? null,
                    notes: body.notes ?? null,
                });

                const newProspectId = result.insertId;

                // Insert contact numbers if provided
                if (Array.isArray(body.contactNumbers) && body.contactNumbers.length > 0) {
                    await tx.insert(prospectcontact).values(
                        body.contactNumbers.map((c: any) => ({
                            tenantId: tenantId,
                            prospectId: newProspectId,
                            contactTypeId: c.contactTypeId,
                            contactNo: c.contactNo,
                            isPrimary: c.isPrimary ? 1 : 0,
                        }))
                    );
                }

                // Insert address if provided
                if (body.address) {
                    await tx.insert(prospectaddress).values({
                        tenantId: tenantId,
                        prospectId: newProspectId,
                        label: body.address.label ?? "Home",
                        street: body.address.street ?? null,
                        area: body.address.area ?? null,
                        city: body.address.city ?? null,
                        country: body.address.country ?? "Pakistan",
                        isPrimary: 1,
                    });
                }
            });

            return res.status(201).json({ success: true, message: "Contact created successfully" });
        } catch (error) {
            console.error("[createContact]", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    /**
     * PATCH /updateContact/:id
     */
    updateContact: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId; // 🔹 dynamic
            const prospectId = parseInt(req.params.id as string);
            if (isNaN(prospectId)) {
                return res.status(400).json({ success: false, message: "Invalid contact ID" });
            }

            const body = req.body;

            // Verify ownership
            const [existing] = await db
                .select({ prospectId: prospects.prospectId })
                .from(prospects)
                .where(and(eq(prospects.prospectId, prospectId), eq(prospects.tenantId, tenantId)))
                .limit(1);

            if (!existing) {
                return res.status(404).json({ success: false, message: "Contact not found" });
            }

            await db.transaction(async (tx) => {
                // Build only the fields that were sent
                const updateData: Record<string, any> = { updatedAt: sql`CURRENT_TIMESTAMP` };
                if (body.fullName !== undefined) updateData.fullName = body.fullName.trim();
                if (body.gender !== undefined) updateData.gender = body.gender;
                if (body.maritalStatus !== undefined) updateData.maritalStatus = body.maritalStatus;
                if (body.nationality !== undefined) updateData.nationality = body.nationality;
                if (body.profession !== undefined) updateData.profession = body.profession;
                if (body.email !== undefined) updateData.email = body.email;
                if (body.primaryPhone !== undefined) updateData.primaryPhone = body.primaryPhone;
                if (body.notes !== undefined) updateData.notes = body.notes;

                await tx
                    .update(prospects)
                    .set(updateData)
                    .where(and(eq(prospects.prospectId, prospectId), eq(prospects.tenantId, tenantId)));

                // Replace contact numbers if provided
                if (Array.isArray(body.contactNumbers)) {
                    // Fetch existing contact IDs for this prospect
                    const existing = await tx
                        .select({ prospectContactId: prospectcontact.prospectContactId })
                        .from(prospectcontact)
                        .where(and(eq(prospectcontact.prospectId, prospectId), eq(prospectcontact.tenantId, tenantId)));

                    const existingIds = existing.map((e) => e.prospectContactId);
                    const incomingIds = body.contactNumbers
                        .filter((c: any) => c.prospectContactId)
                        .map((c: any) => c.prospectContactId);

                    // Delete removed ones
                    const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
                    for (const id of toDelete) {
                        await tx.delete(prospectcontact).where(
                            and(eq(prospectcontact.prospectContactId, id), eq(prospectcontact.tenantId, tenantId))
                        );
                    }

                    for (const c of body.contactNumbers) {
                        if (c.prospectContactId) {
                            // Update existing
                            await tx.update(prospectcontact)
                                .set({
                                    contactTypeId: c.contactTypeId,
                                    contactNo: c.contactNo,
                                    isPrimary: c.isPrimary ? 1 : 0,
                                })
                                .where(
                                    and(
                                        eq(prospectcontact.prospectContactId, c.prospectContactId),
                                        eq(prospectcontact.tenantId, tenantId)  // security guard
                                    )
                                );
                        } else {
                            // Insert new
                            await tx.insert(prospectcontact).values({
                                tenantId: tenantId,
                                prospectId,
                                contactTypeId: c.contactTypeId,
                                contactNo: c.contactNo,
                                isPrimary: c.isPrimary ? 1 : 0,
                            });
                        }
                    }
                }

                // Replace address if provided
                if (body.address !== undefined) {
                    await tx
                        .delete(prospectaddress)
                        .where(and(eq(prospectaddress.prospectId, prospectId), eq(prospectaddress.tenantId, tenantId)));

                    if (body.address) {
                        await tx.insert(prospectaddress).values({
                            tenantId: tenantId,
                            prospectId,
                            label: body.address.label ?? "Home",
                            street: body.address.street ?? null,
                            area: body.address.area ?? null,
                            city: body.address.city ?? null,
                            country: body.address.country ?? "Pakistan",
                            isPrimary: 1,
                        });
                    }
                }
            });

            return res.status(200).json({ success: true, message: "Contact updated successfully" });
        } catch (error) {
            console.error("[updateContact]", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    /**
     * GET /getContacts
     * Returns paginated list of prospects for the tenant.
     * Each row includes primary phone, email, latest lead's project,
     * inventory (property interest), and status.
     * No server-side filtering — filtering is handled on the frontend.
     */
    getContacts: async (req: Request, res: Response) => {
        try {
            //   const page = Math.max(1, parseInt(req.query.page as string) || 1);
            //   const limit = Math.min(
            //     100,
            //     Math.max(1, parseInt(req.query.limit as string) || 20)
            //   );
            //   const offset = (page - 1) * limit;

            // Subquery: get the latest LeadID per prospect, scoped to this tenant
            const tenantId = req.user!.tenantId; // 🔹 dynamic
            const latestLeadSubquery = db
                .select({
                    prospectId: leads.prospectId,
                    latestLeadId: sql<number>`MAX(${leads.leadId})`.as("latestLeadId"),
                })
                .from(leads)
                .where(eq(leads.tenantId, tenantId))
                .groupBy(leads.prospectId)
                .as("latestLead");

            const rows = await db
                .select({
                    // Prospect core
                    prospectId: prospects.prospectId,
                    fullName: prospects.fullName,
                    email: prospects.email,
                    primaryPhone: prospects.primaryPhone,

                    // Primary contact number from prospectcontact (overrides if exists)
                    contactNumber: prospectcontact.contactNo,

                    // Property Interest
                    projectDescription: invprojects.description,
                    inventoryDescription: invinventories.description,

                    // Status from latest lead
                    statusId: statuses.statusId,
                    statusDescription: statuses.description,
                    statusColor: statuses.color,

                    // Latest lead metadata
                    latestLeadId: latestLeadSubquery.latestLeadId,
                })
                .from(prospects)
                // Join primary contact number
                .leftJoin(
                    prospectcontact,
                    and(
                        eq(prospectcontact.prospectId, prospects.prospectId),
                        eq(prospectcontact.tenantId, tenantId),
                        eq(prospectcontact.isPrimary, 1)
                    )
                )
                // Join latest lead subquery
                .leftJoin(
                    latestLeadSubquery,
                    eq(latestLeadSubquery.prospectId, prospects.prospectId)
                )
                // Join leads table on the latest lead ID, strictly tenant-scoped
                .leftJoin(
                    leads,
                    and(
                        eq(leads.leadId, latestLeadSubquery.latestLeadId),
                        eq(leads.tenantId, tenantId)
                    )
                )
                // Join project, strictly tenant-scoped
                .leftJoin(
                    invprojects,
                    and(
                        eq(invprojects.projectId, leads.projectId),
                        eq(invprojects.tenantId, tenantId)
                    )
                )
                // Join inventory, strictly tenant-scoped
                .leftJoin(
                    invinventories,
                    and(
                        eq(invinventories.inventoryId, leads.inventoryId),
                        eq(invinventories.tenantId, tenantId)
                    )
                )
                // Join status — statuses may be shared (tenantId 1) or tenant-specific;
                // no tenantId guard here since statuses.tenantId may differ by design.
                // If you confirm statuses are always tenant-scoped, add the guard back.
                .leftJoin(statuses, eq(statuses.statusId, leads.statusId))
                .where(
                    and(
                        eq(prospects.tenantId, tenantId),
                        eq(prospects.isActive, 1)
                    )
                )
                .orderBy(desc(prospects.createdAt))
            // .limit(limit)
            // .offset(offset);

            // Total count for pagination metadata
            //   const [{ total }] = await db
            //     .select({ total: sql<number>`COUNT(*)` })
            //     .from(prospects)
            //     .where(
            //       and(
            //         eq(prospects.tenantId, tenantId),
            //         eq(prospects.isActive, 1)
            //       )
            //     );

            return res.status(200).json({
                success: true,
                data: rows,
                // pagination: {
                //   page,
                //   limit,
                //   total,
                //   totalPages: Math.ceil(total / limit),
                // },
            });
        } catch (error) {
            console.error("[getContacts]", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    /**
     * GET /getContact/:id
     * Returns a single prospect with full detail.
     * tenantId guard ensures cross-tenant access is impossible.
     */
    getContact: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId; // 🔹 dynamic
            const prospectId = parseInt((req.params.id) as string);
            if (isNaN(prospectId)) {
                return res.status(400).json({ success: false, message: "Invalid contact ID" });
            }

            // Fetch base prospect — tenantId guard is the security boundary
            const [prospect] = await db
                .select()
                .from(prospects)
                .where(
                    and(
                        eq(prospects.prospectId, prospectId),
                        eq(prospects.tenantId, tenantId)   // <-- prevents cross-tenant reads
                    )
                )
                .limit(1);

            if (!prospect) {
                return res.status(404).json({ success: false, message: "Contact not found" });
            }

            // All contact numbers for this prospect
            const contactNumbers = await db
                .select()
                .from(prospectcontact)
                .where(
                    and(
                        eq(prospectcontact.prospectId, prospectId),
                        eq(prospectcontact.tenantId, tenantId)
                    )
                );

            // All leads for this prospect, with status + property info
            const prospectLeads = await db
                .select({
                    leadId: leads.leadId,
                    leadDate: leads.leadDate,
                    priority: leads.priority,
                    budget: leads.budget,
                    followUpOn: leads.followUpOn,
                    expectedCloseDate: leads.expectedCloseDate,
                    statusDescription: statuses.description,
                    statusColor: statuses.color,
                    projectDescription: invprojects.description,
                    inventoryDescription: invinventories.description,
                })
                .from(leads)
                .leftJoin(statuses, eq(statuses.statusId, leads.statusId))
                .leftJoin(
                    invprojects,
                    and(
                        eq(invprojects.projectId, leads.projectId),
                        eq(invprojects.tenantId, tenantId)
                    )
                )
                .leftJoin(
                    invinventories,
                    and(
                        eq(invinventories.inventoryId, leads.inventoryId),
                        eq(invinventories.tenantId, tenantId)
                    )
                )
                .where(
                    and(
                        eq(leads.prospectId, prospectId),
                        eq(leads.tenantId, tenantId)         // <-- prevents cross-tenant reads
                    )
                )
                .orderBy(desc(leads.leadId));

            return res.status(200).json({
                success: true,
                data: {
                    ...prospect,
                    contactNumbers,
                    leads: prospectLeads,
                },
            });
        } catch (error) {
            console.error("[getContact]", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    /**
     * DELETE /deleteContact/:id
     * Hard deletes the prospect and all cascade-linked records
     * (prospectcontact, prospectaddress, prospectasset are ON DELETE CASCADE in schema).
     * tenantId guard ensures a tenant can never delete another tenant's record.
     */
    deleteContact: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId; // 🔹 dynamic
            const prospectId = parseInt((req.params.id) as string);
            if (isNaN(prospectId)) {
                return res.status(400).json({ success: false, message: "Invalid contact ID" });
            }

            // Verify the prospect belongs to this tenant before deleting
            const [existing] = await db
                .select({ prospectId: prospects.prospectId })
                .from(prospects)
                .where(
                    and(
                        eq(prospects.prospectId, prospectId),
                        eq(prospects.tenantId, tenantId)   // <-- security boundary
                    )
                )
                .limit(1);

            if (!existing) {
                // Return 404 regardless of whether it exists on another tenant
                // — do not leak existence of other tenants' records
                return res.status(404).json({ success: false, message: "Contact not found" });
            }

            await db.delete(meetings).where(and(
                eq(meetings.prospectId, prospectId),
                eq(meetings.tenantId, tenantId)
            ));

            await db
                .delete(prospects)
                .where(
                    and(
                        eq(prospects.prospectId, prospectId),
                        eq(prospects.tenantId, tenantId)   // <-- double-guard on the delete itself
                    )
                );

            return res.status(200).json({ success: true, message: "Contact deleted successfully" });
        } catch (error) {
            console.error("[deleteContact]", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
};

export default contactController;