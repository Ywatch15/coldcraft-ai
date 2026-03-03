/**
 * Generate a random 6-digit OTP code.
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Returns an expiry Date 10 minutes from now.
 */
function otpExpiry() {
  return new Date(Date.now() + 10 * 60 * 1000);
}

module.exports = { generateOTP, otpExpiry };
