const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middleware/auth');
const productRoutes = require('./productRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const userRoutes = require('./userRoutes');
const saleRoutes = require('./saleRoutes');
const reportRoutes = require('./reportRoutes');
const loginRoutes = require('./loginRoutes'); // Import the login routes
const purchaseRoute = require('./purchaseRoute');
const homeRoute = require('./homeRoute');
const prescriptionRotes = require('./prescriptionRoutes');

router.use('/login', loginRoutes); // Use login routes
router.use('/products', isAuthenticated(['admin', 'manager', 'employee']), productRoutes);
router.use('/inventory', isAuthenticated(['admin', 'manager', 'employee']), inventoryRoutes);
router.use('/sales', isAuthenticated(['admin', 'manager', 'employee']), saleRoutes);
router.use('/reports', isAuthenticated(['admin', 'manager']), reportRoutes);
router.use('/prescriptions', isAuthenticated(['admin', 'manager']), prescriptionRotes);
router.use('/users', isAuthenticated(['admin', 'manager']), userRoutes);
router.use('/purchase', isAuthenticated(['customer']), purchaseRoute)
router.use('/', isAuthenticated(['admin', 'manager', 'employee']), homeRoute);

module.exports = router;
