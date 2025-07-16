const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');

exports.registerUser = async (email, name, password) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('There is already a user with that email address.');

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, password: hash }
  });

  return user;
};

exports.findOrCreateSession = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ error: info.message });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: 'Log in', user: { id: user.id, email: user.email } });
    });
  })(req, res, next);
};
