const express = require("express");
const userRouter = express.Router();
const {followUserController , unFollowUserController} = require("../controllers/user.contorller");
const authMiddleware = require("../middlewares/auth.middleware");


userRouter.post("/follow/:followeeName",authMiddleware,followUserController);
userRouter.post("/unfollow/:followeeName",authMiddleware,unFollowUserController)
module.exports = userRouter