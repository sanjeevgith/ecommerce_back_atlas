const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    amount:{
        type:String,
        required:true
    },
    cardNumber: {
        type: String,
        required: true,
    },
    expDate: {
        type: String,
        required: true,
    },
    cvCode: {
        type: String,
        required: true,
    },
    couponCode: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("paymentSchema", paymentSchema)

