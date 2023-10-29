const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const reactionController = require("../controllers/reaction.controller");

/**
 * @route POST /reactions
 * @description Save a reaction to film
 * @body {movieId, emoji: 'like' or 'dislike'}
 * @access Login required
 */
router.post(
    "/",
    authentication.loginRequired,
    validators.validate([
        body("movieId", "Invalid movieId")
            .exists()
            .custom(validators.checkObjectId),
        body("emoji", "Invalid Emoji").exists().isIn(["like", "dislike"]),
    ]),
    reactionController.setReaction
);
module.exports = router;
