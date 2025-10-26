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
        enum: ["user", "owner", "deliveryboy "],
        require: true,

    },

    resetotp: {
        type: String
    },

    isoptverified: {
        type: Boolean,
        default: false
    },

    otpexpires: {
        type: Date
    },

    isdeleted: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: [Point],
            default: Point
        },
        coordinates: {
            type: [Number],
            default: [0, 0], //fri fro logintute , longitute
        }
    }
}, { timestamps: true })


userSchema.index({location:'2dsphere'})


const User = mongoose.model("User", userSchema)
export default User