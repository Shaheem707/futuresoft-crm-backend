import { Router } from "express";
import authController from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/signup", authController.signup);
authRoutes.post("/login", authController.login);


export default authRoutes;