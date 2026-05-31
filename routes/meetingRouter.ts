import { Router } from "express";
import meetingController from "../controllers/meetingController.js";
import { authenticate } from "../middleware/auth.js";

const meetingRoutes = Router();

meetingRoutes.get("/meetings", authenticate, meetingController.getMeetings);
meetingRoutes.post("/meetings", authenticate, meetingController.createMeeting);
meetingRoutes.get("/meetings/:id/confirm", authenticate, meetingController.confirmMeeting);
meetingRoutes.get("/singleMeeting/:id", authenticate, meetingController.getMeeting);
meetingRoutes.patch("/meetings/:id", authenticate, meetingController.updateMeeting);
meetingRoutes.delete("/meetings/:id", authenticate, meetingController.deleteMeeting);

export default meetingRoutes