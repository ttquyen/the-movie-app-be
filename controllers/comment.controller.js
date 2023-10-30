const Comment = require("../models/Comment");
const User = require("../models/User");
const Movie = require("../models/Movie");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const commentController = {};
const calculateCommentCount = async (movieId) => {
    const commentCount = await Comment.countDocuments({
        movie: movieId,
        isDeleted: false,
    });
    await Movie.findByIdAndUpdate(movieId, { commentCount });
};
commentController.createComment = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const { content, movieId } = req.body;
    // Check already exist
    const movie = await Movie.findOne({ _id: movieId, isDeleted: false });
    if (!movie)
        throw new AppError(400, "Movie not found", "Create new comment error");

    // Create a new comment
    let comment = await Comment.create({
        content: content,
        movie: movieId,
        author: currentUserId,
    });
    //update comment count in a movie
    await calculateCommentCount(movieId);
    comment = await comment.populate("author");
    //Response
    return sendResponse(
        res,
        200,
        true,
        comment,
        null,
        "Create Comment Successful"
    );
});
commentController.getSingleComment = catchAsync(async (req, res, next) => {
    //Get data from request
    // const currentUserId = req.userId;
    const commentId = req.params.id;
    // Check already exist
    const comment = await Comment.findOne({
        _id: commentId,
        // author: currentUserId,
        isDeleted: false,
    });
    if (!comment)
        throw new AppError(
            400,
            "Comment not found",
            "Get single comment error"
        );
    //Response
    return sendResponse(res, 200, true, comment, null, " Successful");
});
commentController.updateSingleComment = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const { content } = req.body;
    const commentId = req.params.id;
    // Check already exist
    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            author: currentUserId,
            isDeleted: false,
        },
        { content },
        { new: true }
    );
    if (!comment)
        throw new AppError(
            400,
            "Comment not found or User not Authorize",
            "Update comment error"
        );

    //Response
    return sendResponse(
        res,
        200,
        true,
        comment,
        null,
        "Update Comment Successful"
    );
});
commentController.deleteSingleComment = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const commentId = req.params.id;
    // Check already exist
    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            author: currentUserId,
        },
        { isDeleted: true },
        { new: true }
    );
    if (!comment)
        throw new AppError(
            400,
            "Comment not found or User not Authorize",
            "Delete comment error"
        );
    calculateCommentCount(comment.movie);
    //Response
    return sendResponse(
        res,
        200,
        true,
        comment,
        null,
        "Delete Comment Successful"
    );
});

module.exports = commentController;
