const postModel = require("../models/post.model")
const likeModel = require("../models/like.model")
const jwt = require("jsonwebtoken");
const ImageKit = require("imagekit");
const commentModel = require("../models/comment.model");


const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

const createPostController = async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ message: "no file uploaded" });
        }

        const { caption, description } = req.body;

        if (!caption || !description) {
            return res.status(400).json({ message: "all fields required" });
        }

        // upload to imagekit
        const result = await new Promise((resolve, reject) => {
            imageKit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "/posts"
            }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const post = await postModel.create({
            userId: req.userId,
            imageUrl: result.url,
            fileId: result.fileId,   // for deletion later
            caption,
            description,
        });

        res.status(201).json({ message: "post created successfully", post });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }

}

const getAllPostsController = async (req, res) => {
    const posts = await postModel.find();
    res.status(200).json({ message: "All posts fetched successfully.", posts })
}

const getPostController = async (req, res) => {
    const userId = req.userId;
    const posts = await postModel.find({ userId })

    if (posts.length === 0) {
        return res.status(404).json({ message: "No posts created yet." })
    }

    res.status(200).json({ message: "Posts fetched successfully.", posts })
}

const getPostDetailController = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.userId;

    const post = await postModel.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post does not found." })
    }

    const postOwnerId = post.userId.toString();

    if (postOwnerId != userId) {
        return res.status(403).json({
            message: "Forbidden, user dosn't have access to this post"
        })
    }

    res.status(200).json({ message: "Post details fetched.", post })
}

const likePostController = async (req, res) => {
    const userId = req.userId;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
        return res.status(404).json({
            message: "Post doesn't exist"
        })
    }

    const exist = await likeModel.findOne({ userId, postId });

    if (exist) {
        //dislike
        await exist.deleteOne();
        await postModel.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } })
        return res.status(200).json({ message: "Post unliked." })
    }

    await likeModel.create({ userId, postId });
    await postModel.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } })

    res.status(200).json({ meassage: "Post liked" })

}

const commentPostController = async (req, res) => {
    const userId = req.userId;
    const postId = req.params.postId;
    const { comment } = req.body;
    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "post doesn't exist"
        })
    }

    const result = await commentModel.create({
        userId,
        postId,
        comment
    })

    await postModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } })

    res.status(201).json({ message: "comment on post successfully", comment: result })
}

const deletePostController = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.postId;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post doesn't exist." })
        }

        const postOwner = post.userId.toString();

        if (userId != postOwner) {
            return res.status(403).json({ message: "can't delete this post" })
        }


        await new Promise((resolve, reject) => {
            imageKit.deleteFile(post.fileId, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        await postModel.findByIdAndDelete(postId);
        await likeModel.deleteMany({ postId });
        await commentModel.deleteMany({ postId });

        res.status(200).json({ message: "Post deleted successfully" })
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}
module.exports = { createPostController, getAllPostsController, getPostController, getPostDetailController, likePostController, commentPostController, deletePostController }