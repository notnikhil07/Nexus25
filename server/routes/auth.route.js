import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";
const router = new Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify", verifyEmail);
router.post("/forgetpassword", forgotPassword);
router.post("/forget/:token", resetPassword);

export default router;
