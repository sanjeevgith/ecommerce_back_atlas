const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middleware/verifyToken');
const paymentModel = require('../models/paymentModel');

const router = require('express').Router();



router.post("/", verifyToken, async (req, res) => {
    const newCart = new paymentModel(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    } catch (err) {
        res.status(401).json(err)
    }
})







module.exports = router;