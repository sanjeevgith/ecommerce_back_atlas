const router = require('express').Router();
const userModel = require("../models/userModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");



router.post("/register", async (req, res) => {
    const newUser = new userModel({
        username: req.body.username,
        email: req.body.email,
        //encrypt password with secret key
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRETKEY)
            .toString(),
    })

    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
})



router.post("/login", async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.body.username })
        !user && res.status(401).json("Wrong credentials!")
        //dcrypt password with secret key
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SECRETKEY
        );
        const OrifinalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRETKEY,
            { expiresIn: "30d" }
        );

        OrifinalPassword !== req.body.password &&
            res.status(401).json("Wrong Credentials!");
        //hide password column
        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken })

    } catch (err) {
        res.status(500).json(err);
    }

})










module.exports = router;