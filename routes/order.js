const express = require("express");
const router = express.Router();
const Order = require("../models/order.js")

const {getOrderById,getAllOrder, createOrder,updateStatus,getOrderStatus} = require("../controllers/order.js")
const {updateStock} = require("../controllers/product.js")
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user.js")
const {isSignIn,isAdmin,isAuthenticated} = require("../controllers/auth.js")

//param
router.param("userId",getUserById)
router.param("orderId",getOrderById)

// create
router.post("/order/create/:userId",
isSignIn,
isAuthenticated,
pushOrderInPurchaseList,
updateStock,
createOrder)

// read router
router.get("/order/all/:userId",isSignIn,isAuthenticated,isAdmin,getAllOrder)

// status of order
router.get("/order/status/:userId",isSignIn,isAuthenticated,isAdmin,getOrderStatus)
// update order
router.put("/order/:orderId/status/:userId",isSignIn,isAuthenticated,isAdmin,updateStatus)
module.exports= router;
