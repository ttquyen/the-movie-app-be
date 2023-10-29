const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
    //Response
    sendResponse(
        res,
        201,
        true,
        { user, accessToken },
        null,
        "Create User Successful"
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
module.exports = userController;
