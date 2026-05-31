import { Router } from "express";
import authController from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const authRoutes = Router();

authRoutes.post("/signup", authController.signup);
authRoutes.post("/login", authController.login);
authRoutes.post("/refresh", authController.refresh);
authRoutes.post("/logout", authController.logout);
authRoutes.get("/me", authenticate, authController.me); // 🔹 protected

authRoutes.get("/profile", authenticate, authController.getProfile);
authRoutes.put("/profile", authenticate, authController.updateProfile);

authRoutes.get("/facebook", authenticate, authController.redirectToFBAuth)
authRoutes.get("/facebook/callback", authenticate, authController.fbRedirectCallback)
authRoutes.get("/facebook/leads", authenticate, authController.leadsFromFB)
authRoutes.get("/facebook/status", authenticate, authController.facebookStatus);

// authRoutes.get("/facebook/verifyFacebookWebhook", authController.verifyFacebookWebhook)
authRoutes.get("/facebook/autoGetLeads", authController.verifyFacebookWebhook)
authRoutes.post("/facebook/autoGetLeads", authController.handleFacebookWebhook)
authRoutes.get("/facebook/webhook-status", authenticate, authController.getWebhookStatus)

export default authRoutes;