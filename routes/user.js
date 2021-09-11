var express = require('express')
var router = express.Router()
const { check } = require('express-validator');
 const { getUserById, getUser,updateUser,userPurchaseList } =require("../controllers/user.js")
 const {isSignIn, isAuthenticated} =require("../controllers/auth.js")


 router.param("userId", getUserById);

 // when ever in route we use ":hjsdj" it use hjsdj( it could be any thing) as a userId and run a method getUserById 
 router.get("/user/:userId", isSignIn ,isAuthenticated ,getUser);
 router.put("/user/:userId", isSignIn ,isAuthenticated, updateUser);

 router.get("/orders/user/:userId", isSignIn ,isAuthenticated, userPurchaseList)

//  router.get("/user", getAllUser)



module.exports= router;