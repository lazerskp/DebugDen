const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken")

  

  exports.Register = async (req, res) => {
    try {
       
     const {name,email,password} = req.body
        if (!name  || !email || !password) {
            return res.status(300).json({
                success: false,
                message: "Missing Required Fields"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(300).json({
                success: false,
                message: "User Already Registered to this Platform, Please try Login"
            })
        }


        const hassedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hassedPassword,
        });

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user
        })

    }
    catch (e) {
        console.log(e.message);
    }

}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(300).json({
                success: false,
                message: "Email is Required"
            })
        }

        const existingUser = await User.findOne({ email }).select('+password');

        if (!existingUser) {
            return res.status(300).json({
                success: false,
                message: "User Not Found, Try Signup"
            })
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password);

        if (!comparePassword) {
            return res.status(200).json({
                success: false,
                message: "Password is Incorrect"
            })
        }

        const token = jwt.sign({ userId: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET);

        return res.status(200).json({
            success: true,
            message: "User Login Successfully",
            token: token,
            role: existingUser.role,
            user: { name: existingUser.name, email: existingUser.email } // Include user object with name
        })
    }
    catch (e) {
        console.log(e.message);
    }

}
