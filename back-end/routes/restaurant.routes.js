import express from "express"
import isAuth from "../middlewares/isAuth.middleware.js"
import { createrestaurant, deleterestaurant, editrestaurant, getmyrestaurant } from "../Controllers/restaurant.controllers.js"
import { upload } from "../middlewares/multer.middleware.js"


const restaurantRouter = express.Router()

restaurantRouter.post("/create",isAuth,upload.single("image"),createrestaurant)
restaurantRouter.post("/edit",isAuth,upload.single("image"),editrestaurant)
restaurantRouter.get("/get",isAuth,getmyrestaurant)
restaurantRouter.delete("/delete/:id",isAuth,deleterestaurant)


export default restaurantRouter