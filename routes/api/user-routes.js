const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user-controller');
const fileUpload = require('../../middleware/file-upload')
const { check, validationResult } = require('express-validator');
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
router.post('/signup', userController.signUp);

router.post('/login', userController.login);

router.get('/logout', userController.logout);
router.get('/profile', userController.getProfile);
router.post('/change_password', 
    check('current_password').matches(passwordRegex).withMessage("Must be length >= 8, contain number, letter and special character"),
    check('new_password').matches(passwordRegex).withMessage("Must be length >= 8, contain number, letter and special character"),
    check('new_password').custom((value, {req}) => {
      if (value !== req.body.confirm_password) {
        throw new Error('Password confirmation is not match with new password');
      }
      return true;
    }),
    check('confirm_password').matches(passwordRegex).withMessage("Must be length >= 8, contain number, letter and special character"),
    check('confirm_password').custom((value, {req}) => {
      if (value !== req.body.new_password) {
        throw new Error('Password confirmation is not match with new password');
      }
      return true;
    }),
  (req, res, next) => {
    
    var err = validationResult(req);
    console.log(err)
    if (!err.isEmpty()) {
       res.status(400).json(err)
    } else {
        next()
    }
  },
  userController.changePassword);

router.post('/profile', fileUpload.single("profile_img"), userController.profileImageUpload)
exports.routes = router;