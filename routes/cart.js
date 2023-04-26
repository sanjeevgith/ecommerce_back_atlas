const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middleware/verifyToken');
const cartModel = require('../models/cartModel');

const router = require('express').Router();



router.post("/", verifyToken, async (req, res) => {
    const newCart = new cartModel(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    } catch (err) {
        res.status(401).json(err)
    }
})



router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await cartModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true })
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err)
    }
});



// router.delete("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
router.delete("/find/:id", verifyToken, async (req, res) => {
    try {
        await cartModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});





//get user cart
//verifyToken
// router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
router.get("/find/:userId", verifyToken, async (req, res) => {
    try {
        //const cart = await cartModel.findOne({ userId: req.params.userId });
        const cart = await cartModel.find({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});



//cart count
router.get("/counter/:userId", verifyToken,async (req, res) => {
    try {
        //const cart = await cartModel.findOne({ userId: req.params.userId });
        const cart = await cartModel.count({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});








//get all 
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await cartModel.find();
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(err)
    }
})











module.exports = router;