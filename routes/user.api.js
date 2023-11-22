const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const userController = require("../controllers/user.controller");
const authentication = require("../middlewares/authentication");
/**
 * @route POST /users
 * @description Register a new user
 * @body {name, email, password}
 * @access Public
 */
router.post(
    "/",
    validators.validate([
        body("name", "Invalid Name").exists().notEmpty(),
        body("email", "Invalid Email")
            .exists()
            .isEmail()
            .normalizeEmail({ gmail_remove_dots: false }),
        body("password", "Invalid Password")
            .exists()
            .notEmpty()
            .isLength({ min: 6 }),
    ]),
    userController.register
);
/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**
 * @route PUT /users/me
 * @description Update a user profile
 * @body {name}
 * @access Login required
 */
router.put(
    "/me",
    authentication.loginRequired,
    validators.validate([body("name", "Invalid name").exists().isString()]),
    userController.updateProfile
);
/**
 * @route GET /verify/:id/:token
 * @description Verify a account with token
 * @access Public
 */
router.get(
    "/verify/:id/:token",
    validators.validate([
        param("id", "Invalid UserID")
            .exists()
            .isString()
            .custom(validators.checkObjectId),
    ]),
    userController.verifyAccount
);
module.exports = router;
