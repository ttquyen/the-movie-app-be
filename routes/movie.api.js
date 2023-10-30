const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");

/**
 * @route GET /movies/:movieType?page=1&limit=10
 * @description Get all movies of a specific type with pagination
 * (Popular, upcoming, top rated) allow search by name
 * @access Public
 */
router.get("/:movieType", movieController.getMovieListByType);
/**
 * @route GET /movies/favorite/:userId?page=1&limit=10
 * @description Get all FAVORITE movies of an user with pagination
 * @access Login required
 */
router.get("/favorite/:userId", movieController.getFavoriteMovieListOfUser);
/**
 * @route GET /movies/:id
 * @description Get a single film
 * @access Public
 */
router.get("/:id", movieController.getSingleMovie);
module.exports = router;
