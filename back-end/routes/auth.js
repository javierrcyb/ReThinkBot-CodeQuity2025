const express = require('express');
const router = express.Router();
const passport = require('passport');

const { register, login, logout, getMe } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../middlewares/validators');
const handleValidation = require('../middlewares/handleValidation');

router.post('/register', registerValidator, handleValidation, register);
router.post('/login', loginValidator, handleValidation, login);
router.post('/logout', logout);
router.get('/me', getMe);

module.exports = router;
