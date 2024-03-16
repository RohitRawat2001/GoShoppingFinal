const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        maxLength: [30, "Please do not exceed 30 characters"],
        minLength: [4, "Please name should be at least 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email address"],
        unique: true,
        validate: [validator.isEmail, "Please enter your valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Your password should be at least 8 characters long"],
        select: false //this will hide the password field while querying a document from database
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetpasswordToken: String,
    resetpasswordExpire: Date
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs.hash(this.password, 10);
})

//jwt token
userSchema.methods.getjwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = function (enterpassword) {
    return bcryptjs.compare(enterpassword, this.password);
}

// generating password reset token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetpasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetpasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}
module.exports = mongoose.model("User", userSchema);
