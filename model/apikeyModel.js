const mongoose = require("mongoose");

const ApiKeySchema = new mongoose.Schema({
  apikey: { type: String, required: true,unique: true }, // UUID for the API key
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Relation to User
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

const ApiKey = mongoose.model("ApiKey", ApiKeySchema);

module.exports = ApiKey;
