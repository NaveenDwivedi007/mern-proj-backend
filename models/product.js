const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    require:true,
    maxlength:32,
  },
  description:{
    type:String,
    trim:true,
    require:true,
    maxlength:2000,
  },
  price:{
    type:Number,
    require:true,
    maxlength:32,
    trim:true,
  },
  category:{
    type:ObjectId,
    ref:"Category", // this is to ref the Schema i wanted to use in this schema 
    require:true
  },
  stock:{
    type:Number,
  },
  sold:{
    type:Number,
    default:0
  },
  photo:{
    data:Buffer,
    contentType:String,
  }
  // add size feature into the project after complition
},{timestamps:true})


module.exports = mongoose.model("Product", productSchema)