const express = require('express');
const router = express.Router();
const inventoryController = require('../../controllers/inventoryController');

router.get('/', inventoryController.getAllInventory);
router.get('/add', inventoryController.getAddInventoryForm);
router.post('/add', inventoryController.addInventory);
router.get('/search', inventoryController.searchInventory);
router.get('/report', inventoryController.generateStockReport);

module.exports = router;
