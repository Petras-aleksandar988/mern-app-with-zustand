import mongoose from "mongoose";

const productSchema = mongoose.Schema({
   name:{
   type: String,
   requied: true
    },
    price:{
        type: Number,
        requied:true
    },
    image :{
        type: String,
        requied: true
    }
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)
export default Product