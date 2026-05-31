import { Router } from "express";
import dealController from "../controllers/dealController.js";
import { authenticate } from "../middleware/auth.js";

const dealRoutes = Router();

dealRoutes.get("/", authenticate, dealController.getDeals);
dealRoutes.get("/:id",authenticate, dealController.getDealById);
dealRoutes.post("/", authenticate, dealController.createDeal);
dealRoutes.put("/:id", authenticate, dealController.updateDeal);
dealRoutes.delete("/:id",authenticate, dealController.deleteDeal);

export default dealRoutes;