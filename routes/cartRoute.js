const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');

router.post('/user/cart', apiKeyAuth, async (req, res) => {
    try {
      const { productId, qty } = req.body;
  
      // Ensure that the required parameters are provided
      if (!productId || !qty) {
        return res.status(400).json({ message: "productId and qty are required" });
      }
  
      // The user is already authenticated and available in req.user
      const user = req.user;
  
      // Find the product from the user's products array
      const product = user.products.find(p => p._id.toString() === productId.toString());
  
      if (!product) {
        return res.status(404).json({ message: "Product not found in user's products" });
      }
  
      // Check if the product is already in the cart
      const existingCartItem = user.cart.find(item => item.productId.toString() === productId.toString());
  
      if (existingCartItem) {
        // Update the quantity and total price if the product is already in the cart
        existingCartItem.qty += qty;
        existingCartItem.totalPrice = existingCartItem.qty * product.price;
      } else {
        // If the product is not in the cart, add it
        user.cart.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          description: product.description,
          qty: qty,
          totalPrice: product.price * qty,  // Calculate total price
          addedAt: new Date(),
        });
      }
  
      // Save the updated user document
      await user.save();
  
      // Return a success response with the updated cart
      res.status(200).json({
        message: "Product added to cart successfully",
        cart: user.cart,  // The updated cart
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding product to cart", error: error.message });
    }
  });
  
      
      module.exports = router;
      