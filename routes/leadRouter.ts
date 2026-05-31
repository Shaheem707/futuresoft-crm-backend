import { Router } from "express";
import leadController from "../controllers/leadController.js";
import { authenticate } from "../middleware/auth.js";

const leadRoutes = Router();

leadRoutes.post("/createLead", authenticate, leadController.createLead);
leadRoutes.post("/createBulkLeads", authenticate, leadController.bulkImportLeads);
leadRoutes.get("/getProjects", authenticate, leadController.getProjectsForCreatePage);
leadRoutes.get("/getAllLeads", authenticate, leadController.getAllLeads);
leadRoutes.get("/getLead/:id", authenticate, leadController.getLead);
leadRoutes.delete("/deleteLead", leadController.deleteLead);
leadRoutes.put("/updateLead/:id", authenticate, leadController.updateLead);



export default leadRoutes;