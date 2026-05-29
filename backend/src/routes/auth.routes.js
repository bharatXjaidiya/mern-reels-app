const express = require('express')
const authRouter = express.Router()
const authMiddleware = require("../middleware/auth.middleware")

const {registerController,loginController,getMeController,logoutController} = require("../controllers/auth.controller")

authRouter.post("/register",registerController)
authRouter.post("/login",loginController)
authRouter.get("/getMe",authMiddleware,getMeController)
authRouter.get("/logout",authMiddleware,logoutController)


module.exports = authRouter