const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.render('users/index', { users });
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
};

exports.getAddUserForm = (req, res) => {
  res.render('users/add');
};

exports.addUser = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...userData, password: hashedPassword });
    await user.save();
    res.redirect('/api/users');
  } catch (error) {
    res.status(400).render('users/add', { error: error.message });
  }
};

exports.getEditUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    res.render('users/edit', { user });
  } catch (error) {
    res.status(404).send('User not found');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    if (password) {
      userData.password = await bcrypt.hash(password, 10);
    }
    await User.findByIdAndUpdate(req.params.id, userData);
    res.redirect('/api/users');
  } catch (error) {
    res.status(400).render('users/edit', { error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/api/users');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const users = await User.find({
      $or: [
        { username: new RegExp(req.query.search, 'i') },
        { 'profile.name': new RegExp(req.query.search, 'i') },
        { 'profile.email': new RegExp(req.query.search, 'i') }
      ]
    }, '-password');
    res.render('users/index', { users });
  } catch (error) {
    res.status(500).send('Error searching users');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { currentPassword, newPassword } = req.body;
    
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new Error('Current password is incorrect');
    }
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.redirect('/users');
  } catch (error) {
    res.status(400).render('users/changePassword', { error: error.message });
  }
};


// Login method
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
    console.log('Stored Password:', user.password); // Debugging log
    console.log('Input Password:', password);
    if (!isPasswordValid) {
      return res.status(400).render('users/login', { error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Set the token as a cookie
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    // Redirect to the user's dashboard or homepage
    res.redirect('/users/dashboard');
  } catch (error) {
    res.status(500).send('Error during login');
  }
};

// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('auth_token');
    res.redirect('/login');
  }
};

// Logout method
exports.logout = (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/login');
};