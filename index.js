const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payment")
const cors = require("cors");


//for strictQuery warning
mongoose.set('strictQuery', true);
dotenv.config()


//img file to long solution is 
app.use(express.json({limit: '50mb'}));


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection succesfully"))
    .catch((err) => { console.log(err); });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/payment",paymentRoutes)

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend Server is Running");
})

