// route and controller hav same name.
var express = require('express')
var router = express.Router()
const { check } = require('express-validator');
const { signOut, signUp, signIn ,isSignIn } = require("../controllers/auth")




router.post("/signup",
// this array is to validate the data to be pass on the db 
[
  check("name").isLength({min:3}).withMessage("name should be more than 3 letter"),

  check("email").isEmail().withMessage("Enter the valid email Id"),
  
  check("password").isLength({min:3})
  .withMessage("Password should be at least 3 char")
],
  signUp)

  router.post("/signin",
  // this array is to validate the data to be pass on the db 
  [ 
    check("email").isEmail().withMessage("Enter the valid email Id"),
    
    check("password").isLength({min:3})
    .withMessage("Password field is required")
  ],
    signIn)

router.get("/signout", signOut);

// router.get("/test",isSignIn, (req,res)=>{
//   res.json(req.auth)
// });

module.exports = router;