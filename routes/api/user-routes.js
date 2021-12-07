const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user-controller");
const backendValidator = require("../../middleware/backend-validator");

/**
 * Signup a new user
 * @route POST .../user/post
 * @body {
 *  username: "Jimmy66",
 *  email: "example@mail.com",
 *  password: "Abc12345#",
 *  confirm_password: "Abc12345#"
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
 * @route POST .../user/login
 * @body {
 *  username: "Jimmy66",
 *  password: "Abc12345#"
 * }
 * suceess -> transition page -> game lobby
 */
router.post("/login", userController.login);

/**
 * Logout from the app
 * @route GET .../user/logout
 * success -> transition -> home page
 */
router.get("/logout", userController.logout);

/**
 * Change the password by provided crenditial
 * @route POST .../user/change_password
 * @body {
 *  current_password: "Abc12345#",
 *  new_password: "Abc23456!",
 *  confirm_password: "Abc23456!"
 * }
 * success -> popup message success
 */
router.post(
  "/change_password",
  backendValidator.changePWValidation,
  userController.changePassword
);

/**
 * The profile page of loggedIn user
 * @route GET .../user/profile
 */
router.get("/profile", userController.getProfile);

exports.routes = router;
