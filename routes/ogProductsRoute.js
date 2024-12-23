const express = require('express');
const router = express.Router();
const OriginalProduct = require('../model/ogProductsModel');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Get all products route
router.get('/products', apiKeyAuth, async (req, res) => {
    console.log("Get all products route");
    const products = await OriginalProduct.find();
    res.json(products);
});


module.exports = router;
