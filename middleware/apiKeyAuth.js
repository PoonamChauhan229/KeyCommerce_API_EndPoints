const ApiKey = require("../model/apikeyModel");
const User=require("../model/userModel");

const apiKeyAuth = async (req, res, next) => {
    console.log(req.header)
    const apiKey = req.header("x-api-key"); // Example header name
    if (!apiKey) {
        return res.status(401).json({ message: "API key missing" });
    }

    try {
        const apiKeyRecord = await ApiKey.findOne({ apikey: apiKey });
        console.log(apiKeyRecord)
        if (!apiKeyRecord) {
            return res.status(401).json({ message: "Invalid API key" });
        }

        // Attach user info based on the API key
        req.user = await User.findById(apiKeyRecord.userId);
        next();
    } catch (error) {
        console.error("API Key Verification Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = apiKeyAuth;
