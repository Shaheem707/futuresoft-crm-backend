/// <reference path="../types/express.d.ts" />
import { db } from "../lib/index.js";
import { prospects } from "../lib/db/schema.js";
import { eq, and } from "drizzle-orm";
import type { Request, Response } from "express";
import { z } from "zod";

const prospectController = {
  getProspects: async (req: Request, res: Response) => {
    try {
      
      const tenantId = req.user!.tenantId;

      const results = await db
        .select({
          id: prospects.prospectId,
          name: prospects.fullName,
        })
        .from(prospects)
        .where(
          and(
            eq(prospects.tenantId, tenantId),
            eq(prospects.isActive, 1), // Only show active prospects
          ),
        )
        .orderBy(prospects.fullName);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching prospect dropdown:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default prospectController;
