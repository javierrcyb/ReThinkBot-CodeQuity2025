const express = require('express');
const passport = require('passport');
const { register } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);

router.post('/login', passport.authenticate('local'), (req, res) => {
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
