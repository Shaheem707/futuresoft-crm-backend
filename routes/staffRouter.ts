import { Router } from "express";
import staffController from "../controllers/staffController.js";

const staffRoutes = Router();

staffRoutes.get("/getStaff", staffController.getStaff);


export default staffRoutes;