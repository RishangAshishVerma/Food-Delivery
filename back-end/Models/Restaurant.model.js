import mongoose from "mongoose"

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    state: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        }
    ],

    isdeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

const Restaurant = mongoose.model("Restaurant", RestaurantSchema)
export default Restaurant