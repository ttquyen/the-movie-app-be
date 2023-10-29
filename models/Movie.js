const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = Schema(
    {
        title: { type: String, required: true },
        original_title: { type: String, required: true },
        belongs_to_collection: { type: Array, required: false, default: null },

        backdrop_path: { type: String, required: false, default: "" },
        poster_path: { type: String, required: false, default: "" },

        imdb_id: { type: String, required: false, default: "" },
        genre_ids: { type: Array, required: false, default: [] },
        vote_count: { type: Number, required: false, default: 0 },
        vote_average: { type: Number, required: false, default: null },
        popularity: { type: Number, required: false, default: null },
        release_date: { type: Date, required: false, default: "" },
        budget: { type: Number, required: false, default: null },
        runtime: { type: Number, required: false, default: null },
        tagline: { type: String, required: false, default: "" },
        adult: { type: Boolean, required: false, default: false },
        spoken_languages: { type: Array, required: false, default: [] },
        production_countries: { type: Array, required: false, default: [] },
        production_companies: { type: Array, required: false, default: [] },
        status: { type: String, required: false, default: "" },
        reactions: {
            like: { type: Number, default: 0 },
            dislike: { type: Number, default: 0 },
        },
        commentCount: { type: Number, default: 0 },

        isDeleted: { type: Boolean, default: false, select: false },
    },
    { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
