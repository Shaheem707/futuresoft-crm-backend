import { Router } from "express";
import authRoutes from "./routes/authRouter.js";

const AllRouter = Router();

AllRouter.use("/auth", authRoutes)

export default AllRouter;