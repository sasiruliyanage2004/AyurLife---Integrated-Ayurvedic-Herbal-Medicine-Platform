import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
    const { doctorId, date, time, reason } = req.body;

    try {
        // doctorId is the DOCTOR ObjectID, not User ObjectID (usually)
        // But let's check what frontend sends. Assuming it sends Doctor Model ID.
        // Actually, schema refers to 'User' for doctor field. 
        // Let's assume frontend sends the USER ID of the doctor.

        const appointment = new Appointment({
            patient: req.user._id,
            doctor: doctorId, // Expecting User ID of the doctor
            date,
            time,
            reason,
            paymentStatus: req.body.paymentStatus || 'pending',
            paymentMethod: req.body.paymentMethod,
            amount: req.body.amount,
            transactionId: req.body.transactionId
        });

        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my appointments (Patient)
// @route   GET /api/appointments/my
// @access  Private (Patient)
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'name email')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'name email')
            .sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { bookAppointment, getMyAppointments, getDoctorAppointments };
