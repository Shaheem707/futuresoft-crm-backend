import { Router } from "express";
import contactController from "../controllers/contactController.js";
import { authenticate } from "../middleware/auth.js";

const contactRoutes = Router();

contactRoutes.post("/createContact", authenticate, contactController.createContact);
contactRoutes.patch("/updateContact/:id", authenticate, contactController.updateContact);
contactRoutes.get("/getContacts", authenticate, contactController.getContacts);
contactRoutes.get("/getContact/:id", authenticate, contactController.getContact);
contactRoutes.delete("/deleteContact/:id", authenticate, contactController.deleteContact);

export default contactRoutes;