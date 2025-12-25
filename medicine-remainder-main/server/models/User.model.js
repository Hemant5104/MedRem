import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    code: { type: String },
    expiresAt: { type: Date }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["USER", "ADMIN", "CAREGIVER"],
      default: "USER"
    },

    isEmailVerified: { type: Boolean, default: false },

    // 👇 Guardian / Caregiver Email
    guardianEmail: {
      type: String,
      lowercase: true,
      trim: true
    },

    // 👇 Control guardian notifications
    notifyGuardian: {
      type: Boolean,
      default: true
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"]
    },

    dateOfBirth: { type: Date },

    height: {
      value: { type: Number },
      unit: { type: String, enum: ["cm", "ft"], default: "cm" }
    },

    weight: {
      value: { type: Number },
      unit: { type: String, enum: ["kg", "lb"], default: "kg" }
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },

    allergies: [String],
    medicalConditions: [String],

    emailVerificationOTP: otpSchema,
    forgotPasswordOTP: otpSchema,

    lastLoginAt: { type: Date },
    isActive: { type: Boolean, default: true },

    timezone: { type: String, default: "Asia/Kolkata" },
    language: { type: String, default: "en" }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
