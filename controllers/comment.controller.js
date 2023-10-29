const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Comment = require("../models/Comment");
const commentController = {};

commentController.createComment = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
commentController.getSingleComment = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
commentController.updateSingleComment = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
commentController.deleteSingleComment = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
module.exports = commentController;
