const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Genre = require("../models/Genre");
const genreController = {};

genreController.getGenreList = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
module.exports = genreController;
