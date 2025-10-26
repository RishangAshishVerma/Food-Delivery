import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema({

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu"
    },

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },

    restaurantOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    broadcastedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    status: {
        type: String,
        enum: ["broadcasted", "assigned", "delivered"],
        default: "broadcasted"
    },

    acceptedAt: {
        type: Date
    },

  

}, { timestamps: true })


const DeliveryAssignment = mongoose.model("deliveryAssignment", deliveryAssignmentSchema)

export default DeliveryAssignment 