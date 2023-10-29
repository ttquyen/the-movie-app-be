const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = Schema(
    {
        content: { type: String, required: true },
        author: { type: Schema.ObjectId, required: true, ref: "User" },
        movie: { type: Schema.ObjectId, required: true, ref: "Movie" },
        isDeleted: { type: Boolean, default: false, select: false },
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
