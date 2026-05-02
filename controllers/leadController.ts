import { db } from "../lib/index.js";
import {
  invprojects,
  leads,
  leadsources,
  prospects,
  staffs,
  statuses,
} from "../lib/db/schema.js";
import { and, desc, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { z } from "zod";

// Re-using the schema we refined above
const createLeadSchema = z.object({
  prospectId: z.coerce.number().int(),
  // projectId: z.coerce.number().int().optional(),
  projectId: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.coerce.number().int().nullable(),
  ),
  leadSourceId: z.coerce.number().int(),
  leadDate: z.string(),
  budget: z.coerce.number().default(0),
  priority: z.enum(["low", "medium", "high"]),
  // saleTeamId: z.coerce.number().int().optional(),
  saleTeamId: z.preprocess(
    (val) => (val === "" || val === undefined ? null : val),
    z.coerce.number().int().nullable(),
  ),
  staffId: z.string(),
  description: z.string(),
  notes: z.string().optional(),
  statusId: z.coerce.number().int().optional(),
});

const leadController = {
  createLead: async (req: Request, res: Response) => {
    try {
      // 1. Validate the Request Body
      const validatedData = createLeadSchema.parse(req.body);

      // 2. Get TenantID (Usually from Auth Middleware)
      // If you don't have middleware yet, you might be passing it in the body
      // (but that is less secure!)
      const tenantId = req.body.tenantId || (req as any).user?.tenantId || 1;

      // Helper function to convert ISO to MySQL format
      const toMysqlDateTime = (dateStr: string) =>
        dateStr.replace("T", " ").replace(/\..*|Z/g, "");

      // 3. Insert into Database
      const result = await db.insert(leads).values({
        ...validatedData,
        tenantId: tenantId,
        // Format budget to string for the 'decimal' column if necessary,
        // though Drizzle often handles this number-to-string cast for you.
        budget: validatedData.budget.toString(),
        leadDate: toMysqlDateTime(validatedData.leadDate),
        createdAt: toMysqlDateTime(new Date().toISOString()),
        updatedAt: toMysqlDateTime(new Date().toISOString()),
      });

      // 4. Return Success
      return res.status(201).json({
        message: "Lead created successfully",
        leadId: result[0].insertId, // For MySQL/MariaDB
      });
    } catch (error) {
      // if (error instanceof z.ZodError) {
      //     return res.status(400).json({
      //         error: "Validation failed",
      //         details: error.errors
      //     });
      // }

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.issues, // Use 'issues' instead of 'errors'
        });
      }

      console.error("Error creating lead:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllLeads: async (req: Request, res: Response) => {
    try {
      // 1. Identify Tenant (Match your createLead logic)
      // const tenantId = req.body.tenantId || (req as any).user?.tenantId || 5;
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

      // 2. Fetch Leads with Joins
      // const allLeads = await db
      //   .select({
      //     id: leads.leadId,
      //     date: leads.leadDate,
      //     budget: leads.budget,
      //     priority: leads.priority,
      //     description: leads.description,
      //     statusId: leads.statusId,
      //     // Joined Data
      //     prospectName: prospects.fullName,
      //     projectName: invprojects.description,
      //     staffName: staffs.aliasName,
      //     email: prospects.email,
      //     phone: prospects.primaryPhone,
      //   })
      //   .from(leads)
      //   .leftJoin(prospects, eq(leads.prospectId, prospects.prospectId))
      //   .leftJoin(invprojects, eq(leads.projectId, invprojects.projectId))
      //   .leftJoin(staffs, eq(leads.staffId, staffs.staffId))
      //   .where(eq(leads.tenantId, tenantId))
      //   .orderBy(desc(leads.createdAt)); // Newest leads first
      const allLeads = await db
        .select({
          id: leads.leadId,
          date: leads.leadDate,
          budget: leads.budget,
          priority: leads.priority,
          description: leads.description,
          // These now pull globally by ID
          statusLabel: statuses.description,
          statusColor: statuses.color,
          sourceName: leadsources.description, // Updated to your sources table
          // Tenant-specific joined data
          prospectName: prospects.fullName,
          email: prospects.email,
          phone: prospects.primaryPhone,
          projectName: invprojects.description,
          staffName: staffs.aliasName,
        })
        .from(leads)
        // Join logic: We only match on the ID, ignoring the tenantId in the lookup tables
        .leftJoin(statuses, eq(leads.statusId, statuses.statusId))
        .leftJoin(leadsources, eq(leads.leadSourceId, leadsources.leadSourceId))
        .leftJoin(prospects, eq(leads.prospectId, prospects.prospectId))
        .leftJoin(invprojects, eq(leads.projectId, invprojects.projectId))
        .leftJoin(staffs, eq(leads.staffId, staffs.staffId))
        // CRITICAL: This ensures you only see leads for the current logged-in tenant
        .where(eq(leads.tenantId, tenantId))
        .orderBy(desc(leads.createdAt));

      // 3. Return Results
      return res.status(200).json(allLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getLead: async (req: Request, res: Response) => {
    try {
      // 1. Validate Lead ID from URL parameter
      const leadIdParam = req.params.id;
      if (!leadIdParam) {
        return res.status(400).json({ error: "Lead ID is required in URL parameter" });
      }

      const leadId = parseInt(String(leadIdParam), 10);
      if (isNaN(leadId)) {
        return res.status(400).json({ error: "Invalid Lead ID format" });
      }

      // 2. Get Tenant ID from request body (required for multi-tenant SaaS)
      const tenantId = req.headers['x-tenant-id'];
      
      if (!tenantId) {
        return res.status(401).json({ error: "Unauthorized Access" });
      }

      const tenantIdNum = parseInt(String(tenantId), 10);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: "Invalid Tenant ID format" });
      }

      // 3. Fetch the single lead with all joined data
      const [lead] = await db
        .select({
          // Lead fields
          id: leads.leadId,
          date: leads.leadDate,
          budget: leads.budget,
          priority: leads.priority,
          description: leads.description,
          notes: leads.notes,
          leadDate: leads.leadDate,
          createdAt: leads.createdAt,
          updatedAt: leads.updatedAt,
          
          // Status fields
          statusLabel: statuses.description,
          statusColor: statuses.color,
          statusId: leads.statusId,
          
          // Source fields
          sourceName: leadsources.description,
          leadSourceId: leads.leadSourceId,
          
          // Prospect fields
          prospectName: prospects.fullName,
          email: prospects.email,
          phone: prospects.primaryPhone,
          prospectId: leads.prospectId,
          
          // Project fields
          projectName: invprojects.description,
          projectId: leads.projectId,
          
          // Staff fields
          staffName: staffs.aliasName,
          staffId: leads.staffId,
        })
        .from(leads)
        .leftJoin(statuses, eq(leads.statusId, statuses.statusId))
        .leftJoin(leadsources, eq(leads.leadSourceId, leadsources.leadSourceId))
        .leftJoin(prospects, eq(leads.prospectId, prospects.prospectId))
        .leftJoin(invprojects, eq(leads.projectId, invprojects.projectId))
        .leftJoin(staffs, eq(leads.staffId, staffs.staffId))
        .where(
          and(
            eq(leads.leadId, leadId),
            eq(leads.tenantId, tenantIdNum)
          )
        )
        .limit(1);

      // 4. Check if lead exists and belongs to the tenant
      if (!lead) {
        return res.status(404).json({ 
          error: "Lead not found or you don't have access to this lead" 
        });
      }

      // 5. Return the complete lead details
      return res.status(200).json({
        success: true,
        data: lead
      });
      
    } catch (error) {
      console.error("Error fetching lead by ID:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deleteLead: async (req: Request, res: Response) => {
    try {
      // 1. Extract the leadId from the query parameters
      const { leadId: leadIdRaw } = req.query;

      // 2. Validate existence
      if (!leadIdRaw) {
        return res.status(400).json({ error: "Lead ID is required" });
      }

      // 3. Convert to integer (following your tenantId logic)
      const leadId = parseInt(leadIdRaw as string, 10);

      if (isNaN(leadId)) {
        return res.status(400).json({ error: "Invalid Lead ID format" });
      }

      // 4. Database Deletion (Using Drizzle)
      // Note: In a multi-tenant app, it is safer to also check the tenantId
      // to ensure user A can't delete user B's lead by guessing the ID.
      const deletedResult = await db
        .delete(leads)
        .where(eq(leads.leadId, leadId));

      console.log(`Successfully deleted lead with ID: ${leadId}`);

      // 5. Return success
      return res.status(200).json({
        message: "Lead deleted successfully",
        deletedId: leadId,
      });
    } catch (error) {
      console.error("Error deleting lead:", error);
      return res.status(500).json({ error: "Failed to delete lead" });
    }
  },
  updateLead: async (req: Request, res: Response) => {
    try {
      // const { id } = req.params; // Get leadId from URL params
      const tenantId = req.body.tenantId || (req as any).user?.tenantId || 1;
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Valid lead ID is required" });
      }

      const leadId = parseInt(String(id), 10);
      if (isNaN(leadId)) {
        return res
          .status(400)
          .json({ error: "Lead ID must be a valid number" });
      }
      // 1. Partial Validation (Using .partial() so fields are optional)
      const updateData = createLeadSchema.partial().parse(req.body);

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No changes provided" });
      }

      // Helper for date formatting
      const toMysqlDateTime = (dateStr: string) =>
        dateStr.replace("T", " ").replace(/\..*|Z/g, "");

      // 2. Prepare Update Object
      const fieldsToUpdate: any = {
        ...updateData,
        updatedAt: toMysqlDateTime(new Date().toISOString()),
      };

      // Format specific fields if they exist in the update
      if (updateData.leadDate)
        fieldsToUpdate.leadDate = toMysqlDateTime(updateData.leadDate);
      if (updateData.budget !== undefined)
        fieldsToUpdate.budget = updateData.budget.toString();

      // 3. Execute Update with Tenant Security
      const result = await db
        .update(leads)
        .set(fieldsToUpdate)
        .where(
          and(eq(leads.leadId, parseInt(String(id), 10)), eq(leads.tenantId, tenantId)),
        );
      console.log(result);

      return res.status(200).json({ message: "Lead updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: error.issues });
      }
      console.error("Update error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getProjectsForCreatePage: async (req: Request, res: Response) => {
    try {
      // 1. Get Tenant ID from request or user session
      // const tenantId = req.body.tenantId || (req as any).user?.tenantId || 5;
      const tenantId = req.headers['x-tenant-id'];
      
      if (!tenantId) {
        return res.status(401).json({ error: "Unauthorized Access" });
      }

      const tenantIdNum = parseInt(String(tenantId), 10);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: "Invalid Tenant ID format" });
      }

      // 2. Fetch projects where TenantID matches and project is Active
      const projects = await db
        .select({
          id: invprojects.projectId,
          name: invprojects.description,
        })
        .from(invprojects)
        .where(
          and(
            eq(invprojects.tenantId, tenantIdNum),
            eq(invprojects.isActive, 1), // Only show active projects
          ),
        );

      // 3. Return the results
      return res.status(200).json(projects);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default leadController;
