
const { body } = require('express-validator');

exports.registerValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida')
];