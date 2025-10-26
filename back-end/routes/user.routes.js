import express from "express"
import { getCurrentUser, updateUserLocation } from "../Controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.middleware.js"

const userRouter = express.Router()

userRouter.get("/current", isAuth, getCurrentUser)
userRouter.post("/update-location", isAuth, updateUserLocation)


export default userRouter