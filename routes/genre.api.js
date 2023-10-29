const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genre.controller");

/**
 * @route GET /genres
 * @description Get a genre list
 * @access Public
 */
router.get("/", genreController.getGenreList);
module.exports = router;
