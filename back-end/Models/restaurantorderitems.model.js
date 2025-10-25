import mongoose from "mongoose";

const restaurantOrderItemSchema = new mongoose.Schema({

    items: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true
    },
    name: {
        type: String
    },
    price: {
        type: Number,

    },
    quantity: Number,

}, { timestamps: true });



const restaurantorderitem = mongoose.model("restaurantOrderItem", restaurantOrderItemSchema)
export default restaurantorderitem 