const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const commentController = require("../controllers/comment.controller");
/**
 * @route POST /comments
 * @description Create a new comment
 * @body {content, movieId}
 * @access Login required
 */
router.post(
    "/",
    authentication.loginRequired,
    validators.validate([
        body("content", "Missing Content").exists().notEmpty(),
        body("movieId", "Invalid MovieId")
            .exists()
            .isString()
            .custom(validators.checkObjectId),
    ]),
    commentController.createComment
);

/**
 * @route GET /comments/:id
 * @description Get detail of a comment
 * @access Public
 */
router.get(
    "/:id",
    validators.validate([
        param("id", "Invalid commentId")
            .exists()
            .isString()
            .custom(validators.checkObjectId),
    ]),
    commentController.getSingleComment
);

/**
 * @route PUT /comments/:id
 * @description Update a comment
 * @body {content}
 * @access Login required
 */
router.put(
    "/:id",
    authentication.loginRequired,
    validators.validate([
        body("content", "Missing Content").exists().notEmpty(),
        param("id", "Invalid commentId")
            .exists()
            .isString()
            .custom(validators.checkObjectId),
    ]),
    commentController.updateSingleComment
);

/**
 * @route DELETE /comments/:id
 * @description Delete a comment
 * @access Login required
 */
router.delete(
    "/:id",
    authentication.loginRequired,
    validators.validate([
        param("id", "Invalid commentId")
            .exists()
            .isString()
            .custom(validators.checkObjectId),
    ]),
    commentController.deleteSingleComment
);
module.exports = router;
