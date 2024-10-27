const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: [String], enum: ['completed', 'returned', 'cancelled'], required: true }
});

module.exports = mongoose.model('Sale', saleSchema);
