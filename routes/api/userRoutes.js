

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { isAuthenticated, hasRole } = require('../../middleware/auth');

// router.get('/login', (req, res) => {
//   res.render('users/login', { error: null });
// });

// router.post('/login', userController.login);
// router.get('/logout', userController.logout);

router.get('/dashboard', isAuthenticated(['admin', 'manager', 'employee', 'customer', 'supplier']), (req, res) => {
  res.send(`Welcome to your dashboard, ${req.user.email}`);
});

router.get('/', hasRole(['admin']), userController.getAllUsers);
router.get('/add', hasRole(['admin']), userController.getAddUserForm);
router.post('/add', hasRole(['admin']), userController.addUser);
router.get('/edit/:id', hasRole(['admin']), userController.getEditUserForm);
router.post('/edit/:id', hasRole(['admin']), userController.updateUser);
router.post('/delete/:id', hasRole(['admin']), userController.deleteUser);
router.get('/search', hasRole(['admin']), userController.searchUsers);
router.get('/changePassword/:id', isAuthenticated(['admin', 'manager', 'employee', 'customer', 'supplier']), (req, res) => res.render('users/changePassword', { user: { _id: req.params.id } }));
router.post('/changePassword/:id', isAuthenticated(['admin', 'manager', 'employee', 'customer', 'supplier']), userController.changePassword);
router.get('/:page', hasRole(['admin']), userController.getAllUsers);

module.exports = router;