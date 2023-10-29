const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Reaction = require("../models/Reaction");
const reactionController = {};

reactionController.setReaction = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
module.exports = reactionController;
