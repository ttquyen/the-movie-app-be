const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const ratingController = require("../controllers/rating.controller");

/**
 * @route POST /ratings
 * @description Save a rating to film
 * @body {movieId, star}
 * @access Login required
 */
router.post(
    "/",
    authentication.loginRequired,
    validators.validate([
        body("movieId", "Invalid movieId")
            .exists()
            .custom(validators.checkObjectId),
        body("star", "Invalid Star").exists().isNumeric(),
    ]),
    ratingController.setRating
);
module.exports = router;
