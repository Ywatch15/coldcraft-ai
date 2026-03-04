const express = require("express");
const User = require("../models/User");
const { signToken } = require("../middleware/auth");
const { generateOTP, otpExpiry } = require("../utils/otp");
const { sendOTPEmail } = require("../utils/mailer");

const router = express.Router();

// ──────────────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing.isVerified) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Generate OTP
    const otpCode = generateOTP();

    if (existing && !existing.isVerified) {
      // Update existing unverified user
      existing.password = password;
      existing.otp = { code: otpCode, expiresAt: otpExpiry() };
      await existing.save();
    } else {
      // Create new user
      await User.create({
        email: email.toLowerCase(),
        password,
        otp: { code: otpCode, expiresAt: otpExpiry() },
      });
    }

    // Send OTP via Nodemailer (production) or log to console (dev)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await sendOTPEmail(email.toLowerCase(), otpCode);
        console.log(`[OTP] Email sent to ${email}`);
      } catch (mailErr) {
        console.error("Mailer error:", mailErr.message);
        // Still log OTP so dev/testing isn't blocked if mail fails
        console.log(`[OTP] ${email}: ${otpCode}`);
      }
    } else {
      // No SMTP configured — dev mode, log to console
      console.log(`[OTP] ${email}: ${otpCode}`);
    }

    res.status(200).json({
      message: "OTP sent to your email",
      // Remove this in production — only for dev/testing
      _dev_otp: process.env.NODE_ENV !== "production" ? otpCode : undefined,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ──────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// ──────────────────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({ message: "No OTP pending. Please register again." });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: "OTP has expired. Please register again." });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark verified & clear OTP
    user.isVerified = true;
    user.otp = { code: null, expiresAt: null };
    await user.save();

    const token = signToken(user._id.toString(), user.email);

    res.json({
      message: "Account verified successfully",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ──────────────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id.toString(), user.email);

    res.json({
      message: "Logged in successfully",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
