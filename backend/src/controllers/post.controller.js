const postModel = require("../models/post.models");
const ImageKit = require('@imagekit/nodejs');
const { toFile } = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

async function createPostController(req, res) {
    try {

        //uploading img to the imagekit.io and getting the url
        const file = await client.files.upload({
            file: await toFile(Buffer.from(req.file.buffer), 'file'),
            fileName: 'test',
            folder: "cohort-2-insta-clone-post"
        });

        //creating post sending the resoponse ot the client
        const post = await postModel.create({
            caption: req.body.caption,
            imgUrl: file.url,
            userId: req.userId
        })

        res.status(201).json({
            message: "Post created successfully.",
            post
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }



}

async function getPostController(req, res) {

  const posts = await postModel.find({ userId: req.userId });

  res.status(200).json({
    message: "Posts fetched successfully",
    posts
  });
}


async function getPostDetailController(req,res){
    
    const userId = req.userId;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);
    if(!post){
        return res.status(404).json({
            message: "Post not found"
        })
    }  
    const postOwnerId = post.userId.toString();

    const verifiedRequest = postOwnerId === userId;

    if(!verifiedRequest){
        return res.status(403).json({
            message: "Forbidden, user dosn't have access to this post"
        })
    }
    
    res.status(200).json({
        message: "Post details fetched successfully",
        post
    })


}
module.exports = {createPostController , getPostController , getPostDetailController}