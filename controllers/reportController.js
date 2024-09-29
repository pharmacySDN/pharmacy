const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0,0,0,0));
    const endOfDay = new Date(today.setHours(23,59,59,999));

    const dailySales = await Sale.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalSales = dailySales.reduce((acc, sale) => acc + sale.total, 0);
    const itemsSold = dailySales.reduce((acc, sale) => acc + sale.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } });

    res.render('reports/dashboard', { totalSales, itemsSold, lowStockProducts });
  } catch (error) {
    res.status(500).send('Error generating dashboard');
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log('startDate:', startDate, 'endDate:', endDate);
    const sales = await Sale.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('customer').populate('items.product');

    const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
    const itemsSold = sales.reduce((acc, sale) => acc + sale.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);

    res.render('reports/salesReport', { sales, totalSales, itemsSold, startDate, endDate });
  } catch (error) {
    res.status(500).send('Error generating sales report');
  }
};

exports.getInventoryReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const inventoryMovements = await Inventory.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('product');

    const productMovements = inventoryMovements.reduce((acc, movement) => {
      if (!acc[movement.product._id]) {
        acc[movement.product._id] = {
          product: movement.product,
          incomingQuantity: 0,
          outgoingQuantity: 0
        };
      }
      if (movement.type === 'purchase') {
        acc[movement.product._id].incomingQuantity += movement.quantity;
      } else if (movement.type === 'sale') {
        acc[movement.product._id].outgoingQuantity += movement.quantity;
      }
      return acc;
    }, {});

    res.render('reports/inventoryReport', { productMovements: Object.values(productMovements), startDate, endDate });
  } catch (error) {
    res.status(500).send('Error generating inventory report');
  }
};

exports.getExpiryReport = async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringProducts = await Product.find({
      expiryDate: { $lte: thirtyDaysFromNow }
    }).sort('expiryDate');

    res.render('reports/expiryReport', { expiringProducts });
  } catch (error) {
    res.status(500).send('Error generating expiry report');
  }
};
