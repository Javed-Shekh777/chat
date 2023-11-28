const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')
const generateToken = require('../config/generateToken')
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs')
const validator = require('validator');
const emailValidator = require('deep-email-validator');
const nodemailer = require('nodemailer');
const otpgenerator = require('../config/otpGenerte');


// const OTP = otpgenerator();

cloudinary.config({
    cloud_name: 'javed-shekh',
    api_key: '147159497297257',
    api_secret: 'vzTaxYTe_8jlbrilZ-kOBhCNpzw'
})


// User Registration
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;
    const { image } = req.files;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please Enter all the Fields');
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            Message: 'Email must be a valid email',
        });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({
            Message: "Password must be a strong password.."
        })
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        res.json({
            Message: ("User already exists Please Go to Login")
        })
        throw new Error("User already exists Please Go to Login");
    }

    cloudinary.uploader.upload(image.tempFilePath, async (err, result) => {
        const pic = result.url;

        if (result) {
            const user = await User.create({
                name,
                email,
                password,
                pic

            });


            if (user) {

                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    pic: user.pic,
                    isAdmin: user.Admin,
                    token: generateToken(user._id),
                });

            } else {
                res.status(400)
                throw new Error('Failed to Create the User');
            }
        }
    }).catch(err => {
    
        res.status(500).json({
            error: err
        })
    })
});

// User Login
const authUser = asyncHandler(async (req, res) => {

    // res.send("Welcome to login Page")
    const { email, password } = req.body;


    const user = await User.findOne({ email });

    // (await user.matchPassword(password))
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        res.send({
            Message: "Invalid Email or Password",
        })
        throw new Error("Invalid Email or Password");

    }
});


//  '/api/user?search=javed

const allUsers = asyncHandler(async (req, res, next) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};


    
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    
    res.send(users);


});


const Gotp = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        res.status(400);
        res.send({
            Message: "Please fill the fileds!",
        });
    }

    try {

        var OTP = otpgenerator();

        var transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASSWORD,
            }
        });


        var mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Email OTP Verification',
            html: `  <div style="background : #fff;border: 1px solid #ccc;padding : 10px;border-radius : 10px;box-shadow : 3px 4px 5px 5px black;line-height : 15px">


        <h3 style="display : inline-block;">Hey ${name},</h3> <br/>
        Thank You for joining Chat App! 
        <br/><br/>
        Welcome to you. Before you begin your journey, we need to verify your account.
        Follow these steps to complete the verification process:
        <br/><br/>
         
     
        
        Please use following verification code to confirm your account.<br/>
        This code will be valid only for 15 minutes.
        <br/>
        <center><h2 style="color : blue;">${OTP}</h2></center>
     
        If you have any questions, simply reply to this email.
        I'm here to help.
       <br/>
       
        <br/> 
        <h4 style="display : inline-block;">Best Regards,</h4><h2> Javed Shekh</h2>  
        
       </div>
       `
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                return res.status(200).send(
                    {
                        Message: 'Email OTP send successfully! ',
                        genOtp: { OTP },

                    });
            }
        })

    } catch (error) {
        res.status(500).json({
            error: "Otp generation error!",
        })
    }





})
module.exports = { registerUser, authUser, allUsers, Gotp };