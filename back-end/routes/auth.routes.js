import express from "express"
import { resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../Controllers/auth.controllers.js"
import isAuth from "../middlewares/isAuth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup",signUp)
authRoutes.post("/signin",signIn)
authRoutes.post("/signout",isAuth,signOut)
authRoutes.post("/send-otp",sendOtp)
authRoutes.post("/verify-otp",verifyOtp)
authRoutes.post("/reset-password",resetPassword)

export default authRoutes