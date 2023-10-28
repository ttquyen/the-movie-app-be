var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.send({ status: "OK", data: "Hello, It's the Movie App" });
});

module.exports = router;
