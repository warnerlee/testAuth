const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => { console.log("test"); });

//Register
router.post("/", async (req, res) => {

    try {
        const { email, password, passwordVerify } = req.body;

        //validation
        if (!email || !password || !passwordVerify)
            return res
                .status(400)
                .json({errorMessage: "Please enter the required fields."});

        if (password.length < 6)
            return res
                .status(400)
                .json({errorMessage: "Password must be at least 6 characters."});

        if (password != passwordVerify)
            return res
                .status(400)
                .json({errorMessage: "Make sure your passwords match."});

        const existingUser = await User.findOne({email: email});

        if (existingUser)
            return res
                .status(400)
                .json({errorMessage: "This email is already ascociated with an account."});

        //hash password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // create user
        const newUser = new User({
            email, passwordHash
        });

        const savedUser = await newUser.save();
        
        //login
        const token = jwt.sign({
            user: savedUser._id
        }, process.env.JWT_SECRET);

        //send http only cookie
        res
            .cookie("token", token, {
                httpOnly: true,
            })
            .send();
    }
    catch (err) {
        console.log(err);
        res.status(500).send();
    }
  
});

//Login
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

         //validation
        if (!email || !password)
            return res
                .status(400)
                .json({errorMessage: "Please enter the required fields."});

        const existingUser = await User.findOne({email});
        if (!existingUser)
            return res
                .status(401)
                .json({errorMessage: "Wrong email or password."});

        const passwordCorrect =  await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect)
            return res
                .status(401)
                .json({errorMessage: "Wrong email or password."});

         //login
         const token = jwt.sign({
            user: existingUser._id,
        },
        process.env.JWT_SECRET);

        //send http only cookie
        res
            .cookie("token", token, {
                httpOnly: true,
            })
            .send();

    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

//Logout
router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    })
    .send();
});

module.exports = router;