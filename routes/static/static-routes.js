const express = require("express");
const router = express.Router();
const staticController = require("../../controllers/static/static-controllers");
/**
 * @route GET .../
 * Main page
 */
router.get("/", staticController.getHomepage);

/**
 * @route GET .../login
 * Login page for authentication
 */
router.get("/login", staticController.getLogin);

/**
 * @route GET .../signup
 * Sigun page for create new account
 */
router.get("/signup", staticController.getSignup);

/**
 * @route GET .../about
 * About page for game rules
 */
router.get("/about", staticController.getAbout);

/**
 * @route GET .../tansition
 * Transition page
 * @queryParam
 *  title:  page title
 *  description: description of the transition page
 *  redirect_path: relative path of target page
 *  page_name: name of the target page
 */
router.get("/transition", staticController.getTransition);

exports.routes = router;
