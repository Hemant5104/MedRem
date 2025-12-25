import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateOTP } from "../utils/otp.js";
import { sendMail } from "../config/mail.js";
import { generateAccessToken } from "../utils/jwt.js";


export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      dateOfBirth,
      height,
      weight,
      allergies,
      medicalConditions,
      guardianEmail,
      notifyGuardian
    } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Required fields missing" });

    const exists = await User.findOne({ email });
    if (exists && exists.isEmailVerified)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const otpData = {
      code: hashedOTP,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    const user = exists
      ? Object.assign(exists, {
          password: hashedPassword,
          emailVerificationOTP: otpData,
          guardianEmail,
          notifyGuardian
        })
      : await User.create({
          name,
          email,
          password: hashedPassword,
          gender,
          dateOfBirth,
          height,
          weight,
          allergies,
          medicalConditions,
          guardianEmail,
          notifyGuardian,
          emailVerificationOTP: otpData
        });

    await user.save();

    await sendMail({
      to: email,
      subject: "Verify your email",
      html: `<h3>Your OTP: ${otp}</h3><p>Valid for 10 minutes</p>`
    });

    res.status(201).json({
      message: "OTP sent to email for verification"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.emailVerificationOTP)
      return res.status(400).json({ message: "OTP not requested" });

    if (user.emailVerificationOTP.expiresAt < Date.now())
      return res.status(400).json({
        message: "OTP expired",
        canResend: true
      });

    const isMatch = await bcrypt.compare(
      otp,
      user.emailVerificationOTP.code
    );

    if (!isMatch)
      return res.status(400).json({ message: "Invalid OTP" });

    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.lastLoginAt = new Date();
    await user.save();

    const token = generateAccessToken(user._id);

    res.json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        height: user.height,
        weight: user.weight
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified)
      return res.status(400).json({ message: "Email already verified" });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.emailVerificationOTP = {
      code: hashedOTP,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    await user.save();

    await sendMail({
      to: email,
      subject: "Resend OTP",
      html: `<h3>Your new OTP: ${otp}</h3>`
    });

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.isEmailVerified)
      return res.status(400).json({ message: "Email not verified" });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.forgotPasswordOTP = {
      code: hashedOTP,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    await user.save();

    await sendMail({
      to: email,
      subject: "Reset Password OTP",
      html: `<h3>Your OTP is ${otp}</h3><p>Valid for 10 minutes</p>`
    });

    res.json({
      message: "OTP sent to email for password reset"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.forgotPasswordOTP)
      return res.status(400).json({ message: "OTP not requested" });

    if (user.forgotPasswordOTP.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(
      otp,
      user.forgotPasswordOTP.code
    );

    if (!isMatch)
      return res.status(400).json({ message: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.forgotPasswordOTP = undefined;
    user.lastLoginAt = new Date();

    await user.save();

    res.json({
      message: "Password reset successful. Please login."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ------------------------
    // Validate input
    // ------------------------
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // ------------------------
    // Check user exists
    // ------------------------
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // ------------------------
    // Email verification check
    // ------------------------
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before login"
      });
    }

    // ------------------------
    // Compare password
    // ------------------------
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // ------------------------
    // Generate JWT
    // ------------------------
    const token = generateAccessToken(user._id);

    // ------------------------
    // Update last login
    // ------------------------
    user.lastLoginAt = new Date();
    await user.save();

    // ------------------------
    // Response
    // ------------------------
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
