const Errorhandler = require("../utils/Errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
//const { isPassportNumber } = require("validator");
const cloudinary = require("cloudinary");

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    })

    sendToken(user, 201, res);
})

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new Errorhandler('Please provide an email and a password', 400));
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
        return next(new Errorhandler("Please enter valid email and password", 400));
    }
    const ispasswordMatched = await user.comparePassword(password);

    if (!ispasswordMatched) {
        return next(new Errorhandler("Please enter valid email and password", 400));
    }

    sendToken(user, 200, res);
})

exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logout successfully completed"
    })
})

//forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new Errorhandler("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetpasswordToken = undefined;
        user.resetpasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new Errorhandler(error.message, 500));
    }
});


// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetpasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetpasswordToken,
        resetpasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new Errorhandler(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new Errorhandler("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

// update password
exports.UserUpdatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const ispasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!ispasswordMatched) {
        return next(new Errorhandler("old password is incorrect", 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new Errorhandler("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
})
// update user name and email (profile)
exports.UserUpdateProfile = catchAsyncError(async (req, res, next) => {

    const userData = {
        name: req.body.name,
        email: req.body.email
    }


    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        userData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, userData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})

// get all users (admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// get single user (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new Errorhandler("User does not exist", 400));
    }
    res.status(200).json({
        success: true,
        user
    })
})

// update roles (admin can update only)
exports.updateRoles = catchAsyncError(async (req, res, next) => {

    const userData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    let user = User.findById(req.params.id);

    if (!user) {
        return next(new Errorhandler(`User does not exist for this id ${req.params.id}`, 400));
    }


    user = await User.findByIdAndUpdate(req.params.id, userData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})

// delete user by admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user_id = req.params.id;
    const user = await User.findById(user_id);

    if (!user) {
        return next(new Errorhandler(`User does not exist for this id ${req.params.id}`, 400));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await User.deleteOne({ _id: user_id });
    res.status(200).json({
        success: true,
        message: "user deleted successfully"
    })

})


