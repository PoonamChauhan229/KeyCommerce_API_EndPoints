const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');


router.get('/user/products', apiKeyAuth, async (req, res) => {
    try {
        // The user is already attached to req.user by the apiKeyAuth middleware
        const user = req.user;

        // Get the products associated with the user
        const products = user.products; // Assuming products are stored in the user document

        // Check if the user has any products
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this user" });
        }

        // Return the products
        res.status(200).json(products);
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Add product to user's 
router.post('/user/products', apiKeyAuth, async (req, res) => {
    const { name, price, description } = req.body; // Expect product details in request body

    if (!name || !price || !description) {
        return res.status(400).json({ message: "Name, price, and description are required" });
    }

    try {
        // User is authenticated and available as req.user
        const user = req.user;

        // Create a new product
        const newProduct = { name, price, description };

        // Add the product to the user's products array
        user.products.push(newProduct);
        
        // Save the updated user document
        let dbproduct=await user.save();

        res.status(201).json({ message: "Product added successfully", product: dbproduct.products[dbproduct.products.length-1] });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update a product
router.put('/user/products/:productId', apiKeyAuth, async (req, res) => {
    const { productId } = req.params; // Product ID to be updated
    const { name, price, description } = req.body; // Updated product details

    if (!name && !price && !description) {
        return res.status(400).json({ message: "At least one field (name, price, or description) must be provided" });
    }

    try {
        // User is authenticated and available as req.user
        const user = req.user;

        // Find the product by its ID within the user's products array
        const product = user.products.id(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update product fields
        if (name) product.name = name;
        if (price) product.price = price;
        if (description) product.description = description;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//Delete a product
router.delete('/user/products/:productId', apiKeyAuth, async (req, res) => {
    const { productId } = req.params; // Product ID to be deleted

    try {
        // User is authenticated and available as req.user
        const user = req.user;

        // Find the product by its ID within the user's products array
        const product = user.products.id(productId);
        if (!product) {            
            return res.status(404).json({ message: "Product not found" });
        }

        // Remove the product from the user's products array        
        user.products.pull(product);

        // Save the updated user document        
        await user.save();

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {   
    }
});

module.exports = router;

