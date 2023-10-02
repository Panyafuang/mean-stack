const express = require('express');
// const { body } = require('express-validator');

const authController = require('../controller/auth');

const router = express.Router();

// router.post('/signup', [
//   body('email')
//     .isEmail()
//     .withMessage('Please enter a valid email.')
//     .normalizeEmail()
//     .trim()
//     .custom((value, { req }) => {
//       return User.findOne({ email: value })
//         .then(userDoc => {
//           if (userDoc) {
//             return Promise.reject('E-Mail address already exists!');
//           }
//         });
//     }),
// ], authController.signup);

router.post('/signup', authController.signup);

router.post('/login', authController.login);

module.exports = router;
