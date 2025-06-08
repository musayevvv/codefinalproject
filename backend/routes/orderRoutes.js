import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.put('/:id/status', protect, updateOrderStatus);
export default router;
