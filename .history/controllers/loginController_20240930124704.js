const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Show login form
exports.showLoginForm = (req, res) => {
  res.render('users/login'); // Render login page
};

// Handle login request
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ 'profile.email': email });
    if (!user) {
      return res.status(400).render('users/login', { error: 'Invalid email or password' });
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).render('users/login', { error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.profile.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Set the token as a cookie
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    // Redirect based on user role
    switch (user.role[0]) {  // Assuming the first role is the primary role
      case 'admin':
        return res.redirect('/api/reports/dashboard');
      case 'manager':
        return res.redirect('/api/inventory');
      case 'employee':
        return res.redirect('/api/sales');
      case 'customer':
        return res.redirect('/api/products');
      case 'supplier':
        return res.redirect('/api/inventory');
      default:
        return res.redirect('/');
    }
  } catch (error) {
    res.status(500).send('Error during login');
  }
};

// Handle logout request
exports.logout = (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/login');
};
