const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Movie = require("../models/Movie");
const Comment = require("../models/Comment");
const Genre = require("../models/Genre");
const Rating = require("../models/Rating");
const Favorite = require("../models/Favorite");
const movieController = {};

movieController.getMovieListByType = catchAsync(async (req, res, next) => {
    //Get data from request
    //   const listType = req.body.listType;
    let { page, limit, listType, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const filterConditions = [{ isDeleted: false }];
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
                    popularity: { $gte: 1000 },
                });
                break;
            case "top_rated":
                filterConditions.push({
                    vote_average: { $gte: 7 },
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

    const movies = await Movie.find(filterCriteria)
        // .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
    let retMovieList = [];
    if (movies.length > 0) {
        retMovieList = movies.map((m) => {
            return {
                _id: m._id,
                title: m.title,
                overview: m.overview,
                backdrop_path: m.backdrop_path,
                poster_path: m.poster_path,
                imdb_id: m.imdb_id,
                genre_ids: m.genre_ids,
                vote_count: m.vote_count,
                vote_average: m.vote_average,
                popularity: m.popularity,
                release_date: m.release_date,
            };
        });
    }

    //Response
    return sendResponse(
        res,
        200,
        true,
        { movies: retMovieList, totalPages, count },
        null,
        "Get Movies By Type Successful"
    );
});
movieController.getRatedMovieListOfUser = catchAsync(async (req, res, next) => {
    // Get data from request
    const userId = req.userId;
    let { page, limit, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let ratedMovies = await Rating.find(
        { author: userId, isDeleted: false },
        "movieId star"
    );
    if (!ratedMovies) {
        return sendResponse(
            res,
            200,
            true,
            { movies: [], totalPages: 0, count: 0 },
            null,
            "Get Rated Movies Successful"
        );
    }
    let movieIds = ratedMovies.map((i) => i.movieId);
    const filterConditions = [{ isDeleted: false }, { _id: { $in: movieIds } }];
    if (filter.title) {
        filterConditions.push({
            title: { $regex: filter.title, $options: "i" },
        });
    }

    let filterCriteria = filterConditions.length
        ? { $and: filterConditions }
        : {};
    const count = await Movie.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);
    const movies = await Movie.find(filterCriteria)
        // .sort(sortFilter)
        .skip(offset)
        .limit(limit);
    let retMovieList = [];
    if (movies.length > 0) {
        retMovieList = movies.map((m) => {
            let user_rated = ratedMovies.find((movie) =>
                movie.movieId.equals(m._id)
            ).star;
            return {
                _id: m._id,
                title: m.title,
                overview: m.overview,
                backdrop_path: m.backdrop_path,
                poster_path: m.poster_path,
                imdb_id: m.imdb_id,
                genre_ids: m.genre_ids,
                vote_count: m.vote_count,
                vote_average: m.vote_average,
                popularity: m.popularity,
                release_date: m.release_date,
                user_rated: user_rated,
            };
        });
    }
    //Response
    return sendResponse(
        res,
        200,
        true,
        { movies: retMovieList, totalPages, count },
        null,
        "Get Favorite Movies Successful"
    );
});
movieController.getFavoriteMovieListOfUser = catchAsync(
    async (req, res, next) => {
        // Get data from request
        const userId = req.userId;
        let { page, limit, ...filter } = { ...req.query };
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        let favMovies = await Favorite.find({ author: userId }, "movieId");
        if (!favMovies) {
            return sendResponse(
                res,
                200,
                true,
                { movies: [], totalPages: 0, count: 0 },
                null,
                "Get Rated Movies Successful"
            );
        }
        let movieIds = favMovies.map((i) => i.movieId);
        console.log("fav--", favMovies);
        console.log("movId---", movieIds);
        const filterConditions = [
            { isDeleted: false },
            { _id: { $in: movieIds } },
        ];
        if (filter.title) {
            filterConditions.push({
                title: { $regex: filter.title, $options: "i" },
            });
        }

        let filterCriteria = filterConditions.length
            ? { $and: filterConditions }
            : {};
        const count = await Movie.countDocuments(filterCriteria);
        const totalPages = Math.ceil(count / limit);
        const offset = limit * (page - 1);
        const movies = await Movie.find(filterCriteria)
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);
        let retMovieList = [];
        if (movies.length > 0) {
            retMovieList = movies.map((m) => {
                return {
                    _id: m._id,
                    title: m.title,
                    overview: m.overview,
                    backdrop_path: m.backdrop_path,
                    poster_path: m.poster_path,
                    imdb_id: m.imdb_id,
                    genre_ids: m.genre_ids,
                    vote_count: m.vote_count,
                    vote_average: m.vote_average,
                    popularity: m.popularity,
                    release_date: m.release_date,
                    isFavorite: true,
                };
            });
        }
        //Response
        return sendResponse(
            res,
            200,
            true,
            { movies: retMovieList, totalPages, count },
            null,
            "Get Favorite Movies Successful"
        );
    }
);
movieController.getSingleMovie = catchAsync(async (req, res, next) => {
    //Get data from request
    const { id: movieId } = req.params;
    const userId = req.query.userId;

    const movie = await Movie.findOne({ _id: movieId, isDeleted: false });
    if (!movie)
        throw new AppError(400, "Movie Not Found", "Get Single Movie Error");
    const genre_ids = movie.genre_ids;
    let genres = await Genre.find({ id: { $in: genre_ids } });
    let alreadyRated = await Rating.findOne({
        movieId: movieId,
        author: userId,
    });
    let user_rated = alreadyRated ? alreadyRated.star : null;

    let alreadyAddedFavorite = await Favorite.findOne({
        movieId: movieId,
        author: userId,
    });
    let isFavorite = alreadyAddedFavorite ? true : false;

    //Response
    return sendResponse(
        res,
        200,
        true,
        { ...movie._doc, genres, user_rated, isFavorite },
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

    // Process
    //get comments
    const count = await Comment.countDocuments({
        movie: movieId,
        isDeleted: false,
    });
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

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
        //Get data from request
        const ratingId = req.params.id;
        // const userId = req.userId;
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
