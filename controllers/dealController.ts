/// <reference path="../types/express.d.ts" />
import { db } from "../lib/index.js";
import {
    deals,
    prospects,
    invinventories,
    invprojects,
    invtypes,
    staffs,
    aspnetusers,
} from "../lib/db/schema.js";
import { eq, and, or, ne } from "drizzle-orm";
import type { Request, Response } from "express";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Validation Schemas
// ---------------------------------------------------------------------------

const decimalStringSchema = (defaultValue = "0.00") =>
    z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? defaultValue : String(val)),
        z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid decimal format")
    );

const createDealSchema = z.object({
    leadId: z.number().int().optional().nullable(),
    prospectId: z.number().int(),
    inventoryId: z.number().int().optional().nullable(),
    staffId: z.string().optional().nullable(),
    dealValue: decimalStringSchema("0.00"),
    commissionRate: decimalStringSchema("0.00").optional().nullable(),
    downPayment: decimalStringSchema("0.00").optional().nullable(),
    paymentPlan: z.string().optional().nullable(),
    status: z.enum(["negotiation", "closed_won", "closed_lost", "pending_legal"]).default("negotiation"),
    expectedClosingDate: z.string().optional().nullable(),
    closedAt: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});

const updateDealSchema = createDealSchema.partial();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Base query — fetches all deal rows with their joined display fields.
 * Returns raw Drizzle rows; callers map them into response shape.
 */
function buildDealListQuery(tenantId: number) {
    return db
        .selectDistinct({
            // Core deal fields
            dealId: deals.dealId,
            dealValue: deals.dealValue,
            commissionRate: deals.commissionRate,
            downPayment: deals.downPayment,
            paymentPlan: deals.paymentPlan,
            status: deals.status,
            expectedClosingDate: deals.expectedClosingDate,
            closedAt: deals.closedAt,
            notes: deals.notes,
            createdAt: deals.createdAt,
            updatedAt: deals.updatedAt,
            leadId: deals.leadId,
            prospectId: deals.prospectId,
            inventoryId: deals.inventoryId,
            staffId: deals.staffId,

            // Customer
            customerName: prospects.fullName,
            customerAddress: prospects.address,

            // Inventory — for "Deal" column
            inventoryDescription: invinventories.description,
            inventoryStatus: invinventories.status,

            // Project — subtitle location context
            projectName: invprojects.description,

            // Type — subtitle (e.g. "Luxury Penthouse")
            typeName: invtypes.description,

            // Agent
            agentFirstName: aspnetusers.firstName,
            agentLastName: aspnetusers.lastName,
        })
        .from(deals)
        .leftJoin(prospects, eq(deals.prospectId, prospects.prospectId))
        .leftJoin(invinventories, eq(deals.inventoryId, invinventories.inventoryId))
        .leftJoin(invprojects, eq(invinventories.projectId, invprojects.projectId))
        .leftJoin(invtypes, eq(invinventories.typeId, invtypes.typeId))
        .leftJoin(staffs, eq(deals.staffId, staffs.staffId))
        .leftJoin(aspnetusers, eq(staffs.aspNetUserId, aspnetusers.id))
        .where(eq(deals.tenantId, tenantId));
}

/** Maps a raw joined row into the API response shape */
function mapDealRow(row: Awaited<ReturnType<typeof buildDealListQuery>>[number]) {
    const agentName =
        row.agentFirstName || row.agentLastName
            ? `${row.agentFirstName ?? ""} ${row.agentLastName ?? ""}`.trim()
            : null;

    // "Plot 402 – Ali Khan" style label
    const dealLabel =
        row.inventoryDescription && row.customerName
            ? `${row.inventoryDescription} – ${row.customerName}`
            : row.inventoryDescription ?? row.customerName ?? `Deal #${row.dealId}`;

    return {
        dealId: row.dealId,
        dealLabel,                          // Deal column line 1
        dealSubtitle: row.typeName ?? null, // Deal column line 2 (e.g. "Luxury Penthouse")
        customer: {
            prospectId: row.prospectId,
            name: row.customerName,
            address: row.customerAddress ?? null,
        },
        inventory: {
            inventoryId: row.inventoryId ?? null,
            description: row.inventoryDescription ?? null,
            projectName: row.projectName ?? null,
            typeName: row.typeName ?? null,
            status: row.inventoryStatus ?? null,
        },
        agent: {
            staffId: row.staffId ?? null,
            name: agentName,
        },
        financial: {
            dealValue: row.dealValue,
            commissionRate: row.commissionRate ?? null,
            downPayment: row.downPayment ?? null,
            paymentPlan: row.paymentPlan ?? null,
        },
        status: row.status,
        expectedClosingDate: row.expectedClosingDate ?? null,
        closedAt: row.closedAt ?? null,
        notes: row.notes ?? null,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------

const dealController = {
    // GET /apis/deal
    getDeals: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId; // 🔹 dynamic
            const rows = await buildDealListQuery(tenantId);
            const data = rows.map(mapDealRow);

            res.status(200).json({
                success: true,
                data,
                total: data.length,
            });
        } catch (error) {
            console.error("getDeals error:", error);
            res.status(500).json({ success: false, message: "Failed to fetch deals." });
        }
    },

    // GET /apis/deal/:id
    getDealById: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId; // 🔹 dynamic
            const id = parseInt(req.params.id as string, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "Invalid deal ID." });
                return;
            }

            // Re-query with additional where clause for efficiency
            const result = await db
                .select({
                    dealId: deals.dealId,
                    dealValue: deals.dealValue,
                    commissionRate: deals.commissionRate,
                    downPayment: deals.downPayment,
                    paymentPlan: deals.paymentPlan,
                    status: deals.status,
                    expectedClosingDate: deals.expectedClosingDate,
                    closedAt: deals.closedAt,
                    notes: deals.notes,
                    createdAt: deals.createdAt,
                    updatedAt: deals.updatedAt,
                    leadId: deals.leadId,
                    prospectId: deals.prospectId,
                    inventoryId: deals.inventoryId,
                    staffId: deals.staffId,
                    customerName: prospects.fullName,
                    customerAddress: prospects.address,
                    inventoryDescription: invinventories.description,
                    inventoryStatus: invinventories.status,
                    projectName: invprojects.description,
                    typeName: invtypes.description,
                    agentFirstName: aspnetusers.firstName,
                    agentLastName: aspnetusers.lastName,
                })
                .from(deals)
                .leftJoin(prospects, eq(deals.prospectId, prospects.prospectId))
                .leftJoin(invinventories, eq(deals.inventoryId, invinventories.inventoryId))
                .leftJoin(invprojects, eq(invinventories.projectId, invprojects.projectId))
                .leftJoin(invtypes, eq(invinventories.typeId, invtypes.typeId))
                .leftJoin(staffs, eq(deals.staffId, staffs.staffId))
                .leftJoin(aspnetusers, eq(staffs.aspNetUserId, aspnetusers.id))
                .where(and(eq(deals.tenantId, tenantId), eq(deals.dealId, id)));

            //   if (!result.length) {
            //     res.status(404).json({ success: false, message: "Deal not found." });
            //     return;
            //   }

            //   res.status(200).json({ success: true, data: mapDealRow(result[0]) });
            const deal = result.at(0);
            if (!deal) {
                res.status(404).json({ success: false, message: "Deal not found." });
                return;
            }

            res.status(200).json({ success: true, data: mapDealRow(deal) });
        } catch (error) {
            console.error("getDealById error:", error);
            res.status(500).json({ success: false, message: "Failed to fetch deal." });
        }
    },

    // POST /apis/deal
    createDeal: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId; // 🔹 dynamic
            const parsed = createDealSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed.",
                    errors: parsed.error.flatten().fieldErrors,
                });
                return;
            }

            const data = parsed.data;

            const dealId = await db.transaction(async (tx) => {
                if (data.inventoryId) {
                    const [inventory] = await tx
                        .select({ status: invinventories.status })
                        .from(invinventories)
                        .where(
                            and(
                                eq(invinventories.inventoryId, data.inventoryId),
                                eq(invinventories.tenantId, tenantId)
                            )
                        )
                        .limit(1);

                    if (!inventory) {
                        throw new Error("Selected property inventory not found.");
                    }

                    if (inventory.status === "sold" || inventory.status === "transferred") {
                        throw new Error(`The selected property is already ${inventory.status}.`);
                    }

                    let newInvStatus: "available" | "reserved" | "sold" | "transferred" = "available";
                    if (data.status === "closed_won") {
                        newInvStatus = "sold";
                    } else if (data.status === "negotiation" || data.status === "pending_legal") {
                        newInvStatus = "reserved";
                    } else if (data.status === "closed_lost") {
                        // Check if there are other active/negotiating deals for this property
                        const activeDeals = await tx
                            .select({ dealId: deals.dealId })
                            .from(deals)
                            .where(
                                and(
                                    eq(deals.inventoryId, data.inventoryId),
                                    eq(deals.tenantId, tenantId),
                                    or(
                                        eq(deals.status, "negotiation"),
                                        eq(deals.status, "pending_legal")
                                    )
                                )
                            )
                            .limit(1);
                        newInvStatus = activeDeals.length > 0 ? "reserved" : "available";
                    }

                    await tx
                        .update(invinventories)
                        .set({ status: newInvStatus })
                        .where(eq(invinventories.inventoryId, data.inventoryId));
                }

                const [insertResult] = await tx.insert(deals).values({
                    tenantId: tenantId,
                    leadId: data.leadId ?? null,
                    prospectId: data.prospectId,
                    inventoryId: data.inventoryId ?? null,
                    staffId: data.staffId ?? null,
                    dealValue: data.dealValue,
                    commissionRate: data.commissionRate ?? null,
                    downPayment: data.downPayment ?? null,
                    paymentPlan: data.paymentPlan ?? null,
                    status: data.status,
                    expectedClosingDate: data.expectedClosingDate ?? null,
                    closedAt: data.closedAt ?? null,
                    notes: data.notes ?? null,
                });

                return insertResult.insertId;
            });

            res.status(201).json({
                success: true,
                message: "Deal created successfully.",
                dealId,
            });
        } catch (error) {
            console.error("createDeal error:", error);
            res.status(500).json({ success: false, message: "Failed to create deal." });
        }
    },

    // PUT /apis/deal/:id
    updateDeal: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId; // 🔹 dynamic
            const id = parseInt(req.params.id as string, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "Invalid deal ID." });
                return;
            }

            const parsed = updateDealSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed.",
                    errors: parsed.error.flatten().fieldErrors,
                });
                return;
            }

            const data = parsed.data;

            await db.transaction(async (tx) => {
                const existing = await tx
                    .select({
                        dealId: deals.dealId,
                        inventoryId: deals.inventoryId,
                        status: deals.status,
                    })
                    .from(deals)
                    .where(and(eq(deals.tenantId, tenantId), eq(deals.dealId, id)))
                    .limit(1);

                const existingDeal = existing[0];
                if (!existingDeal) {
                    throw new Error("Deal not found.");
                }

                const oldInventoryId = existingDeal.inventoryId;
                const newInventoryId = data.inventoryId !== undefined ? data.inventoryId : oldInventoryId;
                const oldDealStatus = existingDeal.status;
                const newDealStatus = data.status !== undefined ? data.status : oldDealStatus;

                if (newInventoryId !== oldInventoryId) {
                    if (oldInventoryId) {
                        const activeDeals = await tx
                            .select({ dealId: deals.dealId })
                            .from(deals)
                            .where(
                                and(
                                    eq(deals.inventoryId, oldInventoryId),
                                    eq(deals.tenantId, tenantId),
                                    ne(deals.dealId, id),
                                    or(
                                        eq(deals.status, "negotiation"),
                                        eq(deals.status, "pending_legal")
                                    )
                                )
                            )
                            .limit(1);
                        const oldInvStatus = activeDeals.length > 0 ? "reserved" : "available";
                        await tx
                            .update(invinventories)
                            .set({ status: oldInvStatus })
                            .where(eq(invinventories.inventoryId, oldInventoryId));
                    }

                    if (newInventoryId) {
                        const [newInventory] = await tx
                            .select({ status: invinventories.status })
                            .from(invinventories)
                            .where(
                                and(
                                    eq(invinventories.inventoryId, newInventoryId),
                                    eq(invinventories.tenantId, tenantId)
                                )
                            )
                            .limit(1);

                        if (!newInventory) {
                            throw new Error("New property inventory not found.");
                        }

                        if (newInventory.status === "sold" || newInventory.status === "transferred") {
                            throw new Error(`The selected property is already ${newInventory.status}.`);
                        }

                        let newInvStatus: "available" | "reserved" | "sold" | "transferred" = "available";
                        if (newDealStatus === "closed_won") {
                            newInvStatus = "sold";
                        } else if (newDealStatus === "negotiation" || newDealStatus === "pending_legal") {
                            newInvStatus = "reserved";
                        } else if (newDealStatus === "closed_lost") {
                            const activeDeals = await tx
                                .select({ dealId: deals.dealId })
                                .from(deals)
                                .where(
                                    and(
                                        eq(deals.inventoryId, newInventoryId),
                                        eq(deals.tenantId, tenantId),
                                        ne(deals.dealId, id),
                                        or(
                                            eq(deals.status, "negotiation"),
                                            eq(deals.status, "pending_legal")
                                        )
                                    )
                                )
                                .limit(1);
                            newInvStatus = activeDeals.length > 0 ? "reserved" : "available";
                        }

                        await tx
                            .update(invinventories)
                            .set({ status: newInvStatus })
                            .where(eq(invinventories.inventoryId, newInventoryId));
                    }
                } else if (newInventoryId && newDealStatus !== oldDealStatus) {
                    let newInvStatus: "available" | "reserved" | "sold" | "transferred" = "available";
                    if (newDealStatus === "closed_won") {
                        newInvStatus = "sold";
                    } else if (newDealStatus === "negotiation" || newDealStatus === "pending_legal") {
                        newInvStatus = "reserved";
                    } else if (newDealStatus === "closed_lost") {
                        const activeDeals = await tx
                            .select({ dealId: deals.dealId })
                            .from(deals)
                            .where(
                                and(
                                    eq(deals.inventoryId, newInventoryId),
                                    eq(deals.tenantId, tenantId),
                                    ne(deals.dealId, id),
                                    or(
                                        eq(deals.status, "negotiation"),
                                        eq(deals.status, "pending_legal")
                                    )
                                )
                            )
                            .limit(1);
                        newInvStatus = activeDeals.length > 0 ? "reserved" : "available";
                    }

                    await tx
                        .update(invinventories)
                        .set({ status: newInvStatus })
                        .where(eq(invinventories.inventoryId, newInventoryId));
                }

                await tx
                    .update(deals)
                    .set({
                        ...(data.leadId !== undefined && { leadId: data.leadId }),
                        ...(data.prospectId !== undefined && { prospectId: data.prospectId }),
                        ...(data.inventoryId !== undefined && { inventoryId: data.inventoryId }),
                        ...(data.staffId !== undefined && { staffId: data.staffId }),
                        ...(data.dealValue !== undefined && { dealValue: data.dealValue }),
                        ...(data.commissionRate !== undefined && { commissionRate: data.commissionRate }),
                        ...(data.downPayment !== undefined && { downPayment: data.downPayment }),
                        ...(data.paymentPlan !== undefined && { paymentPlan: data.paymentPlan }),
                        ...(data.status !== undefined && { status: data.status }),
                        ...(data.expectedClosingDate !== undefined && { expectedClosingDate: data.expectedClosingDate }),
                        ...(data.closedAt !== undefined && { closedAt: data.closedAt }),
                        ...(data.notes !== undefined && { notes: data.notes }),
                        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
                    })
                    .where(eq(deals.dealId, id));
            });

            res.status(200).json({ success: true, message: "Deal updated successfully." });
        } catch (error) {
            console.error("updateDeal error:", error);
            res.status(500).json({ success: false, message: "Failed to update deal." });
        }
    },

    // DELETE /apis/deal/:id
    deleteDeal: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId; // 🔹 dynamic
            const id = parseInt(req.params.id as string, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "Invalid deal ID." });
                return;
            }

            await db.transaction(async (tx) => {
                const existing = await tx
                    .select({ dealId: deals.dealId, inventoryId: deals.inventoryId })
                    .from(deals)
                    .where(and(eq(deals.tenantId, tenantId), eq(deals.dealId, id)))
                    .limit(1);

                const existingDeal = existing[0];
                if (!existingDeal) {
                    throw new Error("Deal not found.");
                }

                if (existingDeal.inventoryId) {
                    const activeDeals = await tx
                        .select({ dealId: deals.dealId })
                        .from(deals)
                        .where(
                            and(
                                eq(deals.inventoryId, existingDeal.inventoryId),
                                eq(deals.tenantId, tenantId),
                                ne(deals.dealId, id),
                                or(
                                    eq(deals.status, "negotiation"),
                                    eq(deals.status, "pending_legal")
                                )
                            )
                        )
                        .limit(1);

                    const newInvStatus = activeDeals.length > 0 ? "reserved" : "available";

                    await tx
                        .update(invinventories)
                        .set({ status: newInvStatus })
                        .where(eq(invinventories.inventoryId, existingDeal.inventoryId));
                }

                await tx
                    .delete(deals)
                    .where(eq(deals.dealId, id));
            });

            res.status(200).json({ success: true, message: "Deal deleted successfully." });
        } catch (error) {
            console.error("deleteDeal error:", error);
            res.status(500).json({ success: false, message: "Failed to delete deal." });
        }
    },
};

export default dealController;