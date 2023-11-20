const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcryptjs");
const sendEmail = require("../helpers/email");
const crypto = require("crypto");
const userController = {};

userController.register = catchAsync(async (req, res, next) => {
    //Get data from request
    let { name, email, password } = req.body;

    // Business Logic Validation
    //check already exist
    let user = await User.findOne({ email });
    if (user)
        throw new AppError(400, "User already exist", "Registration Error");

    // Process

    //crypt password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password });

    const accessToken = await user.generateToken();

    let token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    }).save();

    await sendEmail(user, token, "Verify Email");

    //Response
    sendResponse(
        res,
        201,
        true,
        { user, accessToken },
        null,
        "An Email sent to your account please verify"
    );
});
userController.getCurrentUser = catchAsync(async (req, res, next) => {
    //Get data from request
    const userId = req.userId;
    // Business Logic Validation
    const user = await User.findById(userId);
    if (!user)
        throw new AppError(400, "User Not Found", "Get Current User Error");
    //Response
    sendResponse(res, 200, true, user, null, "Get Current User Successful");
});
userController.updateProfile = catchAsync(async (req, res, next) => {
    //Get data from request
    const userId = req.userId;
    const { name } = req.body;
    // Business Logic Validation
    let user = await User.findById(userId);
    if (!user)
        throw new AppError(400, "User Not Found", "Update User Profile Error");
    user.name = name;
    await user.save();
    //Response
    sendResponse(res, 200, true, user, null, "Update User Profile Successful");
});
userController.verifyEmail = catchAsync(async (req, res, next) => {
    let { id: userID, token: verifyToken } = req.params;
    const token = await Token.findOne({
        userId: userID,
        token: verifyToken,
    });
    if (!token)
        throw new AppError(400, "Can not find Token", "Verify Email Error");
    let user = await User.findByIdAndUpdate(
        userID,
        { verified: true },
        { new: true }
    );
    if (!user)
        throw new AppError(400, "Can not find user", "Verify Email Error");

    await Token.findByIdAndRemove(token._id);

    //Response
    sendResponse(res, 200, true, user, null, "Email Verified Successful");
});

module.exports = userController;
