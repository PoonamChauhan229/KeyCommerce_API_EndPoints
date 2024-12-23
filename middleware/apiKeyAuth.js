const User = require("../model/userModel");

const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.header("x-api-key"); // Example header name
    if (!apiKey) {
        return res.status(401).json({ message: "API key missing" });
    }

    try {
        // Find user directly using the API key in the User model
        const user = await User.findOne({ apikey: apiKey });
        if (!user) {
            return res.status(401).json({ message: "Invalid API key" });
        }

        // Attach user info to the request
        req.user = user;
        next();
    } catch (error) {
        console.error("API Key Verification Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = apiKeyAuth;
