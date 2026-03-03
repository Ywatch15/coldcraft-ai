const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    metadata: {
      recipientName: { type: String, required: true },
      company: { type: String, required: true },
      role: { type: String, default: "" },
      goal: { type: String, required: true },
      tone: { type: String, required: true },
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Email", emailSchema);
