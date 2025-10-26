import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        required: true
    },

    deliveryAddress: {
        text: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },

    totalAmount: {
        type: Number,
        required: true
    },

    restaurantOrders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurantOrder",
        default: null
    }
}, { timestamps: true });

const Order = mongoose.model("order", orderSchema);
export default Order;
