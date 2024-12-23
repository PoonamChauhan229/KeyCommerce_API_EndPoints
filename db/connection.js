const mongoose = require("mongoose");
const User=require("../model/userModel");
const connection = async () => {
  try {
    // cleanupDuplicates();
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

const cleanupDuplicates = async () => {
  try {
    await User.deleteMany({ apiKey: null });
    console.log("Duplicate null API keys removed");
  } catch (err) {
    console.error("Error removing duplicates:", err);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = connection;
