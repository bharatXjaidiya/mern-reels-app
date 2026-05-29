const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    followeeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : [true , "followee Id is required"]
    },
    followerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : [true , "follower Id is required"]
    }
},{timestamps : true})

followSchema.index({followeeId : 1 , followerId : 1},{unique : true})

const followModel = mongoose.model("follows",followSchema);

module.exports = followModel;