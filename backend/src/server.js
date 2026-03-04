require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/emails");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────
app.use(
  cors({
    origin(origin, callback) {
      // Allow: no origin (curl, health checks), localhost dev, any .onrender.com subdomain
      if (
        !origin ||
        origin.endsWith(".onrender.com") ||
        origin.startsWith("http://localhost")
      ) {
        callback(null, true);
      } else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL.replace(/\/$/, "")) {
        callback(null, true);
      } else {
        console.warn(`CORS rejected origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// ─── Request logger (production debug) ───────────────
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path} [origin: ${req.headers.origin || "none"}]`);
  next();
});

// ─── Routes ──────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);

// ─── Health Check (with diagnostics) ─────────────────
app.get("/api/health", (_req, res) => {
  const envCheck = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    DB_NAME: !!process.env.DB_NAME,
    JWT_SECRET: !!process.env.JWT_SECRET,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASS: !!process.env.SMTP_PASS,
    SMTP_HOST: !!process.env.SMTP_HOST,
    EMAIL_FROM: !!process.env.EMAIL_FROM,
    FRONTEND_URL: process.env.FRONTEND_URL || "NOT SET",
    NODE_ENV: process.env.NODE_ENV || "NOT SET",
  };
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongoState: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState],
    env: envCheck,
  });
});

// ─── Global Error Handler ────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// ─── Start Server ────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ FRONTEND_URL: ${process.env.FRONTEND_URL || "NOT SET"}`);
    console.log(`✓ NODE_ENV: ${process.env.NODE_ENV || "NOT SET"}`);
  });
};

start();
