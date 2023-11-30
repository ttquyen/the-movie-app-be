const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        required: true,
        enum: ["register", "change-password", "forgot-password"],
    },
    token: { type: String, required: true },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
