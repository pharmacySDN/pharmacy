const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

// Login route
router.get('/login', (req, res) => {
    res.render('users/login', { error: null });
  });
  
  router.post('/login', userController.login);
  
  // Logout route
  router.get('/logout', userController.logout);
  
  // Protect routes by using middleware
  router.get('/dashboard', userController.isAuthenticated, (req, res) => {
    res.send(`Welcome to your dashboard, ${req.user.email}`);
  });
  


router.get('/', userController.getAllUsers);
router.get('/add', userController.getAddUserForm);
router.post('/add', userController.addUser);
router.get('/edit/:id', userController.getEditUserForm);
router.post('/edit/:id', userController.updateUser);
router.post('/delete/:id', userController.deleteUser);
router.get('/search', userController.searchUsers);
router.get('/changePassword/:id', (req, res) => res.render('users/changePassword', { user: { _id: req.params.id } }));
router.post('/changePassword/:id', userController.changePassword);

module.exports = router;
