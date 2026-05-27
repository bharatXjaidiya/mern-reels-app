const express = require('express')
const authRouter = express.Router()

const {register,login,getMe,logout} = require("../controllers/auth.controller")

authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.get("/getMe",getMe)
authRouter.get("/logout",logout)


module.exports = authRouter