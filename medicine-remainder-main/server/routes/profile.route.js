import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMyProfile,
  updateProfile,
  updateProfilePicture,
  removeProfilePicture
} from "../controllers/profile.controller.js";

const router = express.Router();

router.use(authMiddleware);

// profile data
router.get("/", getMyProfile);
router.put("/", updateProfile);

// profile picture (hashed only)
router.put("/picture", updateProfilePicture);
router.delete("/picture", removeProfilePicture);

export default router;
