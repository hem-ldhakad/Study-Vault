const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS
} catch (err) {
  console.warn('[DNS] Could not set custom Google DNS servers:', err.message);
}

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studyvault';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection Failed: ${error.message}`);
  }
};

module.exports = connectDB;
