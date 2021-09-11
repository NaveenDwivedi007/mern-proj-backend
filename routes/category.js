const express = require("express");
const router = express.Router()

const {getCategoryById,createCategory,getCategory,getAllCategory, updateCategory,removeCategory} = require("../controllers/category.js")
const {isAdmin,isAuthenticated,isSignIn} = require("../controllers/auth.js")
const {getUserById} = require("../controllers/user.js")

// param
router.param("userId", getUserById);
router.param("categoryId", getCategoryById)
// router goes here

//create route
router.post(
  "/category/create/:userId",
  isSignIn,
  isAuthenticated,
  isAdmin,
  createCategory
  )
//read route
router.get("/category/:categoryId" , getCategory)
// router.get("/category/:categoryId" , getAllCategory)
router.get("/categories" , getAllCategory)

// update route
router.put("/category/:categoryId/:userId",
isSignIn,
isAuthenticated,
isAdmin,
updateCategory
);
router.delete("/category/:categoryId/:userId",
isSignIn,
isAuthenticated,
isAdmin,
removeCategory,
);


module.exports = router;