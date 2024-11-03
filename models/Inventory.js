const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    quantity: { type: Number, required: true },
    addedDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    status: {type: String,  enum: ['Low Stock', 'In Stock', 'Out Of Stock', 'Expired'], default: 'In Stock'},
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

inventorySchema.pre('save', function(next) {
    const today = new Date();
    if (this.expiryDate < today) {
        this.status = 'Expired';
    } else if (this.quantity === 0) {
        this.status = 'Out Of Stock';
    } else if (this.quantity < 20) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
    next();
})

module.exports = mongoose.model('Inventory', inventorySchema);
