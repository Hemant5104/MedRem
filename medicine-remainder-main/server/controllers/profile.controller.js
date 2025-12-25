import crypto from "crypto";
import User from "../models/User.model.js";

/**
 * GET MY PROFILE
 */
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -emailVerificationOTP -forgotPasswordOTP"
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PROFILE DETAILS
 */
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      guardianEmail,
      notifyGuardian,
      language,
      timezone,
      bloodGroup,
      allergies,
      medicalConditions
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;

    if (guardianEmail !== undefined)
      updateData.guardianEmail = guardianEmail;

    if (notifyGuardian !== undefined)
      updateData.notifyGuardian = notifyGuardian;

    if (language !== undefined)
      updateData.language = language;

    if (timezone !== undefined)
      updateData.timezone = timezone;

    // ✅ HEALTH DETAILS
    if (bloodGroup !== undefined)
      updateData.bloodGroup = bloodGroup;

    if (allergies !== undefined) {
      updateData.allergies = Array.isArray(allergies)
        ? allergies
        : allergies.split(",").map((a) => a.trim());
    }

    if (medicalConditions !== undefined) {
      updateData.medicalConditions = Array.isArray(medicalConditions)
        ? medicalConditions
        : medicalConditions.split(",").map((m) => m.trim());
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * UPDATE PROFILE PICTURE (HASH ONLY)
 */
export const updateProfilePicture = async (req, res) => {
  try {
    const { imageBase64, imageType } = req.body;

    if (!imageBase64 || !imageType)
      return res.status(400).json({ message: "Image data required" });

    const buffer = Buffer.from(imageBase64, "base64");

    // Hash image buffer
    const hash = crypto
      .createHash("sha256")
      .update(buffer)
      .digest("hex");

    await User.findByIdAndUpdate(req.user._id, {
      profileImageHash: hash,
      profileImageType: imageType
    });

    res.json({ message: "Profile picture updated securely" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * REMOVE PROFILE PICTURE
 */
export const removeProfilePicture = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      profileImageHash: null,
      profileImageType: null
    });

    res.json({ message: "Profile picture removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
