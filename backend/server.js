const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectdatabase = require("./config/database");

// uncaught exceptions
process.on("uncaughtException", err => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to uncaught Exception`);

    process.exit(1)
})

//config
dotenv.config({ path: "backend/config/config.env" })

//connect to database
connectdatabase();

//cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

// unhandled Rejection
process.on("unhandledRejection", err => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to unhandled Rejection`);

    server.close(() => {
        process.exit(1);
    })
})