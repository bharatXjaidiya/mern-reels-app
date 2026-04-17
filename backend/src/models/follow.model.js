const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    follower : {
        type : mongoose.Types.ObjectId ,
        required : [true , "followe is required"]
    },
    followee : {
        type : mongoose.Types.ObjectId ,
        require : [true , "followee is required"]
    },
},{timestamps : true})

const userModel = mongoose.model("users",userSchema);