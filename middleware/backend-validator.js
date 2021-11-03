const { check, validationResult } = require('express-validator');


const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const usernameRegex = /^(?=.*\d)(|.*[a-z])(|.*[A-Z])[0-9+a-zA-Z]{3,}$/;


exports.loginValidation = async (req, res, next) => {
}

exports.signupValidation = async (req, res, next) => {

  // Validate username
  await check('username').matches(usernameRegex).withMessage("Username must be at least 3 alphanumerical characters long").run(req);

  // Validate email
  await check('email').notEmpty().isEmail().run(req);

  // Validate password
  await check('password').matches(passwordRegex).withMessage("Must be length >= 8, contain number, letter and special character").run(req);
  await check('password').custom((value, {req}) => {
    if (value !== req.body.confirm_password) {
      throw new Error('Password confirmation is not match with new password');
    }
    return true;
  }).run(req);

  // Validate confirm_password
  await check('confirm_password').matches(passwordRegex).withMessage("Must be length >= 8, contain number, letter and special character").run(req);
  await check('confirm_password').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation is not match with new password');
    }
    return true;
  }).run(req);

  let results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(400).json({errors: results.array()});
  } else {
    next();
  }
}

exports.changePWValidation = async (req, res, next) => {

  // Validate current_password
  await check('current_password').matches(passwordRegex).withMessage("Must be length >= 8, contain number, letter and special character").run(req);

  // Validate new_password
  await check('new_password').matches(passwordRegex).withMessage("Must be length >= 8, contain number, letter and special character").run(req);
  await check('new_password').custom((value, {req}) => {
      if (value !== req.body.confirm_password) {
        throw new Error('Password confirmation is not match with new password');
      }
      return true;
    }).run(req);
  
  // Validate confirm_password
  await check('confirm_password').matches(passwordRegex).withMessage("Must be length >= 8, contain number, letter and special character").run(req);
  await check('confirm_password').custom((value, {req}) => {
      if (value !== req.body.new_password) {
        throw new Error('Password confirmation is not match with new password');
      }
      return true;
    }).run(req);

  let results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(400).json({errors: results.array()});
  } else {
    next();
  }
}