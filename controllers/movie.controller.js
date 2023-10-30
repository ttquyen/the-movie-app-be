const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Movie = require("../models/Movie");
const movieController = {};

movieController.getMovieListByType = catchAsync(async (req, res, next) => {
    //Get data from request
    const { listType } = req.params;
    let { page, limit, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const filterConditions = [{ isDeleted: false }];
    if (filter.name) {
        filterConditions.push({
            title: { $regex: filter.name, $options: "i" },
        });
    }
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
        case "upcoming":
            filterConditions.push({
                release_date: { $gt: "2023-10-01", $lte: "2023-12-30" },
            });
            break;
        default:
            break;
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
    let retMovieList;
    if (movies.length > 0) {
        // const fields = [
        //     "_id",
        //     "title",
        //     "overview",
        //     "backdrop_path",
        //     "poster_path",
        //     "imdb_id",
        //     "genre_ids",
        //     "vote_count",
        //     "vote_average",
        //     "popularity",
        //     "release_date",
        // ];
        // console.log(movies);
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
movieController.getFavoriteMovieListOfUser = catchAsync(
    async (req, res, next) => {
        //Get data from request
        // const userId = req.userId;
        // let { page, limit, ...filter } = { ...req.query };
        // page = parseInt(page) || 1;
        // limit = parseInt(limit) || 10;
        // const filterConditions = [{ isDeleted: false }];
        // if (filter.name) {
        //     filterConditions.push({
        //         title: { $regex: filter.name, $options: "i" },
        //     });
        // }
        // let filterCriteria = filterConditions.length
        //     ? { $and: filterConditions }
        //     : {};
        // const count = await Movie.countDocuments(filterCriteria);
        // const totalPages = Math.ceil(count / limit);
        // const offset = limit * (page - 1);
        // const movies = await Movie.find(filterCriteria)
        //     .sort({ createdAt: -1 })
        //     .skip(offset)
        //     .limit(limit);
        // let retMovieList;
        // if (movies.length > 0) {
        //     // const fields = [
        //     //     "_id",
        //     //     "title",
        //     //     "overview",
        //     //     "backdrop_path",
        //     //     "poster_path",
        //     //     "imdb_id",
        //     //     "genre_ids",
        //     //     "vote_count",
        //     //     "vote_average",
        //     //     "popularity",
        //     //     "release_date",
        //     // ];
        //     // console.log(movies);
        //     retMovieList = movies.map((m) => {
        //         return {
        //             _id: m._id,
        //             title: m.title,
        //             overview: m.overview,
        //             backdrop_path: m.backdrop_path,
        //             poster_path: m.poster_path,
        //             imdb_id: m.imdb_id,
        //             genre_ids: m.genre_ids,
        //             vote_count: m.vote_count,
        //             vote_average: m.vote_average,
        //             popularity: m.popularity,
        //             release_date: m.release_date,
        //         };
        //     });
        // }
        // //Response
        // return sendResponse(
        //     res,
        //     200,
        //     true,
        //     { movies: retMovieList, totalPages, count },
        //     null,
        //     "Get Movies By Type Successful"
        // );
    }
);
movieController.getSingleMovie = catchAsync(async (req, res, next) => {
    //Get data from request
    const { id: movieId } = req.params;

    const movie = await Movie.findOne({ _id: movieId, isDeleted: false });
    if (!movie)
        throw new AppError(400, "Movie Not Found", "Get Single Movie Error");
    //Response
    return sendResponse(
        res,
        200,
        true,
        movie,
        null,
        "Get Single Movie Successful"
    );
});
module.exports = movieController;
