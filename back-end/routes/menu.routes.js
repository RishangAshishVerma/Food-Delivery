import express from "express"
import isAuth from "../middlewares/isAuth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { createMenu, getMenuItemById, updateMenu } from "../Controllers/menu.controllers.js"


const menuRouter = express.Router()

menuRouter.post("/create",isAuth,upload.single("image"),createMenu)
menuRouter.post("/edit/:id",isAuth,upload.single("image"),updateMenu)
menuRouter.get("/get/:id",isAuth,getMenuItemById)


export default menuRouter   