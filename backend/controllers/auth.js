
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { verifyEmail } = require('../emailVerify/verifyEmail');
const Session = require('../models/sessionModel');
const { SendOtp } = require('../emailVerify/otpSend');
const { options } = require('../routes/authroute');


const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );

        await verifyEmail(newUser.email, token);
        newUser.token = token;
        await newUser.save()

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verifyUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: "Invalid Authorization header"
            });
        }
        console.log('authHeader', authHeader)
        let token = authHeader.split(' ')[1];

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('verifyToken', verifyToken)

        if (!verifyToken) {
            return res.status(400).json({
                status: false,
                message: "token verification failed"
            })
        }

        const user = await User.findById(verifyToken?.id);
        console.log('user', user)
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "user not found"
            })
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            data: user
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        })
    }

}

const resendEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User  not found"
            });
        }
        console.log('existingUser', existingUser)

        const token = jwt.sign(
            {
                id: existingUser._id,

            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );

        console.log('token', token)
        await verifyEmail(email, token);
        return res.status(201).json({
            status: false,
            message: "email resend successully"
        })

    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error occure"
        })
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "please register first the login"
            });
        }
        console.log("user", user)


        const matchPassword = await bcrypt.compare(password, user?.password);
        if (!matchPassword) {
            return res.status(400).json({
                status: false,
                message: "Invalid crediontial"
            })
        }
        const token = jwt.sign(
            {
                id: user._id,

            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );


        if (user?.isVerified === false) {
            await verifyEmail(user.email, token);
        }
        user.token = token;
        user.isLoggedIn = true;
        const existingSession = await Session.findOne({
            userId: user._id
        });

        if (existingSession) {
            await Session.findByIdAndDelete(existingSession._id);
        }

        await Session.create({
            userId: user._id
        });
        await user.save()

        return res.status(201).json({
            success: true,
            message: "User login successfully successfully",
            data: user
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error occure "
        })
    }

}

const logout = async (req, res) => {

    try {
        const userId = req.user;
        console.log('userId', userId);
        await Session.deleteMany({ userId: userId?._id });
        await User.findByIdAndUpdate(userId?._id, { isLoggedIn: false })
        return res.status(200).json({
            status: true,
            message: "User Logout successfully"
        })



    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error occure "
        })
    }
}

const forgetPassowrd = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: "user not found"
            })
        }
        console.log('userff', user)
     const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // OTP expires after 10 minutes
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpires;

        await user.save();

        await SendOtp(user.email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        })
    }

}

const verifyOtp = async (req, res) => {
    try {
        const { otp, email } = req.body;

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Please fill the otp filed"
            })
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                status: false,
                message: "OTP has expired "
            })
        }

        if (user.otp != otp) {
            return res.status(400).json({
                status: false,
                message: "OTP not match"
            })
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        })


    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        })
    }

}

const changePassword = async (req, res) => {
    try {
        const { password, confirmPassword, email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        // Optional: clear OTP after successful reset
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



module.exports = { register, verifyUser, resendEmail, login, logout, forgetPassowrd, verifyOtp, changePassword }