const Product = require("../models/product.js")
const formidable = require('formidable');
const _ = require('lodash');
const fs = require("fs")

exports.getProductById = (req,res,next,id)=>{
  Product.findById(id)
  .populate("category") // what happen need to study
  .exec((err,product)=>{
   if (err) {
     return res.status(400).json({
       error:"Product Not Found"
     })
   }
   req.product=product;
   next()
 })
}

exports.createProduct= (req,res) =>{
let form = new formidable.IncomingForm();
form.keepExtension = true;

form.parse(req,(err,fields,file)=>{
  if (err) {
    return res.status(400).json({
      Error:"problem with image"
    })
  }

// destructure the fields
const {name,description,price,category,stock } = fields;

if (!name || !description || !price || !category || !stock) {
  return res.status(400).json({
    error:"Please include all field"
  })
}
  let product = new Product(fields)

  // handle file here
  if (file.photo) {
    if (file.photo.size > 3000000) {
      return res.status(400).json({
        error:"file size is too big"
      })
    }

    product.photo.data = fs.readFileSync(file.photo.path);
    product.photo.contentType = file.photo.type;


  }

  // save to db
  product.save((error,product)=>{
    if (error) {
      return res.status(400).json({
        error: `${error}saving tshirt in db failed`
      });
    }
    res.json(product);
  });
});
};

exports.getProduct =(req,res)=>{
  req.product.photo = undefined;
  return res.json(req.product);
}

exports.photo=(req,res,next)=>{
  if (req.product.photo.data) {
   res.set("content-type", req.product.photo.contentType)
   return res.send(req.product.photo.data)
  }
  next()
}
exports.deleteProduct=(req,res)=>{
 let product = req.product;
 product.remove((err,deletedproduct)=>{
   if (err) {
     return res.status(400).json({
       error:"Deleting failed"
     })
   }
   res.json(`${deletedproduct.name} deleted`)
 })
}

exports.updateProduct =(req,res)=>{
  let form = new formidable.IncomingForm();
  form.keepExtension = true;

  form.parse(req,(err,fields,file)=>{
  if (err) {
    return res.status(400).json({
      Error:"problem with image"
    })
  }

// updation code
  let product = req.product
  // extent method take 2 value 1st in which we wanna change in 2nd the update field
  product = _.extend(product,fields)

  // handle file here
  if (file.photo) {
    if (file.photo.size > 3000000) {
      return res.status(400).json({
        error:"file size is too big"
      })
    }

    product.photo.data = fs.readFileSync(file.photo.path);
    product.photo.contentType = file.photo.type;


  }

  // save to db
  product.save((err,product)=>{
    if (err) {
      return res.status(400).json({
        error:"Updation of product failed"
      });
    }
    res.json(product);
  });
});
}

exports.getAllProduct=(req,res)=>{
  let limit = req.query.limit ? parseInt(req.query.limit) : 8
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
  Product.find()
  //select method let us select what we wanted to see in this case
  // - photo mean dont select photo 
  .select("-photo") 
  // sorting the product eg [["createAt" , "asc"]]
  .populate("category")
  .sort([[sortBy,"asc"]])
  .limit(limit)
  .exec((err,products)=>{
    if (err) {
      return res.status(400).json({
        error:"No product Found"
      })
    }
    res.json(products)
  })
};

exports.getAllUniqueCategoy=(req,res)=>{
  Product.distinct("category",{},(err,category)=>{
    if (err) {
      return res.status(400).json({
        error:"No category found"
      })
    }
    res.json(category)
  })
}

exports.updateStock=(req,res,next)=>{

  let myOperation = req.body.order.products.map(prod=>{
    return {
      updateOne:{
        // filter to find in db
        filter: {_id:prod._id},
        // to update in db
        update:{$inc: {stock:-prod.count,sold:+prod.count} }
      }
    }
  })

  Product.bulkWrite(myOperation,{},(err,products)=>{
    if (err) {
      return res.status(400).json({
        error:"BulkWrite operation failed"
      })
    }
    next()
  })


  
}