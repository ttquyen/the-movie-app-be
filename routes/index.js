var express = require("express");
var router = express.Router();

//auth APIs
const authApi = require("./auth.api");
router.use("/auth", authApi);
//user APIs
const userApi = require("./user.api");
router.use("/users", userApi);
//movie APIs
const movieApi = require("./movie.api");
router.use("/movies", movieApi);
//comment APIs
const commentApi = require("./comment.api");
router.use("/comments", commentApi);
//rating APIs
const ratingApi = require("./rating.api");
router.use("/ratings", ratingApi);
//genre APIs
const genreApi = require("./genre.api");
router.use("/genres", genreApi);
//favorite APIs
const favoriteApi = require("./favorite.api");
router.use("/favorites", favoriteApi);

module.exports = router;
