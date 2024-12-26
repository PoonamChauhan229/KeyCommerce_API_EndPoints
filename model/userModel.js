const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  
  apikey: { type: String, unique: true }, // API key directly inside the User model
  products: [{ name: String, price: Number, description: String }],
  cart: [
    {
      productId: {type: mongoose.Schema.Types.ObjectId},
      name: String,
      price: Number,
      description: String,
      qty: { type: Number, required: true },
      totalPrice: Number, // Calculated as price * qty
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

// Generate Auth Token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET_KEY);
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
