const { sendEmail } = require("../helpers/email");
const {
    AppError,
    catchAsync,
    sendResponse,
    generateRandomNumber,
} = require("../helpers/utils");
const Token = require("../models/Token");
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
    const userId = req.userId;
    let { currentPassword, newPassword, token: inputToken } = req.body;
    const user = await User.findById(userId, "+password");
    if (!user)
        throw new AppError(400, "User Not Found", "Change Password Error");
    //check token, if not, generate and send by email, return
    if (!inputToken) {
        let token = await new Token({
            userId: userId,
            token: generateRandomNumber(),
            type: "change-password",
        }).save();

        await sendEmail(user, token, "Change Password");
        return sendResponse(
            res,
            200,
            true,
            {},
            null,
            "Please check your mailbox to get a token "
        );
    }

    const token = await Token.findOneAndRemove({
        userId: userId,
        token: inputToken,
        type: "change-password",
    });
    if (!token)
        throw new AppError(400, "Can not find token", "Change Password Error");

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
    return sendResponse(
        res,
        200,
        true,
        { user, accessToken },
        null,
        "Change Password Successful"
    );
});
authController.resetPassword = catchAsync(async (req, res, next) => {
    //Get data from request
    let { email } = req.body;
    const user = await User.findOne({ email, isDetele: false }, "+password");
    if (!user)
        throw new AppError(400, "User Not Found", "Reset Password Error");

    let newPassword = generateRandomNumber().toString();
    await sendEmail(user, { token: newPassword, type: "forgot-password" });

    //crypt new password
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    //update Password
    user.password = newPassword;
    await user.save();

    //Response
    return sendResponse(
        res,
        200,
        true,
        { user },
        null,
        "Please check your mailbox to get a new password"
    );
});
module.exports = authController;
