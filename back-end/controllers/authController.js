const { registerUser, findOrCreateSession } = require('../services/authService');

exports.register = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const user = await registerUser(email, name, password);
    req.login(user, (err) => {
      if (err) throw err;
      res.json({ message: 'Registered', user: { id: user.id, email: user.email } });
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Fail Registered' });
  }
};

exports.login = async (req, res, next) => {
  findOrCreateSession(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Closed session' });
  });
};

exports.getMe = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};
