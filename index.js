const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config()
const cors = require("cors");
const connection = require("./db/connection"); 
const apikeyRoute = require("./routes/apiKeyRoute");
app.use("/",apikeyRoute);
app.use(cors());
app.use(express.json());
connection();


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});