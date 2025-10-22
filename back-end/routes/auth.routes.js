import express from "express"
import { fireBaseSignUp, fireBaseSignIn, resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp, deleteUser } from "../Controllers/auth.controllers.js"
import isAuth from "../middlewares/isAuth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp)
authRoutes.post("/signin", signIn)
authRoutes.post("/signout", isAuth, signOut)
authRoutes.post("/send-otp", sendOtp)
authRoutes.post("/verify-otp", verifyOtp)
authRoutes.post("/reset-password", resetPassword)
authRoutes.post("/fire-base-signup", fireBaseSignUp)
authRoutes.post("/fire-base-signIn", fireBaseSignIn)
authRoutes.delete("/delete/:id", deleteUser)

export default authRoutes