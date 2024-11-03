const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../validation/userValidation');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.getAllUsers = async (req, res) => {
  try {
    let perPage = 5; 
    let page = parseInt(req.params.page) || 1;

    const count = await User.countDocuments();
    const users = await User.find({}, '-password').sort({ _id: -1 })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      
    res.render('users/index', { users, current: page, pages: Math.ceil(count / perPage) });
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
};

exports.getAddUserForm = (req, res) => {
  res.render('users/add', { errors: {}, formData: {} });
};

exports.addUser = async (req, res) => {

  const { error } = userSchema.validate(req.body, { abortEarly: false });

  const errors = {};
  if (error) {
    error.details.forEach(err => {
      errors[err.path.join('.')] = err.message;
    });
  }

  console.log(req.body);

  if (Object.keys(errors).length > 1) {
    return res.render('users/add', { errors, formData: req.body });
  }

  try {
    const { password, ...userData } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...userData, password: hashedPassword });
    console.log(user);
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
    // console.log(userData.name);

    if (password) {
      userData.password = await bcrypt.hash(password, 10);
    }
    await User.findByIdAndUpdate(req.params.id,
      {
        'profile.name': userData.name,
        'profile.email': userData.email,
        'profile.contact': userData.contact,
        'profile.address': userData.address,
        role: userData.role
      }, { new: true });
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
        { 'profile.email': new RegExp(req.query.search, 'i') },
        { 'role': new RegExp(req.query.search, 'i') }
      ]
    }, '-password');
    console.log(users);
    
    res.render('users/index', { users, pages: 1, current: 1 });
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



// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ 'profile.email': email });
//     if (!user) {
//       return res.status(400).render('users/login', { error: 'Invalid email or password' });
//     }

//     // Check if password matches
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     console.log('Stored Password:', user.password); // Debugging log
//     console.log('Input Password:', password);
//     if (!isPasswordValid) {
//       return res.status(400).render('users/login', { error: 'Invalid email or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

//     // Set the token as a cookie
//     res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

//     // Redirect based on user role
//     switch (user.role[0]) { // Assuming the first role is the primary role
//       case 'admin':
//         res.redirect('/api/reports/dashboard');
//         break;
//       case 'manager':
//         res.redirect('/api/inventory');
//         break;
//       case 'employee':
//         res.redirect('/api/sales');
//         break;
//       case 'customer':
//         res.redirect('/api/products');
//         break;
//       case 'supplier':
//         res.redirect('/api/inventory');
//         break;
//       default:
//         res.redirect('/');
//     }
//   } catch (error) {
//     res.status(500).send('Error during login');
//   }
// };


// // Logout method
// exports.logout = (req, res) => {
//   res.clearCookie('auth_token');
//   res.redirect('/login');
// };