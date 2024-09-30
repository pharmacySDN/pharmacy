const express = require('express');
const router = express.Router();

const productRoutes = require('./productRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const userRoutes = require('./userRoutes');
const saleRoutes = require('./saleRoutes');
const reportRoutes = require('./reportRoutes');
const medicineGroupRoutes = require('./medicineGroupRoutes');

router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/users', userRoutes);
router.use('/sales', saleRoutes);
router.use('/reports', reportRoutes);
router.use('/medicine-groups', medicineGroupRoutes);

module.exports = router;
