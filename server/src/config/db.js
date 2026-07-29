const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Google DNS

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studyvault');
    console.log(`[MongoDB] Connected Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection Failed: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
