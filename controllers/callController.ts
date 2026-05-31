/// <reference path="../types/express.d.ts" />
import { db } from "../lib/index.js";
import { calls, prospects, deals, aspnetusers, invinventories } from "../lib/db/schema.js";
import { eq, and, desc, like, gte, lte } from "drizzle-orm";
import type { Request, Response } from "express";
import { z } from "zod";

// ─── Validation Schemas ────────────────────────────────────────────────────

const createCallSchema = z.object({
    subject: z.string().min(1, "Subject is required").max(255),
    type: z.enum(["Inbound", "Outbound"]).default("Outbound"),
    startTime: z.string().optional(), // ISO datetime string e.g. "2024-09-22T10:30:00"
    duration: z
        .string()
        .regex(/^\d{2}:\d{2}$/, "Duration must be in MM:SS format")
        .optional(),
    prospectId: z.number().int().positive().optional(),
    dealId: z.number().int().positive().optional(),
    description: z.string().optional(),
    status: z
        .enum(["Scheduled", "Completed", "Missed", "Cancelled"])
        .default("Scheduled"),
});

const updateCallSchema = createCallSchema.partial();

// ─── Controller ────────────────────────────────────────────────────────────

const callController = {
    // GET /calls
    // Supports filters: type, status, prospectId, dealId, dateFrom, dateTo, search
    getCalls: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId;
            const { type, status, prospectId, dealId, dateFrom, dateTo, search } =
                req.query;

            const allCalls = await db
                .select({
                    id: calls.id,
                    subject: calls.subject,
                    type: calls.type,
                    startTime: calls.startTime,
                    duration: calls.duration,
                    status: calls.status,
                    description: calls.description,
                    // Prospect info
                    prospectId: prospects.prospectId,
                    prospectName: prospects.fullName,
                    prospectPhone: prospects.primaryPhone,
                    // Deal info
                    dealId: deals.dealId,
                    inventoryDescription: invinventories.description, // TODO: confirm deal title column name in your deals table
                    // Owner info
                    userId: aspnetusers.id,
                    ownerFirstName: aspnetusers.firstName,
                    ownerLastName: aspnetusers.lastName,
                    ownerAvatar: aspnetusers.avatarUrl, // TODO: confirm column name in your aspnetusers table
                })
                .from(calls)
                .leftJoin(prospects, eq(calls.prospectId, prospects.prospectId))
                .leftJoin(deals, eq(calls.dealId, deals.dealId))
                .leftJoin(invinventories, eq(deals.inventoryId, invinventories.inventoryId))
                .leftJoin(aspnetusers, eq(calls.userId, aspnetusers.id))
                .where(
                    and(
                        eq(calls.tenantId, tenantId),
                        type ? eq(calls.type, type as "Inbound" | "Outbound") : undefined,
                        status
                            ? eq(
                                calls.status,
                                status as
                                | "Scheduled"
                                | "Completed"
                                | "Missed"
                                | "Cancelled"
                            )
                            : undefined,
                        prospectId
                            ? eq(calls.prospectId, Number(prospectId))
                            : undefined,
                        dealId ? eq(calls.dealId, Number(dealId)) : undefined,
                        dateFrom
                            ? gte(calls.startTime, new Date(dateFrom as string))
                            : undefined,
                        dateTo
                            ? lte(calls.startTime, new Date(dateTo as string))
                            : undefined,
                        search
                            ? like(calls.subject, `%${search}%`)
                            : undefined
                    )
                )
                .orderBy(desc(calls.startTime));

            res.status(200).json({
                success: true,
                data: allCalls,
                count: allCalls.length,
            });
        } catch (error) {
            console.error("getCalls error:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // GET /calls/:id
    getCallById: async (req: Request, res: Response) => {
        try {const tenantId = req.user!.tenantId;
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "Invalid call ID" });
                return;
            }

            const [call] = await db
                .select({
                    id: calls.id,
                    subject: calls.subject,
                    type: calls.type,
                    startTime: calls.startTime,
                    duration: calls.duration,
                    status: calls.status,
                    description: calls.description,
                    prospectId: prospects.prospectId,
                    prospectName: prospects.fullName,
                    prospectPhone: prospects.primaryPhone,
                    dealId: deals.dealId,
                    inventoryDescription: invinventories.description,
                    userId: aspnetusers.id,
                    ownerFirstName: aspnetusers.firstName,
                    ownerLastName: aspnetusers.lastName,
                    ownerAvatar: aspnetusers.avatarUrl,
                })
                .from(calls)
                .leftJoin(prospects, eq(calls.prospectId, prospects.prospectId))
                .leftJoin(deals, eq(calls.dealId, deals.dealId))
                .leftJoin(invinventories, eq(deals.inventoryId, invinventories.inventoryId))
                .leftJoin(aspnetusers, eq(calls.userId, aspnetusers.id))
                .where(and(eq(calls.id, id), eq(calls.tenantId, tenantId)));

            if (!call) {
                res.status(404).json({ success: false, message: "Call not found" });
                return;
            }

            res.status(200).json({ success: true, data: call });
        } catch (error) {
            console.error("getCallById error:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // POST /calls
    createCall: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId;
            const parsed = createCallSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.flatten().fieldErrors,
                });
                return;
            }

            const { subject, type, startTime, duration, prospectId, dealId, description, status } =
                parsed.data;

            // TODO: replace hardcoded userId with req.user.id from auth middleware
            const userId = "756c51bb-590d-43de-a22f-58ae4da88b77";

            const [inserted] = await db.insert(calls).values({
                subject,
                type,
                startTime: startTime ? new Date(startTime) : undefined,
                duration,
                prospectId,
                dealId,
                userId,
                description,
                status,
                tenantId: tenantId,
            });

            res.status(201).json({
                success: true,
                message: "Call created successfully",
                data: { id: inserted.insertId },
            });
        } catch (error) {
            console.error("createCall error:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // PUT /calls/:id
    updateCall: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId;
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "Invalid call ID" });
                return;
            }

            const parsed = updateCallSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.flatten().fieldErrors,
                });
                return;
            }

            // Check call exists and belongs to tenant
            const [existing] = await db
                .select({ id: calls.id })
                .from(calls)
                .where(and(eq(calls.id, id), eq(calls.tenantId, tenantId)));

            if (!existing) {
                res.status(404).json({ success: false, message: "Call not found" });
                return;
            }

            const { subject, type, startTime, duration, prospectId, dealId, description, status } =
                parsed.data;

            await db
                .update(calls)
                .set({
                    ...(subject !== undefined && { subject }),
                    ...(type !== undefined && { type }),
                    ...(startTime !== undefined && { startTime: new Date(startTime) }),
                    ...(duration !== undefined && { duration }),
                    ...(prospectId !== undefined && { prospectId }),
                    ...(dealId !== undefined && { dealId }),
                    ...(description !== undefined && { description }),
                    ...(status !== undefined && { status }),
                })
                .where(and(eq(calls.id, id), eq(calls.tenantId, tenantId)));

            res.status(200).json({ success: true, message: "Call updated successfully" });
        } catch (error) {
            console.error("updateCall error:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // DELETE /calls/:id
    deleteCall: async (req: Request, res: Response) => {
        try {
            const tenantId = req.user!.tenantId;
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "Invalid call ID" });
                return;
            }

            const [existing] = await db
                .select({ id: calls.id })
                .from(calls)
                .where(and(eq(calls.id, id), eq(calls.tenantId, tenantId)));

            if (!existing) {
                res.status(404).json({ success: false, message: "Call not found" });
                return;
            }

            await db
                .delete(calls)
                .where(and(eq(calls.id, id), eq(calls.tenantId, tenantId)));

            res.status(200).json({ success: true, message: "Call deleted successfully" });
        } catch (error) {
            console.error("deleteCall error:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
};

export default callController;