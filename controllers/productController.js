const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const User = require('../models/User');
const inventorySchema = require('../validation/inventoryValidation');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('supplier').sort({ sku: -1 });
    res.render('products/index', { products });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('products/detail', { product });
  } catch (error) {
    res.status(500).send('Error fetching product details')
  }
};

exports.getAddProductForm = async (req, res) => {
  try {
    const suppliers = await User.find({ role: 'supplier' })
    res.render('products/add', { suppliers, errors: {}, formData: {} });
  } catch (error) {
    res.status(500).send('Error fetching suppliers')
  }
};

exports.addProduct = async (req, res) => {

  const { error } = inventorySchema.validate(req.body, { abortEarly: false });
  const suppliers = await User.find({ role: 'supplier' })

  const errors = {};
  if (error) {
    error.details.forEach(err => {
      errors[err.path[0]] = err.message; 
    });
  }

  if (Object.keys(errors).length > 0) {
    return res.render('products/add', { errors, suppliers, formData: req.body }); 
  }

  try {
    const { sku, name, description, price, supplier, quantity, expiryDate } = req.body;
    console.log(req.body);

    const product = new Product({ sku, name, description, price, supplier })
    const savedProduct = await product.save();

    const inventory = new Inventory({ quantity, expiryDate, product: savedProduct._id });
    await inventory.save();

    res.redirect('/api/products');
  } catch (err) {
    res.status(400).render('products/add', { err: err.message });
  }
};

exports.getEditProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product });
  } catch (error) {
    res.status(404).send('Product not found');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/api/products');
  } catch (error) {
    res.status(400).render('products/edit', { error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    await Inventory.deleteMany({ product: req.params.id });
    res.redirect('/api/products');
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const products = await Product.find({ name: new RegExp(req.query.search, 'i') }).populate('supplier').sort({ sku: -1 });
    res.render('products/index', { products });
  } catch (error) {
    res.status(500).send('Error searching products');
  }
};

