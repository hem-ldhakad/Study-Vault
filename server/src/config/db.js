const dns = require('dns');
const mongoose = require('mongoose');

// Enable Google DNS override ONLY if explicitly requested via USE_GOOGLE_DNS=true.
// On cloud providers (Render, Heroku, Vercel), setting custom DNS overrides breaks internal DNS & causes 502 timeouts.
if (process.env.USE_GOOGLE_DNS === 'true') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('[DNS] Applied custom Google DNS servers (8.8.8.8, 8.8.4.4)');
  } catch (err) {
    console.warn('[DNS] Could not set custom Google DNS servers:', err.message);
  }
}

const connectDB = async () => {
  try {
    const defaultAtlasUri = 'mongodb+srv://yt:MD1TFwxOoFnXFkRD@cluster0.plwim5z.mongodb.net/studyvault?retryWrites=true&w=majority';
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || defaultAtlasUri;
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Primary connection attempt failed: ${error.message}`);
  }
};

module.exports = connectDB;
