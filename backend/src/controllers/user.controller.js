const postModel = require("../models/post.model")
const userModel = require("../models/user.model")
const followModel = require("../models/follow.model")

const followController = async (req, res) => {

    try {
        const followerId = req.userId;
        const followeeId = req.params.followeeId;

        if (followerId === followeeId) {
            return res.status(400).json({ message: "You can't follow yourself." })
        }

        const followee = await userModel.findById(followeeId);
        if (!followee) {
            return res.status(404).json({
                message: "The followee does not found."
            })
        }

        const followRecord = await followModel.create({
            followerId,
            followeeId
        })

        res.status(201).json({ message: "successfully following " + followee.name, followRecord })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

const unFollowController = async (req, res) => {
    const followerId = req.userId;
    const followeeId = req.params.followeeId;

    if (followerId === followeeId) {
        return res.status(400).json({ message: "You can't unfollow yourself." })
    }

    const followee = await userModel.findById(followeeId);
    if (!followee) {
        return res.status(404).json({
            message: "The followee does not found."
        })
    }

    const followRecord = await followModel.findOne({ followerId, followeeId })

    if (!followRecord) {
        return res.status(400).json({ message: "You are not following " + followee.name })
    }

    await followRecord.deleteOne()

    res.status(200).json({ message: "Successfully unfollowed " + followee.name })
}

module.exports = { followController, unFollowController }