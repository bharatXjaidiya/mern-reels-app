const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    imageUrl: { type: String, required: true },
    fileId : {type:String,required : true},
    caption: { type: String, required: true },
    description: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 }
});

const postModel = mongoose.model("posts", postSchema)

module.exports = postModel