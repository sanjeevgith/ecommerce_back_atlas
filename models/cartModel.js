const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1,
            },
            img: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            title: {
                type: String,
                required: true,
                // unique:true
            },
        }
    ]
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("cartModel", cartSchema)

