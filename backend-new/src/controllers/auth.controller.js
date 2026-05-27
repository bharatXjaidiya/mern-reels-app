const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

async function register(req, res) {
    const { name, email, password, bio, profilePic } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all the required fields." })
    }


    const isExist = await userModel.findOne({
        $or: [{ email }, { name }]
    })

    if (isExist) {
        return res.status(409).json({ message: "name or email already exists." })
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await userModel.create({ name, email, password: hash, bio, profilePic });

    res.status(201).json({
        message: "User registered successfully.",
        user: {
            name: user.name,
            email: user.email,
            bio: user.bio,
            profilePic: user.profilePic
        }
    })
}

async function login(req, res) {
    const { name, email, password } = req.body;

    if (!password && !(name || email)) {
        return res.status(400).json({ message: "Please enter all required fields." })
    }

    const isExist = await userModel.findOne({
        $or: [{ name }, { email }]
    })

    if (!isExist) {
        return res.status(404).json({ message: "User dosn't exist." })
    }

    const hash = isExist.password
    const isCorrectPassword = bcrypt.compareSync(password, hash)

    if (!isCorrectPassword) {
        return res.status(401).json({ message: "Unautharized Access." })
    }

    const token = jwt.sign(
        { id: isExist._id },              // payload
        process.env.JWT_SECRET,        // secret
        { expiresIn: "7d" }
    )

    res.cookie("token", token, {
        httpOnly: true,       // JS can't access it (prevents XSS)
        secure: true,         // only sent over HTTPS
        sameSite: "strict",   // prevents CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
    });

    res.status(200).json({ message: "user logdin successfully", user: { name: isExist.name, email: isExist.email, bio: isExist.bio, profilePic: isExist.profilePic } });
}

const getMe = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "unautharized access" })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findById(decode.id).select("-password");

    res.status(200).json({ message: "user fetched successfully", user })

}


const logout = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(404).json({ meassage: "user is not login" })
    }
    res.clearCookie("token");
    res.status(200).json("user logout")
}

module.exports = { register, login, getMe, logout }
