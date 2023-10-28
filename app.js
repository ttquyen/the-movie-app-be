const express = require("express");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { sendResponse, AppError } = require("./helpers/utils");
const indexRouter = require("./routes/index");

const app = express();
const cors = require("cors");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use("/api", indexRouter);

//connect DB
const mongoose = require("mongoose");
const mongooseURI = process.env.MONGODB_URI;
mongoose
    .connect(mongooseURI)
    .then(() => console.log("DB connected ", mongooseURI))
    .catch((err) => console.log(err));

// Error Handlers

//catch 404
app.use((req, res, next) => {
    const err = new Error("Not Foundddd");
    err.statusCode = 404;
    next(err);
});
//middleware error handler to catch all errors
app.use((err, req, res, next) => {
    console.log("ERROR", err);
    if (err.isOperational) {
        return sendResponse(
            res,
            err.statusCode ? err.statusCode : 500,
            false,
            null,
            { message: err.message },
            err.errorType
        );
    } else {
        return sendResponse(
            res,
            err.statusCode ? err.statusCode : 500,
            false,
            null,
            { message: err.message },
            "Internal Server Error"
        );
    }
});

module.exports = app;
