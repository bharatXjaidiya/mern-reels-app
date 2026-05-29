require("dotenv").config()
require("./src/config/connectToDb")


const app = require("./src/app")

app.listen(3000,()=>{
    console.log("Server is running on PORT 3000")
}) 



