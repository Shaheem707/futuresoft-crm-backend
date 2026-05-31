import { Router } from "express";
import staffController from "../controllers/staffController.js";
import { authenticate } from "../middleware/auth.js";
const staffRoutes = Router();

staffRoutes.get("/getStaff", authenticate, staffController.getStaff);


export default staffRoutes;