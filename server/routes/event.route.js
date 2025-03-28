import { Router } from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import {
  getAllRegistrations,
  getRegistration,
  getRegistrationByEmail,
  register,
} from "../controllers/event.controller.js";

const router = new Router();

router.post("/register", protectedRoute, register);
router.get("/getall", protectedRoute, getAllRegistrations);
router.get("/getsingle/:id", protectedRoute, getRegistration);
router.get("/get", protectedRoute, getRegistrationByEmail);

export default router;
