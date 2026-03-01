import express from 'express';
import { getPatientProfile, updatePatientProfile, addSymptomLog, deleteSymptomLog } from '../controllers/patientController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected and strictly for 'patient' role
router.route('/me')
    .get(protect, authorize('patient'), getPatientProfile);

router.route('/')
    .post(protect, authorize('patient'), updatePatientProfile);

router.route('/symptoms')
    .post(protect, authorize('patient'), addSymptomLog);

router.route('/symptoms/:index')
    .delete(protect, authorize('patient'), deleteSymptomLog);

export default router;
