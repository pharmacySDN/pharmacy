const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://levietduy:duy129171@<hostname>/?ssl=true&replicaSet=atlas-11lgc6-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0', {
     
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
