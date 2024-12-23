const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  products: [{ name: String, price: Number, description: String }],
  apikey: { type: String, unique: true }, // API key directly inside the User model
});

// Generate Auth Token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET_KEY);
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
