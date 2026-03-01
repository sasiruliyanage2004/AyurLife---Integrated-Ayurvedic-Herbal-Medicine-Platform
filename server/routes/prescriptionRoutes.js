import express from 'express';
import { createPrescription, getPrescriptionById, getMyPrescriptions } from '../controllers/prescriptionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorize('doctor'), createPrescription);

router.route('/my')
    .get(protect, authorize('patient'), getMyPrescriptions);

router.route('/:id')
    .get(protect, getPrescriptionById);

export default router;
