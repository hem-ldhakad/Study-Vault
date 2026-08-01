const dns = require('dns');
const mongoose = require('mongoose');

// Only apply Google DNS override in local development environment.
// On cloud hosts like Render, custom DNS overrides block container internal DNS, causing 502 Bad Gateway.
if (process.env.NODE_ENV !== 'production' && !process.env.RENDER) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    console.warn('[DNS] Could not set custom Google DNS servers:', err.message);
  }
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studyvault';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[MongoDB] Connected Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Primary connection attempt failed: ${error.message}`);
    // If local connection failed, try setting Google DNS as fallback
    if (process.env.NODE_ENV !== 'production' && !process.env.RENDER) {
      try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studyvault';
        const conn = await mongoose.connect(mongoUri);
        console.log(`[MongoDB] Connected Host after DNS fallback: ${conn.connection.host}`);
      } catch (retryErr) {
        console.error(`[MongoDB] Retry connection failed: ${retryErr.message}`);
      }
    }
  }
};

module.exports = connectDB;
