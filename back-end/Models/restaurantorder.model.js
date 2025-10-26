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

    Status: {
        type: String,
        enum: ["pending", "preparning", "out for delivery", "delivered"],
        default: "preparning"
    },

    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryAssignment",
    },

    assignedDeliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}

}, { timestamps: true });

const restaurantorder = mongoose.model("restaurantOrder", restaurantOrderSchema);
export default restaurantorder;
