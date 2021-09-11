// route and controller have same name.
const User = require("../models/user.js")
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');




exports.signUp= (req,res)=>{

  const errors = validationResult(req)

  if (!errors.isEmpty()) { 
    return res.status(422).json({
      error: errors.array()[0].msg,
      param : errors.array()[0].param,
    })
  }


  const user = new User(req.body)
  user.save((err,user)=>{
    if (err) {
      return res.status(400).json({
        err:"Not able to save user in db"
      })
    };
    res.json({
      name:user.name,
      email:user.email,
      id:user._id,
    });
  })
  };


exports.signOut = (req,res) => {
  // all .cookie method are coming from cookie-parser middle ware
  res.clearCookie("token");
  res.json({
    message:"User signout successfully"
  })
};

exports.signIn = (req ,res) =>{
  // it is what we are going to recieve from user
  const {email,password } = req.body; // its called de-structuring of data
  
  const errors = validationResult(req); // its not mension in code so i am commenting it

  if (!errors.isEmpty) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param : errors.array()[0].param,
    })
  }

  User.findOne({email},(err,user)=>{
    if (err || !user) {
      return res.status(400).json({
        error:"User Email doesn't exist"
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error:"Email and Password do not match"
      })
    }
    // create token
    const token = jwt.sign({_id:user._id}, process.env.SECRET)
    // put token in cookie
    res.cookie("token",token,{expire:new Date()+9999});

    // send response to the front end
    const {_id,name,email,role} =user
     return res.json({
      token,user:{_id,name,email,role}
    });


  })

};

// protected route

exports.isSignIn = expressJwt({
  secret: process.env.SECRET,
  // algorithms is required is should be the same as algo as we use to generate token 
  algorithms: ['HS256'],
  userProperty:"auth"
});



// custom middlewares
exports.isAuthenticated=(req,res,next)=>{

  // profile will be set on the front end
  // == for value and === for completed object
  let checker= req.profile && req.auth && req.profile._id == req.auth._id
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    })
  }
  next()
}

exports.isAdmin=(req,res,next)=>{
  if (req.profile.role===0) {
    return res.status(403).json({
      error:"You are not admin"
    })
  }

  next()
}