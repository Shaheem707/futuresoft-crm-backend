import { Router } from "express";
import { tenantController } from "../controllers/tenantController.js";
import { authenticate } from "../middleware/auth.js";

const tenantRouter = Router();

tenantRouter.get("/settings", authenticate, tenantController.getCompany);
tenantRouter.put("/settings", authenticate, tenantController.updateCompany);
tenantRouter.post("/invite/generate", authenticate, tenantController.generateInvite);
tenantRouter.post("/invite/accept", tenantController.acceptInvite);

tenantRouter.get("/users", authenticate, tenantController.getUsers);
tenantRouter.delete("/users/:userId", authenticate, tenantController.removeUser);

export default tenantRouter;