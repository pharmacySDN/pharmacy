const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: [String], enum: ['admin', 'manager', 'employee', 'customer', 'supplier'], required: true },
    profile: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        contact: { type: String, required: true }
    }
});

module.exports = mongoose.model('User', userSchema);
