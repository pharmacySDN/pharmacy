const Inventory = require("../models/Inventory");
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
    try {
        const lowStock = await Inventory.find().countDocuments({ status: 'Low Stock' });
        const inStock = await Inventory.find().countDocuments({ status: 'In Stock' });
        const outOfStock = await Inventory.find().countDocuments({ status: 'Out Of Stock' });
        const expired = await Inventory.find().countDocuments({ status: 'Expired' });
        // const products = await Product.countDocuments();

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        const dailySales = await Sale.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        const monthlysales = await Sale.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const totalSales = dailySales.reduce((acc, sale) => acc + sale.total, 0);
        const monthlySales = monthlysales.reduce((acc, sale) => acc + sale.total, 0);
        const itemsSold = dailySales.reduce((acc, sale) => acc + sale.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);

        res.render('home/index', { lowStock, inStock, outOfStock, expired, totalSales, itemsSold, monthlySales })
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
}
