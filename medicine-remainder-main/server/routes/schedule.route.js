import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule
} from "../controllers/schedule.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addSchedule);
router.get("/", getSchedules);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

export default router;
