import { Router } from "express";
import authRoutes from "./routes/authRouter.js";
import leadRoutes from "./routes/leadRouter.js";
import prospectRoutes from "./routes/prospectRouter.js";
import staffRoutes from "./routes/staffRouter.js";

const AllRouter = Router();

AllRouter.use("/auth", authRoutes)
AllRouter.use("/lead", leadRoutes)
AllRouter.use("/prospect", prospectRoutes)
AllRouter.use("/staff", staffRoutes)

export default AllRouter;