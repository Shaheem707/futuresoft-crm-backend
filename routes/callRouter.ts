import { Router } from "express";
import callController from "../controllers/callController.js";
import { authenticate } from "../middleware/auth.js";

const callRoutes = Router();

callRoutes.get("/", authenticate, callController.getCalls);
callRoutes.get("/:id", authenticate, callController.getCallById);
callRoutes.post("/", authenticate, callController.createCall);
callRoutes.put("/:id", authenticate, callController.updateCall);
callRoutes.delete("/:id", authenticate, callController.deleteCall);

export default callRoutes;