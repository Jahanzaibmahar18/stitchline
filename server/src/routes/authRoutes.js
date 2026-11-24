const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/login",
  authLimiter,
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  validate,
  authController.login
);

router.get("/me", protect, authController.me);

router.post(
  "/forgot-password",
  authLimiter,
  body("email").isEmail(),
  validate,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  body("token").notEmpty(),
  body("password").isLength({ min: 8 }),
  validate,
  authController.resetPassword
);

module.exports = router;
