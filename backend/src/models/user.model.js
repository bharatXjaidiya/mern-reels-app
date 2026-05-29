const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String, default: "user bio's" },
    profilePic: { type: String, default: "https://xsgames.co/randomusers/assets/images/favicon.png" },
    banner : {type : String , default : "https://unsplash.com/photos/white-clouds-CAMwIxYk5Xg"}
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;


