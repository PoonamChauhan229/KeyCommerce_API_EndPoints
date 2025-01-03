const express = require('express');
const router = express.Router();
const User=require('../model/userModel');
const apiKeyAuth = require('../middleware/apiKeyAuth');

router.post('/user/addcart', apiKeyAuth, async (req, res) => {
    try {
      const { productId, qty } = req.body;
  
      // Ensure that the required parameters are provided
      if (!productId || !qty) {
        return res.status(400).json({ message: "productId and qty are required" });
      }
  
      // The user is already authenticated and available in req.user
      const user = req.user;

      // console.log(user);
      // Find the product from the user's products array
      const product = user.products.find((element) => element._id.toString() === productId.toString());

      // console.log(product);
      if (!product) {
        return res.status(404).json({ message: "Product not found in user's products" });
      }
  
      // Check if the product is already in the cart
      const existingCartItem = user.cart.find(item => item.productId.toString() === productId.toString());

      // console.log(existingCartItem);
  
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
          productImage: product.productImage,
          category: product.category,
          qty: qty,
          totalPrice: product.price * qty,  // Calculate total price
          addedAt: new Date(),
        });
      }
  
      // Save the updated user document
      await user.save();
  
      // Return a success response with the updated cart
      const addedCartItem = user.cart.find(item => item.productId.toString() === productId.toString())
      res.status(200).json({
        message: existingCartItem? "Product quantity updated in cart" : "Product added to cart successfully",
        cart: addedCartItem,  // The updated cart
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding product to cart", error: error.message });
    }
});

router.get('/user/getcart', apiKeyAuth, async (req, res) => {
    try {
      // The user is already authenticated and available in req.user
      const user = req.user;
  
      // Get the cart items associated with the user
      const cartItems = user.cart; // Assuming cart items are stored in the user document
  
      // Return the cart items
      res.status(200).json(cartItems);
    } catch (error) {
      console.error("Error retrieving cart items:", error);
      res.status(500).json({ message: "Server error" });
    }
});

router.delete('/user/deletecart/:id', apiKeyAuth, async (req, res) => {
    try {
      // The user is already authenticated and available in req.user
      const user = req.user;
      console.log(req.params.id)
      const cartItemId=req.params.id
      // Remove the cart item with the matching _id
    user.cart = user.cart.filter((item) => item._id.toString() !== cartItemId);
   
    await user.save();
     
    res.status(200).json({
       message: "Cart item deleted successfully",
        cart: user.cart 
      });

  } catch (error) {
      console.error("Error clearing cart items:", error);
      res.status(500).json({ message: "Server error" });
    }
});

// Empty the cart route
router.delete('/user/emptycart', apiKeyAuth, async (req, res) => {
    try { 
      // The user is already authenticated and available in req.user
      const user = req.user;      
      // Clear the cart by setting it to an empty array      
      user.cart = [];
      await user.save();
      res.status(200).json({ 
        message: "Cart cleared successfully",
         cart: user.cart 
        });
    } catch (error) { 
      console.error("Error clearing cart items:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
      