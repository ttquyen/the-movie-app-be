const Favorite = require("../models/Favorite");
const Movie = require("../models/Movie");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const mongoose = require("mongoose");

const favoriteController = {};

favoriteController.setFavoriteMovie = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const { movieId } = req.body;

    //check movie exists
    const movie = await Movie.findOne({
        _id: movieId,
        isDeleted: false,
    });

    if (!movie)
        throw new AppError(400, `Movie Not Found`, "Set Favorite Error");

    // Business Logic Validation

    let favorite = await Favorite.findOne({
        movieId,
        author: currentUserId,
    });
    if (!favorite) {
        favorite = await Favorite.create({
            movieId,
            author: currentUserId,
        });
    } else {
        throw new AppError(
            400,
            "Already added to favorites",
            "Add Favorite Movie Error"
        );
    }

    //Response
    return sendResponse(
        res,
        201,
        true,
        favorite,
        null,
        "Add Favorite Successful"
    );
});
favoriteController.getFavoriteMovies = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;

    //check movie exists
    const movie = await Movie.find({
        author: currentUserId,
        isDeleted: false,
    });

    if (!movie)
        throw new AppError(400, `Movie Not Found`, "Set Favorite Error");

    // Business Logic Validation

    let favorite = await Favorite.findOne({
        movieId,
        author: currentUserId,
    });
    if (!favorite) {
        favorite = await Favorite.create({
            movieId,
            author: currentUserId,
        });
    } else {
        throw new AppError(
            400,
            "Already added to favorites",
            "Add Favorite Movie Error"
        );
    }

    //Response
    return sendResponse(
        res,
        200,
        true,
        favorite,
        null,
        "Get Favorite Successful"
    );
});
favoriteController.removeFavoriteMovie = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const { movieId } = req.params;

    // Business Logic Validation
    let favorite = await Favorite.findOne({
        movieId,
        author: currentUserId,
    });
    if (!favorite) {
        throw new AppError(
            400,
            `Favorite Movie Not Found`,
            "Remove Favorite Error"
        );
    } else {
        await favorite.delete();
    }

    //Response
    return sendResponse(
        res,
        200,
        true,
        favorite,
        null,
        "Remove Favorite Successful"
    );
});

//removeFavoriteMovie
module.exports = favoriteController;
