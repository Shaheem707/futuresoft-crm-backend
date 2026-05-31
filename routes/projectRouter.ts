import { Router } from "express";
import projectController from "../controllers/projectController.js";
import { authenticate } from "../middleware/auth.js";
const projectRoutes = Router();

projectRoutes.get("/", authenticate, projectController.getProjects);
projectRoutes.get("/:id", authenticate, projectController.getProjectById);
projectRoutes.post("/", authenticate, projectController.createProject);
projectRoutes.put("/:id", authenticate, projectController.updateProject);
projectRoutes.delete("/:id", authenticate, projectController.deleteProject);

export default projectRoutes;