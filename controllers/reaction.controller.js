const Reaction = require("../models/Reaction");
const Movie = require("../models/Movie");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const mongoose = require("mongoose");

const reactionController = {};

const calculateReaction = async (id) => {
    const stats = await Reaction.aggregate([
        {
            $match: { movieId: new mongoose.Types.ObjectId(id) },
        },
        {
            $group: {
                _id: "$movieId",
                like: {
                    $sum: {
                        $cond: [{ $eq: ["$emoji", "like"] }, 1, 0],
                    },
                },
                dislike: {
                    $sum: {
                        $cond: [{ $eq: ["$emoji", "dislike"] }, 1, 0],
                    },
                },
            },
        },
    ]);
    const reactions = {
        like: (stats[0] && stats[0].like) || 0,
        dislike: (stats[0] && stats[0].dislike) || 0,
    };
    await Movie.findOneAndUpdate({ _id: id, isDeleted: false }, { reactions });
    return reactions;
};
reactionController.setReaction = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const { movieId, emoji } = req.body;

    //check movie exists
    const movie = await Movie.findOne({
        _id: movieId,
        isDeleted: false,
    });

    if (!movie)
        throw new AppError(400, `Movie Not Found`, "Set Reaction Error");

    // Business Logic Validation
    /**
     * Find the reaction if exist
     *
     * If there is no reaction in the DB => Creats a new one
     *
     * If there is a previous reaction in the DB => compare the emojis
     * * If they are the same -> delete the reaction
     * * If they are different -> update the reaction
     * */

    let reaction = await Reaction.findOne({
        movieId,
        author: currentUserId,
    });
    if (!reaction) {
        reaction = await Reaction.create({
            movieId,
            author: currentUserId,
            emoji,
        });
    } else {
        if (reaction.emoji === emoji) {
            reaction = await Reaction.deleteOne({
                movieId,
                author: currentUserId,
            });
        } else {
            reaction.emoji = emoji;
            await reaction.save();
        }
    }

    //Count Reaction
    const reactions = await calculateReaction(movieId);

    //Response
    return sendResponse(
        res,
        201,
        true,
        reactions,
        null,
        "Set Reaction Successful"
    );
});
module.exports = reactionController;
