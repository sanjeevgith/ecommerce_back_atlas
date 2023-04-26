const {verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middleware/verifyToken');
const userModel = require('../models/userModel');

const router = require('express').Router();

router.get("/usertest", (req, res) => {
    res.send("user test succesfully")
})

router.post("/userposttest", (req, res) => {
    const username = req.body.username;
    console.log(username);
    res.send("youer username is " + username)
})





router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRETKEY
        ).toString();
    }
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true })
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err)
    }
});



router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});




// find all new
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await userModel.find().sort({ _id: -1 }).limit(5)
        : await userModel.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });



  //get status
  router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await userModel.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });




  




module.exports = router;