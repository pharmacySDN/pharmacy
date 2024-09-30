const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming this is the path to your User model

exports.isAuthenticated = (roles) => async (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.clearCookie('auth_token');
      return res.redirect('/login');
    }

    if (roles && !roles.some(role => user.role.includes(role))) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('auth_token');
    res.redirect('/login');
  }
};

exports.hasRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.some(role => req.user.role.includes(role))) {
    return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
  }
  next();
};