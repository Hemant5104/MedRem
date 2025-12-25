import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  markIntake,
  getTodayIntake,
  getIntakeHistory,
  getMonthlyIntakeHistory
} from "../controllers/intake.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.get(
  "/history/month",
  authMiddleware,
  getMonthlyIntakeHistory
);

router.post("/mark", markIntake);
router.get("/today", getTodayIntake);
router.get("/history", getIntakeHistory);


export default router;