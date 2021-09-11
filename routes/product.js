const express = require("express");
const router =express.Router();
const { getUserById ,} = require("../controllers/user.js")
const {isSignIn,isAuthenticated,isAdmin} = require("../controllers/auth.js")
const { 
  getProductById,
  createProduct,
  getProduct,
  getAllUniqueCategoy,
   photo,
   deleteProduct,
   updateProduct,
   getAllProduct } = require("../controllers/product.js");
const { check } = require('express-validator');


router.param("userId",getUserById);
router.param("productId",getProductById)

// // route
// // todo: add check and validation for ref check auth router and controllers
router.post("/product/create/:userId",isSignIn,isAuthenticated,isAdmin ,createProduct)

// read route
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)

// delete route
router.delete("/product/:productId/:userId",isSignIn,isAuthenticated,isAdmin,deleteProduct)

// update route
router.put("/product/:productId/:userId",isSignIn,isAuthenticated,isAdmin,updateProduct)

// listing route
router.get("/products", getAllProduct)

router.get("/product/categories", getAllUniqueCategoy)

module.exports= router;