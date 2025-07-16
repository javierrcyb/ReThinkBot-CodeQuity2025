const express = require('express');
const passport = require('passport');
const { register } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../middlewares/validators');
const { validationResult } = require('express-validator');

const router = express.Router();

// Middleware para manejar errores de validación
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post('/register', registerValidator, handleValidation, register);

router.post('/login', loginValidator, handleValidation, passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logueado', user: { id: req.user.id, email: req.user.email } });
});

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Sesión cerrada' });
  });
});

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'No autenticado' });
  }
});

module.exports = router;
