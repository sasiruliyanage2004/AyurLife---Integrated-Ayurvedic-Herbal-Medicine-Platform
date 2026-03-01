import express from 'express';
import { bookAppointment, getMyAppointments, getDoctorAppointments } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorize('patient'), bookAppointment);

router.route('/my')
    .get(protect, authorize('patient'), getMyAppointments);

router.route('/doctor')
    .get(protect, authorize('doctor'), getDoctorAppointments);

export default router;
