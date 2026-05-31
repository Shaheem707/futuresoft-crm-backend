import { Router } from "express";
import authRoutes from "./routes/authRouter.js";
import leadRoutes from "./routes/leadRouter.js";
import prospectRoutes from "./routes/prospectRouter.js";
import staffRoutes from "./routes/staffRouter.js";
import meetingRoutes from "./routes/meetingRouter.js";
import contactRoutes from "./routes/contactRouter.js";
import projectRoutes from "./routes/projectRouter.js";
import productRoutes from "./routes/productRouter.js";
import dealRoutes from "./routes/dealRouter.js";
import callRoutes from "./routes/callRouter.js";
import tenantRouter from "./routes/tenantRouter.js";

const AllRouter = Router();

AllRouter.use("/auth", authRoutes)
AllRouter.use("/lead", leadRoutes)
AllRouter.use("/prospect", prospectRoutes)
AllRouter.use("/staff", staffRoutes)
AllRouter.use("/meeting", meetingRoutes)
AllRouter.use("/contact", contactRoutes)
AllRouter.use("/project", projectRoutes)
AllRouter.use("/product", productRoutes)
AllRouter.use("/deal", dealRoutes)
AllRouter.use("/call", callRoutes)
AllRouter.use("/tenant", tenantRouter)

export default AllRouter;