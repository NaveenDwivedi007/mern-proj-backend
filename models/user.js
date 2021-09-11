// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const user = new Schema({
//   title:  String, // String is shorthand for {type: String}
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs:  Number
//   }
// });

// import mongoose from 'mongoose'; 
// import { createHmac } from 'crypto';
// ( its a new type to declair the mongoose)
var mongoose = require("mongoose");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

 const {Schema} = mongoose;

 const userSchema = new Schema({
  name:{
    type:String,
    required:true,
    maxlength:32,
    trim:true// trim remove the extra space
  },
  lastname:{
    type:String,
    required:false,
    maxlength:32,
    trim:true
  },

  email:{
    type:String,
    trim:true,
    required:true,
    unique:true
  },
  userinfo:{
    type:String,
    trim:true
  },  
 encry_password :{
   type:String,
   required:true,
 },
 salt:String,
 role:{
   type:Number,
   default:0,
 },
 purchases:{
   type:Array,
   default:[]
 },

 },{timestamps:true});

 userSchema.virtual("password")
 .set(function(password){
   this._password = password;
   this.salt=uuidv4();
   this.encry_password= this.securePassword(password)
 })
 .get(function(){
   return this._password;
 })


 userSchema.methods = {
   // this is using function we can create method otherwise it will not work
  autheticate: function(plainpassword){
    return this.securePassword(plainpassword) === this.encry_password;
  },

   securePassword:function(plainpassword){
     if (!plainpassword) { // it should be plainpassword
       return ""
     }
     try {
       return crypto.createHmac('sha256', this.salt)
       .update(plainpassword)
       .digest('hex');
     } catch (err) {
       return ""
     }
   }


 }



module.exports = mongoose.model("User", userSchema)
// exporting model the first is what we are going to call in and the second is what are it ref to
// in my case User is what i am calling it and it ref to userSchema