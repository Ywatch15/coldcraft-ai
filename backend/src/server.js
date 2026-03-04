require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/emails");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:8080",   // vite dev
  "http://localhost:4173",   // vite preview (npm run build + preview)
  "http://localhost:5173",   // vite default dev port
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (same-origin, mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// ─── Routes ──────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);

// ─── Health Check ────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Serve Frontend (Production) ─────────────────────
if (process.env.NODE_ENV === "production") {
  // Resolve relative to process CWD (which is repo root on Render)
  const frontendDist = path.resolve(process.cwd(), "../frontend/dist");

  // Startup check — log whether the dist folder exists
  if (fs.existsSync(frontendDist)) {
    console.log(`✓ Serving frontend from ${frontendDist}`);
    console.log(`  Files: ${fs.readdirSync(frontendDist).join(", ")}`);
  } else {
    console.error(`✗ Frontend dist NOT found at ${frontendDist}`);
    console.error(`  CWD: ${process.cwd()}`);
    console.error(`  __dirname: ${__dirname}`);
  }

  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(frontendDist));

  // SPA fallback — serve index.html for any non-API route
  app.get("*", (_req, res) => {
    const indexPath = path.join(frontendDist, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(500).json({ error: "Frontend not built. index.html missing.", cwd: process.cwd(), dist: frontendDist });
    }
  });
}

// ─── Start Server ────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
  });
};

start();
