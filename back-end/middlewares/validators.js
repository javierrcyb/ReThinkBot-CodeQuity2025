
const { body } = require('express-validator');

exports.registerValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('name').notEmpty().withMessage('The name is mandatory.'),
  body('password').isLength({ min: 6 }).withMessage('The password must be at least 6 characters long.')
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Require Password')
];