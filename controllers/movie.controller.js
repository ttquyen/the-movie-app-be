const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Movie = require("../models/Movie");
const movieController = {};

movieController.getMovieListByType = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
movieController.getFavoriteMovieListOfUser = catchAsync(
    async (req, res, next) => {
        //Get data from request

        // Business Logic Validation

        // Process

        //Response
        sendResponse(res, 200, true, {}, null, " Successful");
    }
);
movieController.getSingleMovie = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
movieController.getMovieListByType = catchAsync(async (req, res, next) => {
    //Get data from request

    // Business Logic Validation

    // Process

    //Response
    sendResponse(res, 200, true, {}, null, " Successful");
});
module.exports = movieController;
