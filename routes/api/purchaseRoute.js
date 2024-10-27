// routes/purchaseRoutes.js
const express = require('express');
const router = express.Router();
const purchaseController = require('../../controllers/purchaseController');
const { hasRole } = require('../../middleware/auth');

// View products
router.get('/products',  hasRole(['customer']), purchaseController.getProductList);

// Cart routes
router.get('/cart',  hasRole(['customer']), purchaseController.getCart);
router.post('/cart/add',  hasRole(['customer']), purchaseController.addToCart);
router.delete('/cart/:productId',  hasRole(['customer']), purchaseController.removeFromCart);
// routes/purchaseRoutes.js
router.get('/cart/count', hasRole(['customer']), purchaseController.getCartCount);
// Checkout
router.post('/checkout',  hasRole(['customer']), purchaseController.checkout);

module.exports = router;