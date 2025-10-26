import { STATES } from "mongoose";
import Order from "../Models/order.model.js";
import Restaurant from "../Models/Restaurant.model.js";
import restaurantorder from "../Models/restaurantOrder.model.js";
import restaurantorderitem from "../Models/restaurantorderitems.model.js";
import User from "../Models/user.model.js"
import DeliveryAssignment from "../Models/deliveryAssigmennt..model.js";


export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

        if (!cartItems || cartItems.length === 0)
            return res.status(400).json({ message: "Cart is empty" });

        if (!deliveryAddress || !deliveryAddress.text || deliveryAddress.text.trim() === "" || deliveryAddress.latitude == null || deliveryAddress.longitude == null) {
            return res.status(400).json({ message: "Send complete deliveryAddress" });
        }


        const orderItem = {};
        cartItems.forEach(item => {
            const restaurantId = item.restaurant;
            if (!orderItem[restaurantId]) orderItem[restaurantId] = [];
            orderItem[restaurantId].push(item);
        });


        const restaurantOrderIds = await Promise.all(Object.keys(orderItem).map(async (restaurantId) => {
            const restaurant = await Restaurant.findById(restaurantId).populate("owner");
            if (!restaurant) throw new Error("Restaurant not found");

            const items = orderItem[restaurantId];
            const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);

            const newRestaurantOrder = await restaurantorder.create({
                restaurant: restaurant._id,
                owner: restaurant.owner._id,
                subTotal: subtotal,
                restaurantOrderItems: items.map(i => i._id)
            });

            return newRestaurantOrder._id;
        }));


        const neworder = await Order.create({
            user: req.userId,
            paymentMethod: paymentMethod.toLowerCase(),
            deliveryAddress,
            totalAmount,
            restaurantOrders: restaurantOrderIds
        });

        await neworder.populate("restaurantorder.restaurantOrderItems", "name image price")
        await neworder.populate("restaurantorder.restaurant", "name")

        return res.status(201).json({ message: "Order placed successfully", neworder });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error while placing the order: ${error.message}` });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.role === "owner" || user.role === "deliver") {
            return res.status(403).json({ message: "Only users can access this" });
        }
        const orders = await Order.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "restaurantOrders",
                populate: [
                    { path: "restaurant", select: "name" },
                    { path: "owner", select: "name email mobile" },
                    { path: "restaurantOrderItems", select: "name image price" }
                ]
            });

        return res.status(200).json(orders)

    } catch (error) {
        return res.status(500).json({ message: `get user order error ${error}` })
    }
};

export const getOwnerOrder = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (user.role === "user" || user.role === "deliver") {
            return res.status(403).json({ message: "Only owners can access this" });
        }

        let orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "restaurantOrders",
                populate: [
                    { path: "restaurant", select: "name" },
                    { path: "owner", select: "name email mobile" },
                    { path: "restaurantOrderItems", select: "name image price" }
                ]
            });



        orders = orders.filter(order =>
            order.restaurantOrders.some(ro => ro.owner._id.toString() === req.userId)
        );

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: `Get owner orders error: ${error.message}` });
    }
};

export const updateOrderStatus = async (params) => {
    try {
        const { orderId, restaurantId } = req.params
        const { status } = req.body

        const order = await Order.findById(orderId)

        const restaurantOrder = order.restaurantOrders.find(o => o.restaurant == restaurantId)
        if (!restaurantOrder) {
            return res.status(400).json({ message: "resturant order not found" })
        }

        restaurantOrder.Status = status
        await restaurantOrder.populate("restaurantorderitem.item", "name image price")

        restaurantOrder.Status = status
        let deliveryBoysPayload = []
        if (status == "out for delivery" || !restaurantOrder.assignment) {
            const { longitude, latitude } = order.deliveryAddress
            const neardeliveryboy = await User.find({
                role: "deliveryboy",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point", coordinates: [Number(longitude),
                            Number(latitude)]
                        },
                        $maxDistance: 10000
                    }
                }
            })

            const nearByIds = neardeliveryboy.map(b => b._id)
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: { $nin: ["pending", "delivered"] }

            }).distinct("assignedTo")

            const busyIdsSet = new set(busyIds.map(id => String(id)))

            const freedeliveryboy = neardeliveryboy.filter(b => !busyIdsSet.has(String(b._id)))

            const candidates = freedeliveryboy.map(b => b._id)

            if (!candidates.length === 0) {
                await Order.save()
                return res.status(400).json({ message: " status is update susscfuly but no delivery boy is free " })
            }

            const deliveryAssigment = await DeliveryAssignment.create({
                order: order._id,
                restaurant: restaurantOrder.restaurant,
                restaurantOrderId: restaurantOrder._id,
                broadcastedTo: candidates,
                status: "broadcasted"
            })

            restaurantOrder.assignedDeliveryBoy = deliveryAssigment.assignedTo


            restaurantOrder.assignment = deliveryAssigment._id
            deliveryBoyPayload = freedeliveryboy.map(b => ({
                id: b._id,
                fullName: b.name,
                longitude: b.location.coordinates?.[0],
                latitude: b.location.coordinates?.[1],
                mobile: b.mobile
            }))

        }

        await restaurantOrder.save()
        await order.save()


        await order.populate("restaurantOrder.restaurant", "name")
        await order.populate("restaurantOrder.assignedDeliveryBoy", "name email mobile")
        const updateShopOrder = order.restaurantOrders.find(o => o.restaurant == restaurantId)

        return res.status(200).json({
            restaurantOrder: updateShopOrder,
            assignedDeliveryBoy: updateShopOrder.assignedDeliveryBoy,
            freeboy: deliveryBoysPayload,
            assignment: updateShopOrder.assignment._id
        })

    } catch (error) {
        return res.status(500).json({ message: `error while updateing the status ${error} ` })
    }
}