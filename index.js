const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connection = require("./db/connection"); 
const apikeyRoute = require("./routes/apiKeyRoute");
const userRoute = require("./routes/userRoute");
const productsRoute = require("./routes/productsRoute");
const cartRoute = require("./routes/cartRoute");
const categoryRoute = require("./routes/categoriesRoute");
const paginateRoute=require("./routes/paginateRoute")

dotenv.config()

app.use(cors());
app.use(express.json());

connection();

app.use(apikeyRoute);
app.use(userRoute);
app.use(productsRoute)
app.use(cartRoute)
app.use(categoryRoute)
app.use(paginateRoute)


app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
});