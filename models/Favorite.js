const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = Schema(
  {
    author: { type: Schema.ObjectId, required: true, ref: "User" },
    movieId: { type: Schema.ObjectId, required: true, ref: "Movie" },
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
