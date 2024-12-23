const express = require("express");
const ApiKey = require("../model/apikeyModel");
const router = express.Router();
const tokenAuth=require('../middleware/tokenAuth');
const {v4:uuidv4} = require("uuid");

router.post("/generate_api_key",tokenAuth,async (req, res) => {
  const user=req.user;
  console.log(user)
  try{
      const newApiKey = new ApiKey({
          apikey: uuidv4(),
          userId: user._id
      });
     await newApiKey.save();
      res.status(201).json(newApiKey);
  }catch(error){
      res.status(500).json({error: error.message});
  }
  });
  
  module.exports = router;