const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = Schema(
    {
        author: { type: Schema.ObjectId, required: true, ref: "User" },
        movieId: { type: Schema.ObjectId, required: true, ref: "Movie" },
        star: { type: Number, required: true },
    },
    { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
