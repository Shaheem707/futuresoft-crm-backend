/// <reference path="../types/express.d.ts" />
import { db } from "../lib/index.js";
import {
  invinventories,
  invprojects,
  invsizes,
  invtypes,
  invpurposes,
  invphases,
  invsectors,
  invblocks,
  invareas,
  invcities,
  invstyles,
  invoptions,
  invclients,
  invclienttypes,
} from "../lib/db/schema.js";
import { eq, and } from "drizzle-orm";
import type { Request, Response } from "express";
import { z } from "zod";

const productSchema = z.object({
  projectId: z.number().int().optional().nullable(),
  phaseId: z.number().int().optional().nullable(),
  sectorId: z.number().int().optional().nullable(),
  blockId: z.number().int().optional().nullable(),
  areaId: z.number().int().optional().nullable(),
  cityId: z.number().int().optional().nullable(),
  description: z.string().max(255).optional().nullable(),
  street: z.string().optional().nullable(),
  typeId: z.number().int().optional().nullable(),
  sizeId: z.number().int().optional().nullable(),
  styleId: z.number().int().optional().nullable(),
  optionId: z.number().int().optional().nullable(),
  purposeId: z.number().int().optional().nullable(),
  floorNumber: z.number().int().optional().nullable(),
  facingDirection: z.string().max(20).optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  status: z.enum(["available", "reserved", "sold", "transferred"]).optional(),
  clientId: z.number().int().optional().nullable(),
  clientTypeId: z.number().int().optional().nullable(),
  assignedAt: z.string().optional().nullable(),
  assignedBy: z.string().max(36).optional().nullable(),
  assignedTo: z.string().max(36).optional().nullable(),
  transferAt: z.string().optional().nullable(),
  transferBy: z.string().max(36).optional().nullable(),
  notes: z.string().optional().nullable(),
});

const productController = {
  getProducts: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic
      const products = await db
        .select({
          inventoryId: invinventories.inventoryId,
          description: invinventories.description,
          price: invinventories.price,
          status: invinventories.status,
          facingDirection: invinventories.facingDirection,
          floorNumber: invinventories.floorNumber,
          street: invinventories.street,
          notes: invinventories.notes,
          assignedAt: invinventories.assignedAt,
          createdAt: invinventories.createdAt,
          project: invprojects.description,
          size: invsizes.description,
          type: invtypes.description,
          purpose: invpurposes.description,
          phase: invphases.description,
          sector: invsectors.description,
          block: invblocks.description,
          area: invareas.description,
          city: invcities.description,
          style: invstyles.description,
          option: invoptions.description,
        })
        .from(invinventories)
        .leftJoin(invprojects, eq(invinventories.projectId, invprojects.projectId))
        .leftJoin(invsizes, eq(invinventories.sizeId, invsizes.sizeId))
        .leftJoin(invtypes, eq(invinventories.typeId, invtypes.typeId))
        .leftJoin(invpurposes, eq(invinventories.purposeId, invpurposes.purposeId))
        .leftJoin(invphases, eq(invinventories.phaseId, invphases.phaseId))
        .leftJoin(invsectors, eq(invinventories.sectorId, invsectors.sectorId))
        .leftJoin(invblocks, eq(invinventories.blockId, invblocks.blockId))
        .leftJoin(invareas, eq(invinventories.areaId, invareas.areaId))
        .leftJoin(invcities, eq(invinventories.cityId, invcities.cityId))
        .leftJoin(invstyles, eq(invinventories.styleId, invstyles.styleId))
        .leftJoin(invoptions, eq(invinventories.optionId, invoptions.optionId))
        .where(
          and(
            eq(invinventories.tenantId, tenantId),
            eq(invinventories.isActive, 1)
          )
        );

      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error("getProducts error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  getProductById: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic  
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

      const product = await db
        .select({
          inventoryId: invinventories.inventoryId,
          description: invinventories.description,
          price: invinventories.price,
          status: invinventories.status,
          facingDirection: invinventories.facingDirection,
          floorNumber: invinventories.floorNumber,
          street: invinventories.street,
          notes: invinventories.notes,
          assignedAt: invinventories.assignedAt,
          assignedBy: invinventories.assignedBy,
          assignedTo: invinventories.assignedTo,
          transferAt: invinventories.transferAt,
          transferBy: invinventories.transferBy,
          createdAt: invinventories.createdAt,
          modifiedAt: invinventories.modifiedAt,
          projectId: invinventories.projectId,
          phaseId: invinventories.phaseId,
          sectorId: invinventories.sectorId,
          blockId: invinventories.blockId,
          areaId: invinventories.areaId,
          cityId: invinventories.cityId,
          typeId: invinventories.typeId,
          sizeId: invinventories.sizeId,
          styleId: invinventories.styleId,
          optionId: invinventories.optionId,
          purposeId: invinventories.purposeId,
          clientId: invinventories.clientId,
          clientTypeId: invinventories.clientTypeId,
          project: invprojects.description,
          size: invsizes.description,
          type: invtypes.description,
          purpose: invpurposes.description,
          phase: invphases.description,
          sector: invsectors.description,
          block: invblocks.description,
          area: invareas.description,
          city: invcities.description,
          style: invstyles.description,
          option: invoptions.description,
        })
        .from(invinventories)
        .leftJoin(invprojects, eq(invinventories.projectId, invprojects.projectId))
        .leftJoin(invsizes, eq(invinventories.sizeId, invsizes.sizeId))
        .leftJoin(invtypes, eq(invinventories.typeId, invtypes.typeId))
        .leftJoin(invpurposes, eq(invinventories.purposeId, invpurposes.purposeId))
        .leftJoin(invphases, eq(invinventories.phaseId, invphases.phaseId))
        .leftJoin(invsectors, eq(invinventories.sectorId, invsectors.sectorId))
        .leftJoin(invblocks, eq(invinventories.blockId, invblocks.blockId))
        .leftJoin(invareas, eq(invinventories.areaId, invareas.areaId))
        .leftJoin(invcities, eq(invinventories.cityId, invcities.cityId))
        .leftJoin(invstyles, eq(invinventories.styleId, invstyles.styleId))
        .leftJoin(invoptions, eq(invinventories.optionId, invoptions.optionId))
        .where(
          and(
            eq(invinventories.inventoryId, id),
            eq(invinventories.tenantId, tenantId),
            eq(invinventories.isActive, 1)
          )
        )
        .limit(1);

      if (!product.length) return res.status(404).json({ success: false, message: "Product not found" });

      res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
      console.error("getProductById error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  createProduct: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic 
      const parsed = productSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error.flatten() });

      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      const result = await db.insert(invinventories).values({
        tenantId: tenantId,
        ...parsed.data,
        isActive: 1,
        createdAt: now,
        modifiedAt: now,
        createdBy: null,
        modifiedBy: null,
      });

      res.status(201).json({ success: true, message: "Product created", inventoryId: result[0].insertId });
    } catch (error) {
      console.error("createProduct error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic 
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

      const parsed = productSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error.flatten() });

      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      const result = await db
        .update(invinventories)
        .set({ ...parsed.data, modifiedAt: now, modifiedBy: null })
        .where(
          and(
            eq(invinventories.inventoryId, id),
            eq(invinventories.tenantId, tenantId),
            eq(invinventories.isActive, 1)
          )
        );

      if (result[0].affectedRows === 0)
        return res.status(404).json({ success: false, message: "Product not found" });

      res.status(200).json({ success: true, message: "Product updated" });
    } catch (error) {
      console.error("updateProduct error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic 
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

      const result = await db
        .delete(invinventories)
        .where(
          and(
            eq(invinventories.inventoryId, id),
            eq(invinventories.tenantId, tenantId)
          )
        );

      if (result[0].affectedRows === 0)
        return res.status(404).json({ success: false, message: "Product not found" });

      res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
      console.error("deleteProduct error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
};

export default productController;