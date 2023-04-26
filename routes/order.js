const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middleware/verifyToken');
const orderModel = require('../models/oredrModel');

const router = require('express').Router();





router.get("/findorder",verifyToken, async (req, res) => {
    try {
        const order = await orderModel.find();
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/findorder/:userId", verifyToken, async (req, res) => {
    try {
        const order = await orderModel.find({ userId: req.params.userId });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json(err);
    }
});



router.post("/", verifyToken, async (req, res) => {
    const newOrder = new orderModel(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    } catch (err) {
        res.status(401).json(err)
    }
})



router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true })
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err)
    }
});



router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await orderModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});


//get user order
// router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
//     try {
//         const order = await orderModel.find({ userId: req.params.userId });
//         res.status(200).json(order);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


//get all 
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await orderModel.find();
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err)
    }
})


//get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await orderModel.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  









module.exports = router