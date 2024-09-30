const express = require('express');
const router = express.Router();

const productRoutes = require('./productRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const userRoutes = require('./userRoutes');
const saleRoutes = require('./saleRoutes');
const reportRoutes = require('./reportRoutes');
const medicineGroupRoutes = require('./medicineGroupRoutes');


router.use('/products', isAuthenticated(['admin', 'manager', 'employee']), productRoutes);
router.use('/inventory', isAuthenticated(['admin', 'manager', 'employee']), inventoryRoutes);
router.use('/users', isAuthenticated(['admin']), userRoutes);
router.use('/sales', isAuthenticated(['admin', 'manager', 'employee']), saleRoutes);
router.use('/reports', isAuthenticated(['admin', 'manager']), reportRoutes);
router.use('/medicine-groups', isAuthenticated(['admin', 'manager']), medicineGroupRoutes);

module.exports = router;
