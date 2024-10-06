const bcrypt = require('bcrypt');
const { User } = require('../models/user.models.js');
const { generateCookie } = require('../utils/user.utils.js');

// user register 
const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;  // destructuring 
        let user = await User.findOne({ email });  // check from MongoDB

        if (user) {
            return res.status(409).json({  // 409 for conflict
                success: false,
                message: "User already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            name,
            email,
            password: hashPassword,  // saving hashed password
        });

        // Automatically log in user after registration
        generateCookie(user, res, 201, "User Registered Successfully and Logged in");
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error during registration",
            error: error.message
        });
    }
};

// user login 
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email does not exist",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials or Wrong Password"
            });
        }

        // Send token in cookie and success response
        generateCookie(user, res, 200, `Welcome ${user.name}`);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error during login",
            error: error.message
        });
    }
};

// user logout 
const userLogout = (req, res) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),  // expires immediately
            httpOnly: true
        }).json({
            success: true,
            message: "Logout successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error during logout",
            error: error.message
        });
    }
};

// user profile details 
const userProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching profile",
            error: error.message
        });
    }
};

// finding user by id 
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID, user does not exist"
            });
        }

        res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user by ID",
            error: error.message
        });
    }
};

// exporting all user-related functions
module.exports = {
    userRegister,
    userLogin,
    userLogout,
    userProfile,
    getUserById
};
