const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const movieController = require("../controllers/movie.controller");
const validators = require("../middlewares/validators");
const { param } = require("express-validator");
/**
 * @route GET /movies/lists/:listType?page=1&limit=10
 * @description Get all movies of a specific type with pagination
 * (Popular, upcoming, top rated) allow search by name
 * @access Public
 */
router.get("/lists", movieController.getMovieListByType);
/**
 * @route GET /movies/reated?page=1&limit=10
 * @description Get all FAVORITE movies of an user with pagination
 * @access Login required
 */
router.get(
  "/rated",
  authentication.loginRequired,
  movieController.getRatedMovieListOfUser
);
/**
 * @route GET /movies/favorite?page=1&limit=10
 * @description Get all FAVORITE movies of an user with pagination
 * @access Login required
 */
router.get(
  "/favorites",
  authentication.loginRequired,
  movieController.getFavoriteMovieListOfUser
);
/**
 * @route GET /movies/:id
 * @description Get a single film
 * @access Public
 */
router.get(
  "/detail/:id",
  validators.validate([
    param("id", "Invalid movieId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  movieController.getSingleMovie
);
/**
 * @route GET /movies/:id/comments
 * @description Get all comments of a film
 * @access Public
 */
router.get(
  "/comments/:id",
  validators.validate([
    param("id", "Invalid movieId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  movieController.getCommentsOfMovie
);

module.exports = router;
