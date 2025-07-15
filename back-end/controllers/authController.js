const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { email, name, password } = req.body;
  try {

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Ya existe un usuario con ese email' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, password: hash }
    });
    req.login(user, (err) => {
      if (err) throw err;
      res.json({ message: 'Registrado', user: { id: user.id, email: user.email } });
    });
  } catch (err) {
    res.status(400).json({ error: 'Registro fallido', details: err });
  }
};
