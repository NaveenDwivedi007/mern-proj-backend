const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
  product:{
    type:ObjectId,
    ref:"Product"
  },
  name:String,
  count:Number,
  price:Number,
  // add diff feature here such as coupon,time of delivery etc
});
const ProductCart = mongoose.model("ProductCart", productCartSchema)

const orderSchema = new mongoose.Schema({
  products:[productCartSchema],
  transaction_id:{

  },
  amount:{
    type:Number,
  },
  address:String,
  // ENUMS ref for status enum resited the choice 
  status:{
    type:String,
    default:"Recieved",
    enum:["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
  },
  updated:Date,
  user:{
    type:ObjectId,
    ref:"User"
  },
},{timestamps:true});

const Order = mongoose.model("Order", orderSchema)
module.exports = {Order,ProductCart}
