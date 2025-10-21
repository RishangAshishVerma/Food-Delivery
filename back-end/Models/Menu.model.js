import mongoose from "mongoose";

const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true 
    },

    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shop"
    },

    category: {
        type: String,
        enum: [
            "Beverages", "Breads", "Breakfast", "Burgers", "Chinese", "Combos",
            "Continental", "Desserts", "Fast Food", "Italian", "Main Course",
            "Mexican", "North Indian", "Pasta", "Pizza", "Rice", "Salads",
            "Sandwiches", "Seafood", "Shakes", "Sides", "Snacks", "Soups",
            "South Indian", "Specials", "Starters", "Thai", "Thali", "Japanese",
            "Korean", "Mediterranean", "Barbecue", "Grill", "Wraps", "Bowls",
            "Tandoori", "Biryani", "Street Food", "Bakery", "Cakes", "Ice Cream",
            "Juices", "Healthy", "Vegan", "Others"
        ],
        required: true 
    },

    price: {
        type: Number,
        min: 0,
        required: true 
    },

    type: {
        type: String,
        enum: ["veg", "non-veg"] 
    }

}, { timestamps: true });

const Menu = mongoose.model("Menu",MenuSchema)
export default Menu 