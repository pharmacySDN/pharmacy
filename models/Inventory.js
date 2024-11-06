const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    quantity: { type: Number, required: true },
    addedDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    status: {type: String,  enum: ['Low Stock', 'In Stock', 'Out Of Stock', 'Expired', 'About To Expire'], default: 'In Stock'},
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

// inventorySchema.pre('save', function(next) {
//     const today = new Date();
//     const aboutExpiry = new Date(this.expiryDate);
//     aboutExpiry.setMonth(aboutExpiry.getMonth() - 1);

//     if (this.expiryDate < today) {
//         this.status = 'Expired';
//     } else if (today >= aboutExpiry && this.expiryDate >= today) {
//         this.status = 'About To Expire'
//     } else if (this.quantity === 0) {
//         this.status = 'Out Of Stock';
//     } else if (this.quantity < 20) {
//         this.status = 'Low Stock';
//     } else {
//         this.status = 'In Stock';
//     }
//     next();
// })

// Hàm cập nhật trạng thái
const updateStatus = function() {
    const today = new Date();
    const aboutExpiry = new Date(this.expiryDate);
    aboutExpiry.setMonth(aboutExpiry.getMonth() - 1);

    if (this.expiryDate < today) {
        this.status = 'Expired';
    } else if (today >= aboutExpiry && this.expiryDate >= today) {
        this.status = 'About To Expire';
    } else if (this.quantity === 0) {
        this.status = 'Out Of Stock';
    } else if (this.quantity < 20) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
};

// Middleware để cập nhật trạng thái trước khi lưu tài liệu
inventorySchema.pre('save', function(next) {
    updateStatus.call(this); // Gọi hàm cập nhật trạng thái
    next();
});

// Middleware để cập nhật trạng thái sau khi tìm kiếm
inventorySchema.post('find', function(docs) {
    docs.forEach(doc => {
        updateStatus.call(doc); // Gọi hàm cập nhật trạng thái cho từng tài liệu
        doc.save(); // Lưu tài liệu đã được cập nhật trạng thái
    });
});

module.exports = mongoose.model('Inventory', inventorySchema);
