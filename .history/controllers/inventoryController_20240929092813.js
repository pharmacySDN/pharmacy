const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('product');
    res.render('inventory/index', { inventory });
  } catch (error) {
    res.status(500).send('Error fetching inventory');
  }
};

exports.getAddInventoryForm = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('inventory/add', { products });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

exports.addInventory = async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    
    // Update product stock
    const product = await Product.findById(req.body.product);
    if (req.body.type === 'purchase') {
      product.stock += req.body.quantity;
    } else if (req.body.type === 'sale') {
      product.stock -= req.body.quantity;
    }
    await product.save();

    res.redirect('/inventory');
  } catch (error) {
    res.status(400).render('inventory/add', { error: error.message });
  }
};

exports.searchInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({
      date: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
    }).populate('product');
    res.render('inventory/index', { inventory });
  } catch (error) {
    res.status(500).send('Error searching inventory');
  }
};

exports.generateStockReport = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('inventory/stockReport', { products });
  } catch (error) {
    res.status(500).send('Error generating stock report');
  }
};
