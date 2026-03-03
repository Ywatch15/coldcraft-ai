const express = require("express");
const Email = require("../models/Email");
const { authMiddleware } = require("../middleware/auth");
const { generateEmail } = require("../services/gemini");

const router = express.Router();

// All email routes require authentication
router.use(authMiddleware);

// ──────────────────────────────────────────────────────
// POST /api/emails/generate
// ──────────────────────────────────────────────────────
router.post("/generate", async (req, res) => {
  try {
    const { recipientName, company, role, goal, tone, extraContext } = req.body;

    if (!recipientName || !company || !goal) {
      return res.status(400).json({
        message: "recipientName, company, and goal are required",
      });
    }

    // Generate email via Gemini AI
    const { subject, body } = await generateEmail({
      recipientName,
      company,
      role: role || "",
      goal,
      tone: tone || "Professional",
      extraContext: extraContext || "",
    });

    // Save to DB
    const email = await Email.create({
      userId: req.user.userId,
      subject,
      body,
      metadata: {
        recipientName,
        company,
        role: role || "",
        goal,
        tone: tone || "Professional",
      },
    });

    res.status(201).json({
      id: email._id,
      subject: email.subject,
      body: email.body,
      metadata: email.metadata,
      createdAt: email.createdAt,
    });
  } catch (err) {
    console.error("Generate email error:", err);

    // Return meaningful error for rate limits
    if (err.status === 429) {
      return res.status(429).json({
        message: "AI rate limit exceeded. Please wait a minute and try again.",
      });
    }

    res.status(500).json({ message: "Failed to generate email. Please try again." });
  }
});

// ──────────────────────────────────────────────────────
// GET /api/emails
// ──────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const emails = await Email.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = emails.map((e) => ({
      id: e._id,
      subject: e.subject,
      body: e.body,
      metadata: e.metadata,
      createdAt: e.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Fetch emails error:", err);
    res.status(500).json({ message: "Failed to fetch emails" });
  }
});

// ──────────────────────────────────────────────────────
// GET /api/emails/:id
// ──────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).lean();

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json({
      id: email._id,
      subject: email.subject,
      body: email.body,
      metadata: email.metadata,
      createdAt: email.createdAt,
    });
  } catch (err) {
    console.error("Fetch email error:", err);
    res.status(500).json({ message: "Failed to fetch email" });
  }
});

module.exports = router;
