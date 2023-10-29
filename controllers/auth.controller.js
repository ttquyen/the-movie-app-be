const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
    //Get data from request
    const { email, password } = req.body;

    // Business Logic Validation
    //check match email
    const user = await User.findOne({ email }, "+password");
    if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");

    // Process
    //crypt and compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");
    //generate Token
    const accessToken = await user.generateToken();

    //Response
    sendResponse(
        res,
        200,
        true,
        { user, accessToken },
        null,
        "Login Successful"
    );
});
authController.changePassword = catchAsync(async (req, res, next) => {
    //Get data from request
    let { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    // Business Logic Validation
    //get current user info
    const user = await User.findById(userId, "+password");
    if (!user)
        throw new AppError(400, "Invalid Credentials", "Change Password Error");

    // Process
    //crypt and compare password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
        throw new AppError(
            400,
            "Wrong current password",
            "Change Password Error"
        );

    //crypt new password
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    //update Password
    user.password = newPassword;
    await user.save();

    //generate Token
    const accessToken = await user.generateToken();

    //Response
    sendResponse(
        res,
        200,
        true,
        { user, accessToken },
        null,
        "Change Password Successful"
    );
});
module.exports = authController;
