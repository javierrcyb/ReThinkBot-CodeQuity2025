const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const configurePassport = require('./passport/config');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: 'supersecreto',
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
