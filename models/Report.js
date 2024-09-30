const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: [String], enum: ['sales', 'inventory', 'expiry', 'financial'], required: true },
    data: {
        totalSales: { type: Number, required: true },
        itemsSold: { type: Number, required: true }
    }
});

module.exports = mongoose.model('Report', reportSchema);
