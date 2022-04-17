require('dotenv').config()

// imports
const cookieParser = require('cookie-parser');
const express = require("express");
const mongoose = require('mongoose');
const bodyParser= require("body-parser");
const cors= require("cors");


const app = express();


// routes import here
const authRoutes = require("./routes/auth.js");
const userRoutes = require ("./routes/user.js")
const categoryRoutes = require ("./routes/category.js")
const productRouter = require("./routes/product.js")
const orderRouter = require("./routes/order.js")

// mongoose.connect('mongodb://localhost:27017/test', 
// {useNewUrlParser: true, useUnifiedTopology: true});

// db connection 
mongoose.connect(process.env.DATABASE,{
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex:true
}).then(
  ()=>{
    console.log("DB CONNECTED");
  }
)
.catch((err)=>{
  console.log(err);
});

// this is middle ware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//ROUTES
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRouter)
app.use("/api", orderRouter)


//PORT
const port = process.env.PORT || 8000; // CHECK ENV file for ref 

// Starting the server 
app.listen(port, ()=>{
  console.log(`app is running at ${port}`)
});