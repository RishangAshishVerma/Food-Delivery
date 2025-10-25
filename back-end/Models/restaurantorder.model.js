import mongoose from "mongoose";

const restaurantOrderSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    restaurantOrderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true
        }
    ],

    subTotal: {
        type: Number,
        required: true
    },

    status:{
        type:String,
        enum:["pending","preparning","out for delivery","delivered"],
        default:"preparning"
    }
}, { timestamps: true });

const restaurantorder = mongoose.model("restaurantOrder", restaurantOrderSchema);
export default restaurantorder;
