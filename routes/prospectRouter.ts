import { Router } from "express";
import prospectController from "../controllers/prospectController.js";

const prospectRoutes = Router();

prospectRoutes.get("/getProspects", prospectController.getProspects);


export default prospectRoutes;