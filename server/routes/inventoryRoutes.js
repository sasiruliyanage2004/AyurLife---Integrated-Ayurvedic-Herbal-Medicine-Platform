import express from 'express';
import { getInventory, getMyInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getInventory)
    .post(protect, authorize('supplier', 'producer'), addInventoryItem);

router.route('/my')
    .get(protect, authorize('supplier', 'producer'), getMyInventory);

router.route('/:id')
    .put(protect, authorize('supplier', 'producer'), updateInventoryItem)
    .delete(protect, authorize('supplier', 'producer', 'admin'), deleteInventoryItem);

export default router;
