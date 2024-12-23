const express = require("express");
const { v4: uuidv4 } = require("uuid");
const User = require("../model/userModel");
const tokenAuth = require("../middleware/tokenAuth");
const productsData = require("../utils/products.json");

const router = express.Router();

router.post("/generate_api_key", tokenAuth, async (req, res) => {
    const user = req.user; // Assuming tokenAuth middleware adds `req.user`
    try {
        // Check if the user already has an API key
        const existingUser = await User.findById(user._id);
        if (existingUser.apikey) {
            return res.status(200).json({
                message: "An API key already exists for this user.",
                apiKey: existingUser.apikey, // Return the existing API key
            });
        }

        // Add the products data from the JSON file to the user's products
        existingUser.products = productsData; // Set products data

        // Generate a new API key
        existingUser.apikey = uuidv4(); // Generate new API key

        // Save the user document with the new API key and products data
        await existingUser.save();

        res.status(201).json({
            apiKey: existingUser.apikey,
            message: `API key generated successfully for user ${user._id}`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
