const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const genreSchema = Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true }
);

const Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;
