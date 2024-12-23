const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connection = require("./db/connection"); 
const apikeyRoute = require("./routes/apiKeyRoute");
const userRoute = require("./routes/userRoute");
const ogProductsRoute = require("./routes/ogProductsRoute");
const userProductsRoute = require("./routes/userProductsRoute");
dotenv.config()

app.use(cors());
app.use(express.json());

connection();

app.use(apikeyRoute);
app.use(userRoute);
app.use(ogProductsRoute)
app.use(userProductsRoute)

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});