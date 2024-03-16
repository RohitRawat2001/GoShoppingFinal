const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your product name"]
    },
    description: {
        type: String,
        required: [true, "please enter your product description"]
    },
    price: {
        type: Number,
        required: [true, "please enter your price"],
        maxLength: [8, "please do not exceed 8 characters"]
    },
    category: {
        type: String,
        required: [true, "please enter your categorty"]
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        refs: 'User',
        required: true
    },
    stock: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("Product", productSchema)