const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userProductSchema = require('../model/userProductsModel');
const authenticateUser = require('../middleware/tokenAuth');

router.get('/user/products', authenticateUser, async (req, res) => {
    const { userId } = req;
    const userCollection = mongoose.model(`user_${userId}`, userProductSchema);

    // Check if the user has a collection or create it if not
    let userProducts = await userCollection.findOne({ userId });

    if (!userProducts) {
        // If no data found for this user, create a new collection with original products
        userProducts = await userCollection.create({
            userId,
            products: [],
        });
    }

    res.json(userProducts);
});

// Add product to user's cart
router.post('/user/cart', authenticateUser, async (req, res) => {
    const { userId } = req;
    const { productId, quantity } = req.body;

    const userCollection = mongoose.model(`user_${userId}`, userProductSchema);

    // Check if the user already has the product in their cart
    const userProducts = await userCollection.findOne({ userId });

    if (userProducts) {
        const productIndex = userProducts.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex !== -1) {
            // If the product exists, update the quantity
            userProducts.products[productIndex].quantity += quantity;
        } else {
            // If the product doesn't exist, add it
            userProducts.products.push({ productId, quantity });
        }

        await userProducts.save();
        res.json(userProducts);
    } else {
        res.status(400).json({ message: 'User data not found' });
    }
});

// Remove product from user's cart
router.delete('/user/cart/:productId', authenticateUser, async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;

    const userCollection = mongoose.model(`user_${userId}`, userProductSchema);

    // Find and remove the product from the user's cart
    const userProducts = await userCollection.findOne({ userId });

    if (userProducts) {
        userProducts.products = userProducts.products.filter(p => p.productId.toString() !== productId);
        await userProducts.save();
        res.json(userProducts);
    } else {
        res.status(400).json({ message: 'User data not found' });
    }
});