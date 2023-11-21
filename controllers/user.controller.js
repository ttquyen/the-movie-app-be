const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcryptjs");
const sendEmail = require("../helpers/email");
const crypto = require("crypto");
const userController = {};

userController.register = catchAsync(async (req, res, next) => {
    let { name, email, password } = req.body;

    //check already exist
    let user = await User.findOne({ email });
    if (user)
        throw new AppError(400, "User already exist", "Registration Error");

    //crypt password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    //create user
    user = await User.create({ name, email, password });

    const accessToken = await user.generateToken();

    let token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
        type: "register",
    }).save();

    await sendEmail(user, token);

    //Response
    return sendResponse(
        res,
        201,
        true,
        { user, accessToken },
        null,
        "Please check a verification email in your mailbox"
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
userController.verifyAccount = catchAsync(async (req, res, next) => {
    let { id: userID, token: verifyToken } = req.params;
    console.log(userID, verifyToken);
    const token = await Token.findOne({
        userId: userID,
        token: verifyToken,
        type: "register",
    });
    if (!token)
        throw new AppError(400, "Can not find Token", "Verify Account Error");

    let user = await User.findByIdAndUpdate(
        userID,
        { verified: true },
        { new: true }
    );
    if (!user)
        throw new AppError(400, "Can not find user", "Verify Account Error");

    //TODO remove token
    await token.delete();

    //Response
    return sendResponse(
        res,
        200,
        true,
        token,
        null,
        "Email Verified Successful"
    );
});

module.exports = userController;
