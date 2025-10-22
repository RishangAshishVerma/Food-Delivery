import express from "express"
import isAuth from "../middlewares/isAuth.middleware.js"
import { createmenu, updatemenu } from "../Controllers/menu.controllers.js"
import { upload } from "../middlewares/multer.middleware.js"


const menuRouter = express.Router()

menuRouter.post("/create",isAuth,upload.single("image"),createmenu)
menuRouter.post("/edit/:id",isAuth,upload.single("image"),updatemenu)


export default menuRouter