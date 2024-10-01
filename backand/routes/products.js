import express from 'express';
import {
  getProducts,
  // getUser,
  // loginUser,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
const router = express.Router();

// Get all products
router.get('/', getProducts);


// // Create new product
router.post('/', createProduct);

// // Update product
router.put('/:id', updateProduct);

// // Delete product
router.delete('/:id', deleteProduct);

export default router;
