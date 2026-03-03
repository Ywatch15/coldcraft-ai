const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/coldcraft";
    await mongoose.connect(uri, { dbName: process.env.DB_NAME || "coldcraft" });
    console.log(`✓ Connected to MongoDB — database: ${mongoose.connection.db.databaseName}`);
  } catch (err) {
    console.error("✗ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
