const User = require('../models/User');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Inventory = require('../models/Inventory');
// Helper function to ensure cart initialization
const initializeCart = (req) => {
    if (!req.session) {
        throw new Error('Session middleware not properly configured');
    }
    if (!req.session.cart) {
        req.session.cart = [];
    }
    return req.session.cart;
};

exports.getCartCount = async (req, res) => {
    try {
        const cart = initializeCart(req);
        res.json({ cartCount: cart.length });
    } catch (error) {
        console.error('Error getting cart count:', error);
        res.status(500).json({ error: 'Error getting cart count' });
    }
};

exports.getProductList = async (req, res) => {
    try {
        const products = await Product.find({ stock: { $gt: 0 } })
            .populate('supplier', 'profile.name')
            .sort('category');

        // Group products by category
        const groupedProducts = products.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
        }, {});

        res.render('purchase/products', {
            products: groupedProducts,
            categories: Object.keys(groupedProducts)
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error loading products');
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = initializeCart(req);
        const productIds = cart.map(item => item.productId);

        const products = await Product.find({ _id: { $in: productIds } });

        const cartItems = products.map(product => {
            const cartItem = cart.find(item =>
                item.productId.toString() === product._id.toString());
            return {
                product,
                quantity: cartItem.quantity,
                subtotal: product.price * cartItem.quantity
            };
        });

        const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

        res.render('purchase/cart', {
            cartItems,
            total
        });
    } catch (error) {
        console.error('Error loading cart:', error);
        res.status(500).send('Error loading cart');
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate product exists and has enough stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // Initialize cart
        const cart = initializeCart(req);

        // Check if product already in cart
        const existingItemIndex = cart.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity if product already in cart
            const newQuantity = cart[existingItemIndex].quantity + parseInt(quantity);

            // Check if new total quantity exceeds stock
            if (newQuantity > product.stock) {
                return res.status(400).json({ error: 'Not enough stock available' });
            }

            cart[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart
            cart.push({
                productId,
                quantity: parseInt(quantity)
            });
        }

        // Save cart
        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ error: 'Error saving to cart' });
            }
            res.json({
                success: true,
                cartCount: cart.length,
                message: 'Added to cart successfully'
            });
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Error adding to cart' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = initializeCart(req);

        req.session.cart = cart.filter(
            item => item.productId.toString() !== productId
        );

        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ error: 'Error removing from cart' });
            }
            res.json({ success: true, cartCount: req.session.cart.length });
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Error removing item from cart' });
    }
};

exports.checkout = async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const cart = initializeCart(req);

        if (cart.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        try {
            // Create sale record
            const sale = new Sale({
                date: new Date(),
                customer: req.user._id,
                items: [],
                total: 0,
                paymentMethod,
                status: 'completed'
            });

            let total = 0;

            // Process each cart item
            for (const cartItem of cart) {
                const product = await Product.findById(cartItem.productId);

                if (!product || product.stock < cartItem.quantity) {
                    throw new Error(`Insufficient stock for product: ${product ? product.name : 'Unknown'}`);
                }

                // Update product stock
                product.stock -= cartItem.quantity;
                await product.save();

                // Add item to sale
                sale.items.push({
                    product: product._id,
                    quantity: cartItem.quantity,
                    price: product.price
                });

                // Create inventory record
                const existingInventory = await Inventory.findOne({ product: product._id });

                if (existingInventory) {
                    // If the inventory record already exists, update the quantity
                    existingInventory.quantity -= cartItem.quantity;
                    existingInventory.date = new Date();
                    existingInventory.reference = sale._id;
                    await existingInventory.save();
                } else {
                    // If no existing inventory record is found, create a new one
                    await new Inventory({
                        date: new Date(),
                        type: 'sale',
                        product: product._id,
                        quantity: product.stock-cartItem.quantity,
                        reference: sale._id
                    }).save();
                }

                total += product.price * cartItem.quantity;
            }

            sale.total = total;
            await sale.save();

            // Clear cart
            req.session.cart = [];

            req.session.save((err) => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.status(500).json({ error: 'Error processing checkout' });
                }
                res.json({
                    success: true,
                    saleId: sale._id,
                    message: 'Purchase completed successfully'
                });
            });
        } catch (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error processing checkout:', error);
        res.status(500).json({ error: 'Error processing checkout' });
    }
};
