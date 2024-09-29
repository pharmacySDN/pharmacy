const express = require('express');
const router = express.Router();
const saleController = require('../../controllers/saleController');

router.get('/', saleController.getAllSales);
router.get('/add', saleController.getAddSaleForm);
router.post('/add', saleController.addSale);
router.get('/:id', saleController.getSaleDetails);
router.post('/:id/status', saleController.updateSaleStatus);
router.get('/search', saleController.searchSales);

module.exports = router;