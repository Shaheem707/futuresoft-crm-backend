/// <reference path="../types/express.d.ts" />
import { db } from "../lib/index.js";
import {
  invprojects,
  invareas,
  invcities,
  invinventories,
} from "../lib/db/schema.js";
import { eq, and, count, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { z } from "zod";

// ── Validation schemas ─────────────────────────────────────────────────────
const createProjectSchema = z.object({
  description: z.string().min(1).max(255),
  areaId: z.number().int().positive().optional().nullable(),
  isActive: z.number().int().min(0).max(1).optional().default(1),
});

const updateProjectSchema = createProjectSchema.partial();

// ── Controller ─────────────────────────────────────────────────────────────
const projectController = {
  /**
   * GET /projects
   * Returns all projects for the tenant with area, city, and total unit count.
   */
  getProjects: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic 
      const projects = await db
        .select({
          projectId: invprojects.projectId,
          description: invprojects.description,
          isActive: invprojects.isActive,
          areaId: invprojects.areaId,
          areaDescription: invareas.description,
          cityId: invcities.cityId,
          cityDescription: invcities.description,
          totalUnits: count(invinventories.inventoryId),
        })
        .from(invprojects)
        .leftJoin(invareas, eq(invprojects.areaId, invareas.areaId))
        .leftJoin(invcities, eq(invareas.cityId, invcities.cityId))
        .leftJoin(
          invinventories,
          and(
            eq(invinventories.projectId, invprojects.projectId),
            eq(invinventories.tenantId, tenantId)
          )
        )
        .where(eq(invprojects.tenantId, tenantId))
        .groupBy(
          invprojects.projectId,
          invprojects.description,
          invprojects.isActive,
          invprojects.areaId,
          invareas.description,
          invcities.cityId,
          invcities.description
        );

      return res.status(200).json({ success: true, data: projects });
    } catch (error) {
      console.error("[getProjects]", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch projects." });
    }
  },

  /**
   * GET /projects/:id
   * Returns a single project with area, city, and total unit count.
   */
  getProjectById: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic 
      const projectId = parseInt(req.params.id as string, 10);
      if (isNaN(projectId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid project ID." });
      }

      const [project] = await db
        .select({
          projectId: invprojects.projectId,
          description: invprojects.description,
          isActive: invprojects.isActive,
          areaId: invprojects.areaId,
          areaDescription: invareas.description,
          cityId: invcities.cityId,
          cityDescription: invcities.description,
          totalUnits: count(invinventories.inventoryId),
        })
        .from(invprojects)
        .leftJoin(invareas, eq(invprojects.areaId, invareas.areaId))
        .leftJoin(invcities, eq(invareas.cityId, invcities.cityId))
        .leftJoin(
          invinventories,
          and(
            eq(invinventories.projectId, invprojects.projectId),
            eq(invinventories.tenantId, tenantId)
          )
        )
        .where(
          and(
            eq(invprojects.projectId, projectId),
            eq(invprojects.tenantId, tenantId)
          )
        )
        .groupBy(
          invprojects.projectId,
          invprojects.description,
          invprojects.isActive,
          invprojects.areaId,
          invareas.description,
          invcities.cityId,
          invcities.description
        );

      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found." });
      }

      return res.status(200).json({ success: true, data: project });
    } catch (error) {
      console.error("[getProjectById]", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch project." });
    }
  },

  /**
   * POST /projects
   * Creates a new project.
   */
  createProject: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic 
      const parsed = createProjectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message ?? "Invalid input",
        });
      }

      const { description, areaId, isActive } = parsed.data;

      const [result] = await db.insert(invprojects).values({
        tenantId: tenantId,
        description,
        areaId: areaId ?? null,
        isActive: isActive ?? 1,
      });

      const insertedId = result.insertId;

      return res.status(201).json({
        success: true,
        data: { projectId: insertedId },
      });
    } catch (error) {
      console.error("[createProject]", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to create project." });
    }
  },

  /**
   * PUT /projects/:id
   * Updates an existing project.
   */
  updateProject: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic 
      const projectId = parseInt(req.params.id as string, 10);
      if (isNaN(projectId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid project ID." });
      }

      const parsed = updateProjectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message ?? "Invalid input",
        });
      }

      // Verify the project exists and belongs to this tenant
      const [existing] = await db
        .select({ projectId: invprojects.projectId })
        .from(invprojects)
        .where(
          and(
            eq(invprojects.projectId, projectId),
            eq(invprojects.tenantId, tenantId)
          )
        );

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found." });
      }

      await db
        .update(invprojects)
        .set(parsed.data)
        .where(
          and(
            eq(invprojects.projectId, projectId),
            eq(invprojects.tenantId, tenantId)
          )
        );

      return res.status(200).json({ success: true, data: { projectId } });
    } catch (error) {
      console.error("[updateProject]", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update project." });
    }
  },

  /**
   * DELETE /projects/:id
   * Soft-deletes a project by setting isActive = 0.
   * Hard delete is intentionally avoided since projects may have linked inventory.
   */
  deleteProject: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic 
      const projectId = parseInt(req.params.id as string, 10);
      if (isNaN(projectId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid project ID." });
      }

      const [existing] = await db
        .select({ projectId: invprojects.projectId })
        .from(invprojects)
        .where(
          and(
            eq(invprojects.projectId, projectId),
            eq(invprojects.tenantId, tenantId)
          )
        );

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found." });
      }

      await db
        .update(invprojects)
        .set({ isActive: 0 })
        .where(
          and(
            eq(invprojects.projectId, projectId),
            eq(invprojects.tenantId, tenantId)
          )
        );

      return res
        .status(200)
        .json({ success: true, data: { projectId } });
    } catch (error) {
      console.error("[deleteProject]", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete project." });
    }
  },
};

export default projectController;