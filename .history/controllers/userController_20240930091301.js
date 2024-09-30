const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require
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
    res.redirect('/users');
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
    res.redirect('/users');
  } catch (error) {
    res.status(400).render('users/edit', { error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
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

exports.login = async (req, res) = > {

}