const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "posts",
        require : true
    },

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    }
},{timestamp : true})

likeSchema.index({postId : 1, userId : 1},{unique : true})

const likeModel = mongoose.model("likes",likeSchema)

module.exports = likeModel