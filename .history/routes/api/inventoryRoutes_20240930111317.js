const express = require('express');
const router = express.Router();
const inventoryController = require('../../controllers/inventoryController');
const { hasRole } = require('../../middleware/auth');

router.get('/', inventoryController.getAllInventory);
router.get('/add', hasRole(['admin', 'manager']), inventoryController.getAddInventoryForm);
router.post('/add', hasRole(['admin', 'manager']), inventoryController.addInventory);
router.get('/search', inventoryController.searchInventory);
router.get('/report', hasRole(['admin', 'manager']), inventoryController.generateStockReport);

module.exports = router;