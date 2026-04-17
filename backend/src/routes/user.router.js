const express = require("express");
const userRouter = express.Router();
const followUserController = require("../controllers/user.contorller");
const authMiddleware = require("../middlewares/auth.middleware");


userRouter.post("/follow/:",authMiddleware,followUserController);

module.exports = userRouter