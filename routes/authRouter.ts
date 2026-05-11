import { Router } from "express";
import authController from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/signup", authController.signup);
authRoutes.post("/login", authController.login);

authRoutes.get("/facebook", authController.redirectToFBAuth)
authRoutes.get("/facebook/callback", authController.fbRedirectCallback)
authRoutes.get("/facebook/leads", authController.leadsFromFB)
authRoutes.get("/facebook/status", authController.facebookStatus);

// authRoutes.get("/facebook/verifyFacebookWebhook", authController.verifyFacebookWebhook)
authRoutes.get("/facebook/autoGetLeads", authController.verifyFacebookWebhook)
authRoutes.post("/facebook/autoGetLeads", authController.handleFacebookWebhook)
authRoutes.get("/facebook/webhook-status", authController.getWebhookStatus)


export default authRoutes;