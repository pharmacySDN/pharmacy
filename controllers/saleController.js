const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('customer').populate('items.product');
    res.render('sales/index', { sales });
  } catch (error) {
    res.status(500).send('Error fetching sales');
  }
};

exports.getAddSaleForm = async (req, res) => {
  try {
    const products = await Product.find();
    const customers = await User.find({ role: 'customer' });
    res.render('sales/add', { products, customers });
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
};

exports.addSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();

    // Update product stock
    for (let item of sale.items) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    res.redirect('/api/sales');
  } catch (error) {
    res.status(400).render('sales/add', { error: error.message });
  }
};

exports.getSaleDetails = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('customer').populate('items.product');
    res.render('sales/details', { sale });
  } catch (error) {
    res.status(404).send('Sale not found');
  }
};

exports.updateSaleStatus = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, { status: req.body.status });
    
    if (req.body.status === 'returned') {
      // Update product stock for returned items
      for (let item of sale.items) {
        const product = await Product.findById(item.product);
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.redirect('/api/sales');
  } catch (error) {
    res.status(400).send('Error updating sale status');
  }
};

exports.searchSales = async (req, res) => {
  try {
    const sales = await Sale.find({
      date: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
    }).populate('customer').populate('items.product');
    res.render('sales/index', { sales });
  } catch (error) {
    res.status(500).send('Error searching sales');
  }
};
