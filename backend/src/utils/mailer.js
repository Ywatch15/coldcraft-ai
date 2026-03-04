const nodemailer = require("nodemailer");

// ─── Create reusable transporter ─────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // your Gmail address
    pass: process.env.SMTP_PASS, // Gmail App Password (NOT your Gmail password)
  },
});

/**
 * Send OTP verification email to the user.
 * @param {string} toEmail - recipient email address
 * @param {string} otpCode - 6-digit OTP
 */
async function sendOTPEmail(toEmail, otpCode) {
  const mailOptions = {
    from: `"ColdCraft AI" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Your ColdCraft Verification Code",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; border-radius: 12px; border: 1px solid #1a1a2e;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 24px; background: linear-gradient(135deg, #818cf8, #fb7185); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ColdCraft AI
          </h1>
          <p style="color: #888; font-size: 14px; margin-top: 4px;">Email Verification</p>
        </div>

        <div style="background: #111; border-radius: 8px; padding: 24px; text-align: center; border: 1px solid #222;">
          <p style="color: #ccc; font-size: 14px; margin: 0 0 16px 0;">Your one-time verification code is:</p>
          <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #fff; font-family: monospace;">
            ${otpCode}
          </div>
          <p style="color: #666; font-size: 12px; margin: 16px 0 0 0;">This code expires in 10 minutes.</p>
        </div>

        <p style="color: #555; font-size: 12px; text-align: center; margin-top: 24px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };
