const utilsHelper = {};

utilsHelper.sendResponse = (res, status, success, data, errors, message) => {
    const response = {};
    if (success) response.success = success;
    if (data) response.data = data;
    if (errors) response.errors = errors;
    if (message) response.message = message;

    return res.status(status).json(response);
};

utilsHelper.catchAsync = (func) => (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
};
utilsHelper.generateRandomNumber = () => {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
};

class AppError extends Error {
    constructor(statusCode, message, errorType) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;

        //all errors using this class are operational errors
        this.isOperational = true;

        //create a stack trace for debugging (Error obj, void obj to avoid stack polution)
        Error.captureStackTrace(this, this.constructor);
    }
}
utilsHelper.AppError = AppError;
module.exports = utilsHelper;
