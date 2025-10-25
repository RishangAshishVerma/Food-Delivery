import { count } from "console";
import mongoose from "mongoose";
import { type } from "os";

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true 
    },

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
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
         enum: ["Vegetarian", "Non-Vegetarian"],
    },
          
    rating:{
        average:{type:Number,default:0},
        count:{type:Number,default:0}
    },
    
    isdeleted:{
        type:Boolean,
        default: false
    }, 

}, { timestamps: true });

const Menu = mongoose.model("Menu",MenuSchema)
export default Menu 