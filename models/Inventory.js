const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: [String], enum: ['purchase', 'sale', 'return', 'adjustment'], required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    reference: { type: String, required: true }
});


module.exports = mongoose.model('Inventory', inventorySchema);
