
// routes/salesRoutes.js
const express = require('express');
const { hasRole } = require('../../middleware/auth');
const router = express.Router();
const { getSalesReport, downloadReport } = require('../../controllers/saleController');

router.get('/reports/sales', hasRole(['admin', 'manager']), getSalesReport);
router.get('/reports/sales/download',  hasRole(['admin', 'manager']), downloadReport);

module.exports = router;