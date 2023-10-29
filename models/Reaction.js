const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = Schema(
    {
        author: { type: Schema.ObjectId, required: true, ref: "User" },
        movieId: { type: Schema.ObjectId, required: true, ref: "Movie" },
        emoji: {
            type: String,
            required: true,
            enum: ["like", "dislike"],
        },
    },
    { timestamps: true }
);

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;
