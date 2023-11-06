const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const favoriteController = require("../controllers/favorite.controller");

/**
 * @route POST /favorites
 * @description Save a favorite film
 * @body {movieId}
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("movieId", "Invalid movieId")
      .exists()
      .custom(validators.checkObjectId),
  ]),
  favoriteController.setFavoriteMovie
);

/**
 * @route DELETE /favorites/:id
 * @description Remove a favorite film
 * @body {movieId}
 * @access Login required
 */
router.delete(
  "/:movieId",
  authentication.loginRequired,
  validators.validate([
    param("movieId", "Invalid movieId")
      .exists()
      .custom(validators.checkObjectId),
  ]),
  favoriteController.removeFavoriteMovie
);
module.exports = router;
