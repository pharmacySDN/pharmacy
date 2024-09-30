const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products/index', { products });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

exports.getAddProductForm = (req, res) => {
  res.render('products/add');
};

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.redirect('/api/products');
  } catch (error) {
    res.status(400).render('products/add', { error: error.message });
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
    res.redirect('/api/products');
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const products = await Product.find({ name: new RegExp(req.query.name, 'i') });
    res.render('products/index', { products });
  } catch (error) {
    res.status(500).send('Error searching products');
  }
};
