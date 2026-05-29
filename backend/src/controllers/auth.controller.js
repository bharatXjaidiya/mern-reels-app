const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

async function registerController(req, res) {
    const { name, email, password, bio, } = req.body;

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

    const user = await userModel.create({ name, email, password: hash, bio });

    res.status(201).json({
        message: "User registered successfully.",
        user: {
            name: user.name,
            email: user.email,
            bio: user.bio,
            profilePic: user.profilePic,
            banner : user.banner
        }
    })
}

async function loginController(req, res) {
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

    res.status(200).json({ message: "user logdin successfully", user: { name: isExist.name, email: isExist.email, bio: isExist.bio, profilePic: isExist.profilePic , banner : isExist.banner} });
}

const getMeController = async (req, res) => {
    const userId = req.userId

    const user = await userModel.findById(userId).select("-password");

    res.status(200).json({ message: "user fetched successfully", user })

}


const logoutController = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json("user logout")
}

module.exports = { registerController, loginController, getMeController, logoutController}