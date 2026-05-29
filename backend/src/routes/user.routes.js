const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { followController, unFollowController } = require("../controllers/user.controller");

const userRouter = express();

userRouter.post("/follow/:followeeId", authMiddleware, followController);
userRouter.delete("/unfollow/:followeeId", authMiddleware, unFollowController)

module.exports = userRouter;