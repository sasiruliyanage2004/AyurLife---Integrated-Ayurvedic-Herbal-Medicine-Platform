import express from 'express';
import { getDoctors, updateDoctorProfile } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getDoctors)
    .post(protect, authorize('doctor'), updateDoctorProfile);

export default router;
