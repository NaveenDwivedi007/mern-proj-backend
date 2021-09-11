const User = require("../models/user.js");
const Order = require("../models/order.js");


exports.getUserById= (req,res,next,id)=>{
  User.findById(id).exec((err,user)=>{
    if (err || !user) {
      return res.status(400).json({
        error:"No User is Found in DB"
      })
    }

    req.profile= user
    next()

  })
};

exports.getUser = (req,res,next) =>{
  // get back here for password

  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt= undefined;
  req.profile.updatedAt= undefined;
  return res.json(req.profile)
}

exports.updateUser=(req,res)=>{
  User.findByIdAndUpdate(
    // finding user by id
    {_id:req.profile._id},
    // seting a new value
    {$set: req.body},
    // setting value saved and stop
    {new:true,useFindAndModify:false},
    (err,user)=>{
      if (err) {
        return res.status(400).json({
          error:"update in not successfull"
        })
      }
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt= undefined;
      user.updatedAt= undefined;
      res.json(user)
    }
  )

}

exports.userPurchaseList=(req,res)=>{
  Order.find({user: req.profile._id})
  // when ever we are refer something in different collection at time
  // we user populate in with we pass 2 thing (A,B) 
  // where A = model we are going to update B= field we wanted to bring in 
  .populate("user","_id name")
  .exec((err,order)=>{
      if (err) {
        return res.status(400).json({
          error:"No order in this account"
        })
      }

    return res.json(order)
  })
}


exports.pushOrderInPurchaseList=(req,res,next)=>{

  let purchases = []
  // pruducts are coming from front end
  req.body.order.products.forEach(product =>{
    purchases.push({
      _id:product._id,
      name:product.name,
      description:product.description,
      category:product.category,
      quantity:product.quantity, // i believe quantity is not define in model
      amount:req.body.orde.amount,
      transaction_id:req.body.order.transaction_id
    })
  })

  // store this in db
  User.findByIdAndUpdate(
    {_id:req.profile._id},
    // using push because we are puch data into array
    //1st purchases is one in user model and 2nd one is my local array that i define above
    {$push:{purchases:purchases}},
    {new:true},
    (err,purchase)=>{
      if (err) {
        return res.status(400).json({
          error:"unable to save purchase list"
        })
      }
      next()
    }
  )
}


//assignment which should be deleted

// exports.getAllUser = (req,res)=>{
//   return User.find().exec((err,user)=>{
//     if (err ||!user) {
//       return res.status(400).json({
//         error:"user not found"
//       })
//     }
//     res.json(user)
//   })
// }