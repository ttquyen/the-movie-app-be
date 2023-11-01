const Rating = require("../models/Rating");
const Movie = require("../models/Movie");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const mongoose = require("mongoose");

const ratingController = {};

const calculateRating = async (id) => {
    const stats = await Rating.aggregate([
        {
            $match: { movieId: new mongoose.Types.ObjectId(id) },
        },
        // [{ $set: { current_rating: { $avg: "rating.star" } } }],
        {
            $group: {
                _id: "$movieId",
                vote_average: { $avg: "$star" },
                vote_count: { $sum: 1 },
            },
        },
    ]);
    // console.log(stats);
    const vote_average = (stats[0] && stats[0].vote_average) || null;

    const vote_count = (stats[0] && stats[0].vote_count) || 0;
    await Movie.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { vote_average, vote_count }
    );
    return stats;
};
ratingController.setRating = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const { movieId, star } = req.body;

    //check movie exists
    const movie = await Movie.findOne({
        _id: movieId,
        isDeleted: false,
    });

    if (!movie) throw new AppError(400, `Movie Not Found`, "Set Rating Error");

    // Business Logic Validation

    let rating = await Rating.findOne({
        movieId,
        author: currentUserId,
    });
    if (!rating) {
        rating = await Rating.create({
            movieId,
            author: currentUserId,
            star,
        });
    } else {
        rating.star = star;
        await rating.save();
    }
    await calculateRating(movieId);

    //Response
    return sendResponse(res, 201, true, rating, null, "Rating Successful");
});
module.exports = ratingController;
