const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const { hasRole } = require('../../middleware/auth');

router.get('/', productController.getAllProducts);
router.get('/add', hasRole(['admin', 'manager']), productController.getAddProductForm);
router.post('/add', hasRole(['admin', 'manager']), productController.addProduct);
router.get('/edit/:id', hasRole(['admin', 'manager']), productController.getEditProductForm);
router.post('/edit/:id', hasRole(['admin', 'manager']), productController.updateProduct);
router.post('/delete/:id', hasRole(['admin']), productController.deleteProduct);
router.get('/search', productController.searchProducts);

module.exports = router;