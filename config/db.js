const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    console.log('🔗 Connected to DB!');
  } catch (error) {
    console.error('❌ DB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
