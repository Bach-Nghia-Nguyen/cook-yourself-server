const express = require("express");
const router = express.Router();
const passport = require("passport");
const validators = require("../middlewares/validators");
const authController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/auth/login
 * @description Login with email and password
 * @access Public
 */
router.post(
  "/login",
  validators.validate([
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.loginWithEmail
);

/**
 * @route POST api/auth/login/facebook
 * @description Login with facebook
 * @access Public
 */
router.post(
  "/login/facebook",
  passport.authenticate("facebook-token"),
  authController.loginWithFaceBookOrGoogle
);

/**
 * @route POST api/auth/login/google
 * @description Login with google
 * @access Public
 */
router.post(
  "/login/google",
  passport.authenticate("google-token"),
  authController.loginWithFaceBookOrGoogle
);

/**
 * @route POST api/auth/validate_password
 * @description Validate Current password
 * @access Login required
 */
router.post(
  "/validate_password",
  authMiddleware.loginRequired,
  authController.validateCurrentPassword
);

module.exports = router;
