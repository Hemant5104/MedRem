import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine
} from "../controllers/medicine.controller.js";

const router = express.Router();

router.use(authMiddleware); // protect all medicine routes

router.post("/", addMedicine);
router.get("/", getMedicines);
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;
