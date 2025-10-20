import express from "express"
import { signIn, signOut, signUp } from "../Controllers/auth.controllers.js"

const authRoutes = express.Router();

authRoutes.post("/signup",signUp)
authRoutes.post("/signin",signIn)
authRoutes.post("/signout",signOut)

export default authRoutes