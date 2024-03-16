const express = require("express");
const errorMiddleware = require("./middleware/error");
const cookie_parser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const app = express();

const path = require("path");

//config
dotenv.config({ path: "backend/config/config.env" })

app.use(express.json());
//app.use(express.urlencoded({ limit: '50mb' }));
app.use(cookie_parser())
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true, parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(fileUpload());

const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoutes");
const payment = require("./routes/paymentRoutes");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
})

// Middleware for Errors
app.use(errorMiddleware);



module.exports = app