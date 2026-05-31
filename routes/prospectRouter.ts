import { Router } from "express";
import prospectController from "../controllers/prospectController.js";
import { authenticate } from "../middleware/auth.js";
const prospectRoutes = Router();

prospectRoutes.get("/getProspects", authenticate, prospectController.getProspects);


export default prospectRoutes;