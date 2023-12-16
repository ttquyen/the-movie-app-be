const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Movie = require("../models/Movie");
const Comment = require("../models/Comment");
const Genre = require("../models/Genre");
const Rating = require("../models/Rating");
const Favorite = require("../models/Favorite");
const movieController = {};

const returnFields = {
    title: 1,
    overview: 1,
    backdrop_path: 1,
    poster_path: 1,
    imdb_id: 1,
    genre_ids: 1,
    vote_count: 1,
    vote_average: 1,
    popularity: 1,
    release_date: 1,
};
movieController.getMovieListByType = catchAsync(async (req, res, next) => {
    let { page = 1, limit = 10, listType, ...filter } = { ...req.query };
    const filterConditions = [{ isDeleted: false }];
    //Add filterConditions
    if (filter.title) {
        filterConditions.push({
            title: { $regex: filter.title, $options: "i" },
        });
    }
    if (filter.genreId) {
        filterConditions.push({
            genre_ids: { $eq: parseInt(filter.genreId) },
        });
    }
    if (listType) {
        switch (listType) {
            case "popular":
                filterConditions.push({
                    popularity: { $gte: 1200 },
                });
                break;
            case "top-rated":
                filterConditions.push({
                    vote_average: { $gte: 8 },
                });
                break;

            default:
                break;
        }
    }
    let filterCriteria = filterConditions.length
        ? { $and: filterConditions }
        : {};

    const count = await Movie.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const movies = await Movie.find(filterCriteria, returnFields)
        .skip(offset)
        .limit(limit);

    //Response
    return sendResponse(
        res,
        200,
        true,
        { movies, totalPages, count },
        null,
        "Get Movies By Type Successful"
    );
});
//Use for query Rated and Favorite Movie List of User
const getMoviesByCriteria = async (
    userId,
    filter,
    page,
    limit,
    movieModel, // Rating or Favorite
    additionalFields = []
) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let moviesData;
    //Get list of movieID related to current movieModel => Use them to find movie detail
    moviesData = await movieModel.find(
        { author: userId, ...filter },
        additionalFields.join(" ")
    );
    if (!moviesData || moviesData.length === 0) {
        return { movies: [], totalPages: 0, count: 0 };
    }

    const movieIds = moviesData.map((i) => i.movieId);
    const filterConditions = [{ isDeleted: false }, { _id: { $in: movieIds } }];

    const filterCriteria = filterConditions.length
        ? { $and: filterConditions }
        : {};

    const count = await Movie.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const movies = await Movie.find(filterCriteria, returnFields)
        .skip(offset)
        .limit(limit);

    //Map the user_rated_star to movie info (for Rating case)
    if (movieModel === Rating) {
        movies.forEach((movie) => {
            const correspondingRating = moviesData.find((data) => {
                return data.movieId.equals(movie._id);
            });
            const star = correspondingRating ? correspondingRating.star : null;
            if (star) movie._doc = { ...movie._doc, star };
        });
    }
    return { movies, totalPages, count };
};
movieController.getRatedMovieListOfUser = catchAsync(async (req, res, next) => {
    const userId = req.userId;
    const { page, limit, ...filter } = req.query;

    const { movies, totalPages, count } = await getMoviesByCriteria(
        userId,
        filter,
        page,
        limit,
        Rating,
        ["movieId", "star"]
    );

    return sendResponse(
        res,
        200,
        true,
        { movies, totalPages, count },
        null,
        "Get Rated Movies Successful"
    );
});

movieController.getFavoriteMovieListOfUser = catchAsync(
    async (req, res, next) => {
        const userId = req.userId;
        const { page, limit, ...filter } = req.query;

        const { movies, totalPages, count } = await getMoviesByCriteria(
            userId,
            filter,
            page,
            limit,
            Favorite,
            ["movieId"]
        );

        return sendResponse(
            res,
            200,
            true,
            { movies, totalPages, count },
            null,
            "Get Favorite Movies Successful"
        );
    }
);

movieController.getSingleMovie = catchAsync(async (req, res, next) => {
    const { id: movieId } = req.params;
    const userId = req.query.userId;

    const movie = await Movie.findOne({ _id: movieId, isDeleted: false });

    if (!movie) {
        throw new AppError(400, "Movie Not Found", "Get Single Movie Error");
    }

    const genre_ids = movie.genre_ids;
    const genres = await Genre.find({ id: { $in: genre_ids } });

    let user_rated = null;
    let isFavorite = false;

    if (userId) {
        const [alreadyRated, alreadyAddedFavorite] = await Promise.all([
            Rating.findOne({ movieId, author: userId }),
            Favorite.findOne({ movieId, author: userId }),
        ]);

        user_rated = alreadyRated ? alreadyRated.star : null;
        isFavorite = !!alreadyAddedFavorite;
    }

    const responsePayload = {
        ...movie.toObject(),
        genres,
        user_rated,
        isFavorite,
    };

    return sendResponse(
        res,
        200,
        true,
        responsePayload,
        null,
        "Get Single Movie Successful"
    );
});

movieController.getCommentsOfMovie = catchAsync(async (req, res, next) => {
    //Get data from request
    const movieId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    // Validate movie exist
    let movie = await Movie.findOne({ _id: movieId, isDeleted: false });
    if (!movie)
        throw new AppError(
            401,
            "Movie not found",
            "Get Comments of Movie Error"
        );

    //Count all comments of movie
    const count = await Comment.countDocuments({
        movie: movieId,
        isDeleted: false,
    });
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);
    //Get comment with author
    const comments = await Comment.find({ movie: movieId, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("author");

    //Response
    return sendResponse(
        res,
        200,
        true,
        { comments, totalPages, count },
        null,
        "Get Comments of Movie Successful"
    );
});
movieController.removeMovieFromFavoriteList = catchAsync(
    async (req, res, next) => {
        const ratingId = req.params.id;
        // Validate movie exist
        let rating = await Rating.findOneAndUpdate(
            { _id: ratingId, isDeleted: false },
            { isDeleted: true }
        );
        if (!rating)
            throw new AppError(
                401,
                "Rating not found",
                "Remove Movie From Favorite List Error"
            );

        //Response
        return sendResponse(
            res,
            200,
            true,
            rating,
            null,
            "Remove Movie From Favorite List Successful"
        );
    }
);
movieController.createMovie = catchAsync(async (req, res, next) => {
    //Get data from request
    const movieData = req.body;
    const movie = await Movie.create(movieData);
    //Response
    return sendResponse(
        res,
        200,
        true,
        movie,
        null,
        "Create a new film Successful"
    );
});
movieController.updateSingleMovie = catchAsync(async (req, res, next) => {
    //Get data from request
    const { id: movieId } = req.params;
    const { ...updatedData } = req.body;
    const movie = await Movie.findByIdAndUpdate(movieId, updatedData, {
        new: true,
    });
    if (!movie)
        throw new AppError(400, "Movie Not Found", "Update Single Movie Error");
    //Response
    return sendResponse(
        res,
        200,
        true,
        movie,
        null,
        "Update a film Successful"
    );
});
movieController.deleteSingleMovie = catchAsync(async (req, res, next) => {
    //Get data from request
    const { id: movieId } = req.params;
    const movie = await Movie.findByIdAndUpdate(movieId, { isDeleted: true });
    if (!movie)
        throw new AppError(400, "Movie Not Found", "Delete Single Movie Error");
    //Response
    return sendResponse(
        res,
        200,
        true,
        movie,
        null,
        "Delete a film Successful"
    );
});

module.exports = movieController;
