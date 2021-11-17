const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user-controller");
const backendValidator = require("../../middleware/backend-validator");

/**
 * Signup a new user
 * @body {
 *  username,
 *  email,
 *  password,
 *  confirm_password
 * }
 * success -> transition page -> login page
 */
router.post(
  "/signup",
  backendValidator.signupValidation,
  userController.signUp
);

/**
 * Login authentication with credential
 * @body {
 *  username,
 *  password
 * }
 * suceess -> transition page -> game lobby
 */
router.post("/login", userController.login);

/**
 * Logout from the app
 * success -> transition -> home page
 */
router.get("/logout", userController.logout);

/**
 * Change the password by provided crenditial
 * @body {
 *  current_password,
 *  new_password,
 *  confirm_password
 * }
 * success -> popup message success
 */
router.post(
  "/change_password",
  backendValidator.changePWValidation,
  userController.changePassword
);

router.get("/profile", userController.getProfile);

exports.routes = router;
