const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/reportController');

router.get('/dashboard', reportController.getDashboard);
router.get('/salesReport', reportController.getSalesReport);
router.get('/inventoryReport', reportController.getInventoryReport);
router.get('/expiryReport', reportController.getExpiryReport);

module.exports = router;
