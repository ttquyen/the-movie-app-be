const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        verified: { type: Boolean, default: false },
        role: { type: String, required: true },
        isDeleted: { type: Boolean, default: false, select: false },
    },
    { timestamps: true }
);

userSchema.methods.toJSON = function () {
    const user = this._doc;
    delete user.password;
    delete user.isDeleted;
    return user;
};

userSchema.methods.generateToken = async function () {
    const accessToken = await jwt.sign(
        { _id: this._id, role: this.role },
        JWT_SECRET_KEY,
        {
            expiresIn: "1d",
        }
    );
    return accessToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
