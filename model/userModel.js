const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // Ensure jwt is imported

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email should be unique
  password: { type: String, required: true },
});

// Generate Auth Token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET_KEY);
  return token;
};

// Virtual for API keys
userSchema.virtual("apiKeys", {
  ref: "ApiKey",
  localField: "_id",
  foreignField: "userId",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
