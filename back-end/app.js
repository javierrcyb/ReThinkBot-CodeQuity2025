const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const configurePassport = require('./passport/config');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
}

app.use(express.json());

app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Usa true si usas HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// Rutas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/conversations', require('./routes/conversation'));

// === Servir frontend ===
const clientPath = path.join(__dirname, '../rethinkbot-client/dist');
app.use(express.static(clientPath));

// Fallback: SPA
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

module.exports = app;
