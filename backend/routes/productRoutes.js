import express from 'express';
import {
    createProduct,
    getAllProducts,
    getProductBySlug,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { sellerOnly } from '../middlewares/roleMiddleware.js';
const router = express.Router();
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.post('/', protect, sellerOnly, createProduct);
router.put('/:id', protect, sellerOnly, updateProduct);
router.delete('/:id', protect, sellerOnly, deleteProduct);
export default router;
