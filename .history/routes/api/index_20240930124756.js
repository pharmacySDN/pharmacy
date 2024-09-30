const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middleware/auth');

const productRoutes = require('./productRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const userRoutes = require('./userRoutes');
const saleRoutes = require('./saleRoutes');
const reportRoutes = require('./reportRoutes');
const medicineGroupRoutes = require('./medicineGroupRoutes');

// Public routes for login
router.post('/login', loginController.login);
router.get('/login', loginController.showLoginForm);  // Render login page
router.post('/logout', loginController.logout);
router.use('/products', isAuthenticated(['admin', 'manager', 'employee']), productRoutes);
router.use('/inventory', isAuthenticated(['admin', 'manager', 'employee']), inventoryRoutes);
router.use('/sales', isAuthenticated(['admin', 'manager', 'employee']), saleRoutes);
router.use('/reports', isAuthenticated(['admin', 'manager']), reportRoutes);
router.use('/medicine-groups', isAuthenticated(['admin', 'manager']), medicineGroupRoutes);
router.use('/users', isAuthenticated(['admin', 'manager', 'employee']), userRoutes);
module.exports = router;
