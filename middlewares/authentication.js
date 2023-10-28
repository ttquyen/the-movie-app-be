const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils");

const authentication = {};
authentication.loginRequired = (req, res, next) => {
    try {
        //check accessToken
        const tokenString = req.headers.authorization;
        if (!tokenString)
            throw new AppError(401, "Login Required", "Authentication Error");

        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
            if (err) {
                if (err.name === "TokenExpiredError")
                    throw new AppError(
                        401,
                        "Token Expired",
                        "Authentication Error"
                    );
                else {
                    throw new AppError(
                        401,
                        "Token is invalid",
                        "Authentication Error"
                    );
                }
            }
            //if no error, add a new `userId` to req
            //note: payload is data, encoding by jwt verify token
            //_id is a key signed by jwt in User model (when generateToken)
            req.userId = payload._id;
        });
        //end of login required middleware
        //continue to main function
        next();
    } catch (err) {
        next(err);
    }
};
module.exports = authentication;
