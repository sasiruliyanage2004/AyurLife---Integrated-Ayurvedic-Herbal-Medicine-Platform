import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrders,
    getSupplierOrders,
    updateOrderStatus
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getOrders)
    .post(protect, createOrder);

router.get('/my', protect, getMyOrders);
router.get('/supplier', protect, authorize('supplier', 'producer'), getSupplierOrders);

router.put('/:id/status', protect, authorize('admin', 'supplier', 'producer'), updateOrderStatus);

export default router;
