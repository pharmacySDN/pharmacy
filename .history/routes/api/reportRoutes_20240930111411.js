const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/reportController');
const { hasRole } = require('../../middleware/auth');

router.get('/dashboard', hasRole(['admin', 'manager']), reportController.getDashboard);
router.get('/sales', hasRole(['admin', 'manager']), reportController.getSalesReport);
router.get('/inventory', hasRole(['admin', 'manager']), reportController.getInventoryReport);
router.get('/expiry', hasRole(['admin', 'manager']), reportController.getExpiryReport);

module.exports = router;
