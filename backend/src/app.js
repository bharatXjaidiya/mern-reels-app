const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.router")

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials : true , origin : "http://localhost:5173"}))

app.use("/api/auth",authRouter)
app.use("/api/post",postRouter)
app.use("/api/user",userRouter)

module.exports = app;