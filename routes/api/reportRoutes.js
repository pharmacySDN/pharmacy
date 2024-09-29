const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/reportController');

router.get('/dashboard', reportController.getDashboard);
router.get('/sales', reportController.getSalesReport);
router.get('/inventory', reportController.getInventoryReport);
router.get('/expiry', reportController.getExpiryReport);

module.exports = router;
