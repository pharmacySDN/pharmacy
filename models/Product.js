const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    price: { type: Number, required: true },
    sku: { type: String, required: true },
    stock: { type: Number, required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Product', productSchema);
