const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Genre = require("../models/Genre");
const genreController = {};

genreController.getGenreList = catchAsync(async (req, res, next) => {
    const genres = await Genre.find();
    if (!genres) throw new AppError(400, "Genre Not Found", "Get Genre Error");
    //Response
    return sendResponse(res, 200, true, genres, null, "Get Genres Successful");
});
module.exports = genreController;
