import express from "express"
import { getOwnerOrder, getUserOrders, placeOrder, updateOrderStatus } from "../Controllers/order.controller.js"
import isAuth from "../middlewares/isAuth.middleware.js"
const orderRouter=express.Router()

orderRouter.post("/place-order",isAuth,placeOrder)
orderRouter.get("/user-order",isAuth,getUserOrders)
orderRouter.get("/owner-order",isAuth,getOwnerOrder)
orderRouter.post("/update-status/:orderId/:restaurantId",isAuth,updateOrderStatus)

export default orderRouter


// {
//   "cartItems": [
//     {
//       "_id": "YOUR_ITEM_ID_1",
//       "name": "Paneer Butter Masala",
//       "price": 250,
//       "quantity": 1,
//       "restaurant": "YOUR_RESTAURANT_ID"
//     },
//     {
//       "_id": "YOUR_ITEM_ID_2",
//       "name": "Garlic Naan",
//       "price": 50,
//       "quantity": 2,
//       "restaurant": "YOUR_RESTAURANT_ID"
//     }
//   ],
//   "paymentMethod": "COD",
//   "deliveryAddress": {
//     "text": "123 Main Street, Indore",
//     "latiude": 22.7196,
//     "longitude": 75.8577
//   },
//   "totalAmount": 350
// }