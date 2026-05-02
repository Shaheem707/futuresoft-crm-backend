import { Router } from "express";
import leadController from "../controllers/leadController.js";

const leadRoutes = Router();

leadRoutes.post("/createLead", leadController.createLead);
leadRoutes.get("/getProjects", leadController.getProjectsForCreatePage);
leadRoutes.get("/getAllLeads", leadController.getAllLeads);
leadRoutes.get("/getLead/:id", leadController.getLead);
leadRoutes.delete("/deleteLead", leadController.deleteLead);
leadRoutes.put("/updateLead/:id", leadController.updateLead);


export default leadRoutes;