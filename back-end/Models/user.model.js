import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },

    email: {
        type: String,
        require: true,
        unique: true,
    },

    password: {
        type: String,
       
    },

    mobile: {
        type: String,
        require: true,
    },

    role: {
        type: String,
        enum: ["user", "owner", "deliver"],
        require: true,

    },
    
    resetotp:{
        type:String
    },

    isoptverified:{
        type:Boolean,
        default:false
    },

    otpexpires:{
      type:Date  
    },
}, { timestamps: true })

const User = mongoose.model("User",userSchema)
export default User