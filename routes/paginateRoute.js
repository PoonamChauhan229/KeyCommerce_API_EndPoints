// GET http://localhost:5000/user/paginate_products?category=Electronics
// GET http://localhost:5000/user/paginate_products?limit=5&skip=5
// GET http://localhost:5000/user/paginate_products?sortBy=price:desc
// GET http://localhost:5000/user/paginate_products?category=Electronics&sortBy=price:desc
// GET http://localhost:5000/user/paginate_products?category=Electronics&limit=5&skip=5&sortBy=price:desc
// GET http://localhost:5000/user/paginate_products?limit=5&skip=5&sortBy=price:desc
// GET http://localhost:5000/user/paginate_products?sortBy=price:desc&limit=5&skip=5

const User=require('../model/userModel');
const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');

router.get('/user/paginate_products', apiKeyAuth, async (req, res) => {
    try {
        // The user is already attached to req.user by the apiKeyAuth middleware
        const user = req.user;
        const match = {};

        if (req.query.category) {
            match['products.category'] = req.query.category; // Filter by category
        }

        // Build the sort object
        let sort = {};
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(':');
            sort[`products.${field}`] = order === 'desc' ? -1 : 1; // Sort by field and order (desc or asc)
        }

        // Define limit and skip (pagination)
        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;

        // Initialize the aggregation pipeline
        const aggregationPipeline = [
            { $match: { _id: user._id } }, // Match the user by their ID
            { $unwind: '$products' }, // Unwind the products array to work with individual products
            { $match: match }, // Apply filters (like category)
        ];

        // Apply sorting only if sort is defined
        if (Object.keys(sort).length > 0) {
            aggregationPipeline.push({ $sort: sort });
        }

        // Apply pagination - skip and limit
        aggregationPipeline.push(
            { $skip: skip },
            { $limit: limit },
            { $project: { 'products': 1 } }
        );

        // Apply the aggregation
        const result = await User.aggregate(aggregationPipeline);

        // Get the total count of products without pagination
        const totalProducts = await User.aggregate([
            { $match: { _id: user._id } },
            { $unwind: '$products' },
            { $match: match }, // Reapply the same filters as before
            { $count: "total" }
        ]);

        const total = totalProducts.length > 0 ? totalProducts[0].total : 0;

        // Send the response
        res.status(200).json({
            products: result.map(item => item.products), // Return the list of products
            total,
            page: Math.floor(skip / limit) + 1,
            limit,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
