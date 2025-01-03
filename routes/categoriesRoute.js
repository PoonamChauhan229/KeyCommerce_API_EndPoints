const express = require("express");
const router = express.Router();
const apiKeyAuth = require("../middleware/apiKeyAuth");

// Get All Categories
router.get("/user/categories", apiKeyAuth, async (req, res) => {
    try {
        const user = req.user; // User is already attached by apiKeyAuth middleware

        if (!user.products || user.products.length === 0) {
            return res.status(404).json({ message: "No products found for this user" });
        }
            
        // Extract unique categories from the user's products
        const categories = [
            ...new Set(user.products.map((product) => product.category)),
        ];
        
        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }
  
        res.status(200).json( categories);
   
    } catch (error) { 
          res.status(500).json({ message: "Server error" });
        }
})

// Get Products Via Category
router.get('/user/:category', apiKeyAuth, async (req, res) => {
    try {
        // The user is already attached to req.user by the apiKeyAuth middleware
        const user = req.user;
        const categoryName = req.params.category;
        console.log(categoryName)
    
        // Get the products associated with the user
        const products = user.products.filter((element) => element.category.toLowerCase() === categoryName.toLowerCase());
    
        // Check if the user has any products
        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found for category: ${categoryName}` });
        }
    
        // Return the products
        res.status(200).json(products);
    } catch (error) {   
        res.status(500).json({ message: "Server error" });    
    }
});

module.exports = router;