import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
    try {
        // Find users with role 'doctor' and get their doctor profile details
        // Only return verified doctors for patient booking
        const doctors = await Doctor.find({ isVerified: true }).populate('user', 'name email');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create/Update doctor profile
// @route   POST /api/doctors
// @access  Private (Doctor)
const updateDoctorProfile = async (req, res) => {
    const { specialization, licenseNumber, experienceYears, hospitalAffiliation, availability } = req.body;

    try {
        let doctor = await Doctor.findOne({ user: req.user._id });

        if (doctor) {
            doctor.specialization = specialization || doctor.specialization;
            doctor.licenseNumber = licenseNumber || doctor.licenseNumber;
            doctor.experienceYears = experienceYears || doctor.experienceYears;
            doctor.hospitalAffiliation = hospitalAffiliation || doctor.hospitalAffiliation;
            doctor.availability = availability || doctor.availability;

            const updatedDoctor = await doctor.save();
            res.json(updatedDoctor);
        } else {
            doctor = new Doctor({
                user: req.user._id,
                specialization,
                licenseNumber,
                experienceYears,
                hospitalAffiliation,
                availability
            });
            const createdDoctor = await doctor.save();
            res.status(201).json(createdDoctor);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getDoctors, updateDoctorProfile };
