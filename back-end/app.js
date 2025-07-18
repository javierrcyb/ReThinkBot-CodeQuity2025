const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const configurePassport = require('./passport/config');
require('dotenv').config();

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const sessionSecret = process.env.SESSION_SECRET

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

app.get('/', (req, res) => res.send('API ReThinkBot working'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/conversations', require('./routes/conversation'));

module.exports = app;
