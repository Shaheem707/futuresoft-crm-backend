/// <reference path="../types/express.d.ts" />
import { db } from "../lib/index.js";
import { staffs } from "../lib/db/schema.js";
import { eq, and } from "drizzle-orm";
import type { Request, Response } from "express";
import { z } from "zod";

const staffController = {
  getStaff: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId;

      const results = await db
        .select({
          id: staffs.staffId,
          name: staffs.aliasName,
        })
        .from(staffs)
        .where(
            eq(staffs.tenantId, tenantId),
        )
        .orderBy(staffs.aliasName);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching prospects", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default staffController;