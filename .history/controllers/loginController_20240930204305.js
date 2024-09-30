const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Login method
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by email
    const user = await User.findOne({ 'profile.username': username });
    if (!user) {
      return res.status(400).render('users/login', { error: 'Invalid email or password' });
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).render('users/login', { error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Set the token as a cookie
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    // Redirect based on user role
    switch (user.role[0]) { // Assuming the first role is the primary role
      case 'admin':
        res.redirect('/api/reports/dashboard');
        break;
      case 'manager':
        res.redirect('/api/inventory');
        break;
      case 'employee':
        res.redirect('/api/sales');
        break;
      case 'customer':
        res.redirect('/api/products');
        break;
      case 'supplier':
        res.redirect('/api/inventory');
        break;
      default:
        res.redirect('/');
    }
  } catch (error) {
    res.status(500).send('Error during login');
  }
};

// Logout method
exports.logout = (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/api/login/login');
};
