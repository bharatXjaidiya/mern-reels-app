const jwt = require("jsonwebtoken");

const authMiddleware =(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message : "token is not found , unautharized access"})
    }
    let decode;
    try{
         decode = jwt.verify(token,process.env.JWT_SECRET);
    }
    catch(err){
        console.log(err)
        return res.status(401).json({message : "user not Autharized"})
    }

    req.userId = decode.id;
    next();
}

module.exports = authMiddleware