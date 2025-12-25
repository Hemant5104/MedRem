import express from "express";
import {
  register,
  verifyEmailOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  login
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login",login)
router.post("/register", register);
router.post("/verify-email", verifyEmailOTP);
router.post("/resend-otp/register", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
