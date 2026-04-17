const userModel = require("../models/user.models")
const followModel = require("../models/follow.model")


async function followUserController(req, res) {

    const followerName = req.userName;
    const followeeName = req.params.followeeName;

    if (followerName === followeeName) {
        return res.status(400).json({
            message: "can't follow yourself"
        })
    }
    const isFolloweeExists = await userModel.findOne({
        userName: followeeName
    })


    if (!isFolloweeExists) {
        return res.status(404).json({
            message: "User you are trying to follow does not exist"
        })
    }

    const alreadyFollowed = await followModel.findOne({
        follower: followerName,
        followee: followeeName
    })


    if (alreadyFollowed) {
        return res.status(200).json({
            message: `You are already following ${followeeName}`,
            follow: alreadyFollowed
        })
    }



    const newFollow = await followModel.create({
        follower: followerName,
        followee: followeeName
    })

    res.status(201).json({
        message: "followed successfully",
        newFollow
    })
}

async function unFollowUserController(req,res){
    const followerName = req.userName;
    const followeeName = req.params.followeeName;

    const isFollowing = await followModel.findOne({
        follower : followerName,
        followee : followeeName
    })

    if(!isFollowing){
        return res.status(400).json({
            message : "you are not following this user"
        })
    }

    await followModel.findByIdAndDelete(isFollowing._id);

    res.status(200).json({
        message : "you unfollowed " + followeeName
    })
}

module.exports = {
    followUserController,
    unFollowUserController
}