import { Router } from "express";
import meetingController from "../controllers/meetingController.js";

const meetingRoutes = Router();

meetingRoutes.get("/meetings", meetingController.getMeetings);
meetingRoutes.post("/meetings", meetingController.createMeeting);
meetingRoutes.get("/meetings/:id/confirm", meetingController.confirmMeeting);
meetingRoutes.get("/singleMeeting/:id", meetingController.getMeeting);
meetingRoutes.patch("/meetings/:id", meetingController.updateMeeting);
meetingRoutes.delete("/meetings/:id", meetingController.deleteMeeting);

export default meetingRoutes