const userModel = require("../models/user.models")

async function followUserController(req, res) {
    const followerName = req.userName;
    const followeeName = req.params.followeeName;
    if (followerName === followeeName) {
        return res.satus(400).json({
            message: "can't follow yourself"
        })
    }
    const isFolloweeExists = await userModel.findOne({
        followee: followeeName
    })

    if (!isFolloweeExists) {
        return res.status(404).json({
            message: "User you are trying to follow does not exist"
        })
    }

    const alreadyFollowed = userModel.find({
        follower: followerName,
        followee: followeeName
    })

    if (alreadyFollowed) {
       return res.status(200).json({
            message: `You are already following ${followeeName}`,
            follow: alreadyFollowed
        })
    }

    const newFollow = await userModle.create({
        follower: followeeName,
        followee: followeeName
    })

    res.satus(201).json({
        message: "followed successfully",
        newFollow
    })
}

module.exports = followUserController;