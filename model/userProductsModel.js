const mongoose = require("mongoose");

const userProductSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    products: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
});

const UserProduct = mongoose.model("UserProduct", userProductSchema);

module.exports = UserProduct;