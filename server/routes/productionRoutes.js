import express from 'express';
import {
    getFormulations,
    createFormulation,
    getBatches,
    createBatch,
    updateBatch,
    getMyFormulations,
    getMyBatches,
    deleteBatch,
    deleteFormulation
} from '../controllers/productionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/formulas')
    .get(protect, getFormulations)
    .post(protect, authorize('producer'), createFormulation);

router.route('/formulas/:id')
    .delete(protect, authorize('producer'), deleteFormulation);

router.get('/my-formulas', protect, authorize('producer'), getMyFormulations);

router.route('/batches')
    .get(protect, getBatches)
    .post(protect, authorize('producer'), createBatch);

router.get('/my-batches', protect, authorize('producer'), getMyBatches);

router.route('/batches/:id')
    .put(protect, authorize('producer'), updateBatch)
    .delete(protect, authorize('producer'), deleteBatch);

export default router;
