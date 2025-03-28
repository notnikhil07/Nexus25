import { Router } from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import {
  getAllUsers,
  getMe,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
const router = new Router();

router.get("/getme", protectedRoute, getMe);
router.get("/getallusers", protectedRoute, getAllUsers);
router.put("/update", protectedRoute, updateUser);
router.get("/getuser/:id", protectedRoute, getUser);

export default router;
