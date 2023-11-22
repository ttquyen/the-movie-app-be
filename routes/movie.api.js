const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const movieController = require("../controllers/movie.controller");
const validators = require("../middlewares/validators");
const { param, body } = require("express-validator");
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
 * @route GET /movies/detail/:id
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
 * @route GET /movies/comments/:id
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

/**
 * @route POST /movies
 * @description Post a new film
 * @access Login required, ADMIN
 */
router.post(
    "/",
    authentication.adminRequired,
    validators.validate([
        body("title", "Invalid Title").exists().isString(),
        body("overview", "Invalid Overview").exists().isString(),
    ]),
    movieController.createMovie
);
/**
 * @route PUT /movies/detail/:id
 * @description Edit a single film
 * @access Login required, ADMIN
 */
router.put(
    "/",
    authentication.adminRequired,
    validators.validate([
        param("id", "Invalid movieId")
            .exists()
            .isString()
            .custom(validators.checkObjectId),
    ]),
    movieController.updateSingleMovie
);
/**
 * @route DELETE /movies/detail/:id
 * @description Delete a single film
 * @access Login required, ADMIN
 */
router.delete(
    "/",
    authentication.adminRequired,
    validators.validate([
        param("id", "Invalid movieId")
            .exists()
            .isString()
            .custom(validators.checkObjectId),
    ]),
    movieController.deleteSingleMovie
);

module.exports = router;
