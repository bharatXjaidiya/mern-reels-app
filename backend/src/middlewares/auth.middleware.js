const jwt = require("jsonwebtoken")

function authMiddleware(req, res, next) {
    //checking the authenticity of user --> who is requsting
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided, Unauthorized access"
        })
    }

    let decoded = null

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message: "user not authorized"
        })
    }

    req.userId = decoded.id;
    req.userName = decoded.userName;
    next();
}

module.exports = authMiddleware;