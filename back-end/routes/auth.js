const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await prisma.user.create({ data: { email, name } });
    res.json(user); // puedes enviar también un token en el futuro
  } catch (err) {
    res.status(400).json({ error: 'Email ya en uso' });
  }
});

// Login falso por ahora (solo busca usuario por email)
router.post('/login', async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    res.json({ token: user.id }); // usar JWT después
  } else {
    res.status(401).json({ error: 'Usuario no encontrado' });
  }
});

module.exports = router;
