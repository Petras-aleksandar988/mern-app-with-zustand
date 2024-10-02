import mongoose from "mongoose";
import Product from "../models/productModel.js";


// @desc   Get all products
// @route  GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const products = await Product.find({})

    // Send users in the response
    res.status(200).json({success: true,  data: products});
  } catch (error) {
    next(error); 
  }
};



// @desc    Create new product
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  const product = req.body;
  if(!product.name ||  !product.price || !product.image){
    return res.status(400).json({ success: false,  message: "Please provide all fields!"})
  }
  const newProduct = new Product(product)
  try {
   await newProduct.save()
  res.status(201).json({ success: true,  data: newProduct})
  
  } catch (error) {
   console.error("error in Create product : ", error.message)
   res.status(500).json({ success: false,  message: "server error"})
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  const id = req.params.id;
  console.log("id: " ,id);
  
  const product = req.body;
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({success: false, message: "product does not exist!"})
  }
  try {
  
   const updatedProduct = await Product.findByIdAndUpdate(id, product, {new: true})
   res.status(200).json({ success: true, data: updatedProduct });
   } catch (error) {
    res.status(500).json({success: false,  message: "Server error" });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  const{ id }= req.params
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({success: false, message: "product does not exist!"})
  }
  try {
   await Product.findByIdAndDelete(id);
   res.status(200).json({success: true, message: "product deleted" });

  } catch (error) {
    res.status(500).json({ success: false,  message: "server error"})
  }
};
