const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
  };
}

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (user.role === "customer") {
    throw new ApiError(403, "Customers cannot access the admin panel");
  }
  if (user.status !== "active") throw new ApiError(403, "Account disabled");

  const token = signToken(user);
  sendResponse(res, 200, { token, user: sanitize(user) }, "Logged in");
});

exports.me = asyncHandler(async (req, res) => {
  sendResponse(res, 200, sanitize(req.user));
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  // Always respond success to avoid email enumeration
  if (!user) {
    return sendResponse(
      res,
      200,
      null,
      "If that email exists, a reset link was prepared."
    );
  }

  const raw = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(raw)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // In production, email the token. For local/dev, return token in response when not production.
  const payload =
    process.env.NODE_ENV === "production" ? null : { resetToken: raw };

  sendResponse(
    res,
    200,
    payload,
    "If that email exists, a reset link was prepared."
  );
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+password");

  if (!user) throw new ApiError(400, "Invalid or expired reset token");

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  sendResponse(res, 200, null, "Password updated. You can sign in.");
});
