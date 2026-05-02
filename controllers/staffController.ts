import { db } from "../lib/index.js";
import { staffs } from "../lib/db/schema.js";
import { eq, and } from "drizzle-orm";
import type { Request, Response } from "express";
import { z } from "zod";

const staffController = {
  getStaff: async (req: Request, res: Response) => {
    try {
      // Assuming you handle multi-tenancy via a middleware or query param
      //  const tenantId = Number(req.body.tenantId);
      // const tenantId = Number(req.headers["x-tenant-id"]);

      // 1. Extract the string from the query
      const { tenantId: tenantIdRaw } = req.query;

      // 2. Validate it exists and convert to a number
      if (!tenantIdRaw) {
        return res.status(400).json({ error: "Tenant ID is required" });
      }

      // Convert the raw string/query param to a standard integer
      const tenantId = parseInt(tenantIdRaw as string, 10);

      // 3. Check if the conversion actually resulted in a valid number
      if (isNaN(tenantId)) {
        return res.status(400).json({ error: "Invalid Tenant ID format" });
      }

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