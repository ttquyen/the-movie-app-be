const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
authController.changePassword = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
module.exports = authController;
