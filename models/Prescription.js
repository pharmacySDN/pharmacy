const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  product: [{
    quantity: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  }]
});

module.exports = mongoose.model('Prescription', prescriptionSchema);

