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
        
        const { startDate, endDate, medicineGroup, userName } = req.query;

        const filter = {};

        // Date range filter
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Medicine group filter
        if (medicineGroup) {
            const products = await Product.find({ category: medicineGroup }).select('_id');
            filter['items.product'] = { $in: products.map(p => p._id) };
        }

        // User name filter
        if (userName) {
            const user = await User.findOne({ 
                $or: [
                    { username: userName },
                    { 'profile.name': userName }
                ]
            });
            if (user) {
                filter.customer = user._id;
            }
        }

        // Get sales data with populated references
        const sales = await Sale.find(filter)
            .populate({
                path: 'customer',
                select: 'profile.name profile.email profile.contact'
            })
            .populate({
                path: 'items.product',
                select: 'name category price sku',
                populate: {
                    path: 'supplier',
                    select: 'profile.name'
                }
            })
            .sort({ date: 1 });

        // Process sales data for the graph
        const salesByDate = sales.reduce((acc, sale) => {
            const date = sale.date.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + sale.total;
            return acc;
        }, {});

        // Get medicine groups and users for the filter dropdowns
        const medicineGroups = await Product.distinct('category');
        const users = await User.find({ role: 'customer' }).select('profile.name')
        res.render('home/index', { lowStock, inStock, outOfStock, expired, totalSales, itemsSold, monthlySales,
            salesData: salesByDate,
            sales: sales.map(sale => ({
                orderId: sale._id,
                dateTime: sale.date,
                total: sale.total,
                customerName: sale.customer?.profile?.name,
                customerEmail: sale.customer?.profile?.email,
                customerContact: sale.customer?.profile?.contact,
                items: sale.items.map(item => ({
                    productName: item.product?.name,
                    category: item.product?.category,
                    price: item.product?.price,
                    quantity: item.quantity,
                    subtotal: item.quantity * item.product?.price,
                    supplier: item.product?.supplier?.profile?.name
                })),
                status: sale.status
            })),
            medicineGroups,
            users: users.map(user => user.profile.name),
            filters: {
                startDate: startDate || '',
                endDate: endDate || '',
                medicineGroup,
                userName
            }
        })
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
}
