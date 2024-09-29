const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/add', productController.getAddProductForm);
router.post('/add', productController.addProduct);
router.get('/edit/:id', productController.getEditProductForm);
router.post('/edit/:id', productController.updateProduct);
router.post('/delete/:id', productController.deleteProduct);
router.get('/search', productController.searchProducts);

module.exports = router;
