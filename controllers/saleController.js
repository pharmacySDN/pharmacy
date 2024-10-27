const Sale = require('../models/Sale');
const MedicineGroup = require('../models/MedicineGroup');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getSalesReport = async (req, res) => {
    try {
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
        const users = await User.find({ role: 'customer' }).select('profile.name');

        res.render('sales/index', {
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
        });
    } catch (error) {
        console.error('Error in getSalesReport:', error);
        res.status(500).send('Error generating sales report');
    }
};

exports.downloadReport = async (req, res) => {
    try {
        const { startDate, endDate, medicineGroup, userName } = req.query;

        const filter = {};

        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (medicineGroup) {
            const products = await Product.find({ category: medicineGroup }).select('_id');
            filter['items.product'] = { $in: products.map(p => p._id) };
        }

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

        const csvHeader = 'Order ID,Date,Time,Customer Name,Customer Email,Customer Contact,Product Name,Category,SKU,Price,Quantity,Subtotal,Supplier,Total,Status\n';
        const csvRows = sales.flatMap(sale => 
            sale.items.map(item => [
                sale._id,
                sale.date.toISOString().split('T')[0],
                sale.date.toISOString().split('T')[1].split('.')[0],
                sale.customer?.profile?.name || '',
                sale.customer?.profile?.email || '',
                sale.customer?.profile?.contact || '',
                item.product?.name || '',
                item.product?.category || '',
                item.product?.sku || '',
                item.product?.price || '',
                item.quantity,
                item.quantity * (item.product?.price || 0),
                item.product?.supplier?.profile?.name || '',
                sale.total || '',
                sale.status || ''
            ].join(','))
        ).join('\n');

        const csvContent = csvHeader + csvRows;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_report.csv');
        res.send(csvContent);

    } catch (error) {
        console.error('Error in downloadReport:', error);
        res.status(500).json({ error: 'Error downloading report' });
    }
};
