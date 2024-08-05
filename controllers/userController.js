const JWT = require('jsonwebtoken')
const { compare } = require('bcrypt');
const { comparePassword, hashPassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel')
var { expressjwt: jwt } = require("express-jwt");

//middleware
const requireSingIn = jwt({
    secret: process.env.JWT_SECRET, algorithms: ["HS256"],
});
//REGISTER
const registerController = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body
        //validation
        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'name is required'
            })
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'email is required'
            })
        }
        if (!phoneNumber || phoneNumber.length < 10) {
            return res.status(400).send({
                success: false,
                message: 'phoneNumber is required and 10 character long'
            })
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: 'password is required and 6 character long'
            })
        }
        const exisitingUser = await userModel.findOne({ email })
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: 'User Already Register with this email'

            })
        }
        //hashed Password
        const encPassword = await hashPassword(password);

        //save user 
        const user = await userModel({ name, email, password: encPassword, phoneNumber }).save();

        return res.status(201).send({
            success: true,
            message: "Registration Successfull please login"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in Register API",
            error,
        });
    }
};
//LOGIN 
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        //Validation
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: 'please provide Email or password',
                error
            })
        }
        //find User
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(500).send({
                success: false,
                message: " User not Found"
            })
        }

        //match password 

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(500).send({
                success: false,
                message: " Invalid username and password",
            });
        }
        //TOKEN JWT '

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        })
        //Undeinfed password
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: "login successfully",
            token,
            user,
        })


    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'error in login api',
            error
        })
    }
};


const updateUserController = async (req, res) => {
    try {
        const { name, password, email, phoneNumber } = req.body;

        // Validate password length
        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: 'Password is required and should be 6 characters long'
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        if (password && password.length < 6) {
            // if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Password is required and should be 6 character long'
            });
        }

        // Hash password if provided
        const hashedPassword = password ? await hashPassword(password) : undefined;
        // Update user document
        const updateUser = await userModel.findOneAndUpdate(
            { email },
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phoneNumber: phoneNumber || user.phoneNumber
            },
            { new: true }
        );
        updateUser.password = undefined;

        // Send success response
        res.status(200).send({
            success: true,
            message: 'Profile Updated. Please Login',
            updateUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in User Update API',
            error
        });
    }
};


module.exports = {
    registerController,
    loginController,
    updateUserController,
    requireSingIn,
};