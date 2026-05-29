const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')


const authRouter = require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")
const userRouter = require("./routes/user.routes")


app.use(cookieParser())
app.use(express.json())

app.use("/api/auth/", authRouter)
app.use("/api/post/",postRouter)
app.use("/api/user/",userRouter)

module.exports = app;