const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tantvani';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed if database is empty on server startup
    try {
      const Product = require('../models/Product');
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('📦 Database is empty. Auto-seeding initial products & categories...');
        const seedDatabase = require('../utils/seedProducts');
        await seedDatabase(false);
      }
    } catch (seedErr) {
      console.error('Auto-seed check warning:', seedErr.message);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Make sure MongoDB is running locally or MONGO_URI in backend/.env is correct.');
    process.exit(1);
  }
};

module.exports = connectDB;

