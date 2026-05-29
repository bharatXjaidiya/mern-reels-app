const express = require("express")
const postRouter = express.Router();
const upload = require("../middleware/multer.middleware")
const {createPostController,getAllPostsController, getPostController,getPostDetailController, likePostController, commentPostController, deletePostController} = require("../controllers/post.controller")
const authMiddleware = require("../middleware/auth.middleware")

postRouter.post("/create",authMiddleware,upload.single("imageUrl"),createPostController);
postRouter.get("/",getAllPostsController);
postRouter.get("/getPosts",authMiddleware,getPostController)
postRouter.get("/detail/:postId",authMiddleware,getPostDetailController)
postRouter.get("/like/:postId",authMiddleware,likePostController)
postRouter.post("/comment/:postId",authMiddleware,commentPostController)
postRouter.delete("/delete/:postId",authMiddleware,deletePostController)

module.exports = postRouter