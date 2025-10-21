import express from "express"
import { getCurrentUser } from "../Controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.middleware.js"

const userRouter = express.Router()

userRouter.get("/current", isAuth, getCurrentUser)


export default userRouter