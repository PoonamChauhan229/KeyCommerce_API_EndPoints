const mongoose = require("mongoose");

const originalProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
});

const OriginalProduct = mongoose.model("OriginalProduct", originalProductSchema);

module.exports = OriginalProduct;