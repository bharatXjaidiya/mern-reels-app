const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment : {
        type : String,
        required : [true , "comment is required for comment on the post"]
    },
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "posts",
        required : [true , "post id is required"]
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : [true , "user id is required"]
    }
},{timestamp : true})

commentSchema.index({postId : 1 , userId : 1},{unique : true});

const commentModel = mongoose.model("comments",commentSchema);

module.exports = commentModel;