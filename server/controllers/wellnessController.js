import { Therapy, Booking } from '../models/Wellness.js';

// --- THERAPIES ---

// @desc    Get all therapies
// @route   GET /api/wellness/therapies
// @access  Public
const getTherapies = async (req, res) => {
    try {
        const therapies = await Therapy.find({});
        res.json(therapies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new therapy service
// @route   POST /api/wellness/therapies
// @access  Private (Wellness Staff, Admin)
const createTherapy = async (req, res) => {
    const { name, description, durationMinutes, price, image, category, requiredRooms } = req.body;

    try {
        const therapy = new Therapy({
            name,
            description,
            durationMinutes,
            price,
            image,
            category,
            requiredRooms
        });

        const createdTherapy = await therapy.save();
        res.status(201).json(createdTherapy);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- BOOKINGS ---

// @desc    Book a therapy
// @route   POST /api/wellness/bookings
// @access  Private (Patient)
const bookTherapy = async (req, res) => {
    const { therapyId, date, time } = req.body;

    try {
        const booking = new Booking({
            patient: req.user._id,
            therapy: therapyId,
            date,
            time
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get bookings for staff
// @route   GET /api/wellness/bookings
// @access  Private (Wellness Staff)
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('patient', 'name email')
            .populate('therapy')
            .sort({ date: 1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update booking status
// @route   PUT /api/wellness/bookings/:id
// @access  Private (Wellness Staff)
const updateBookingStatus = async (req, res) => {
    const { status, therapistId } = req.body;

    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            booking.status = status || booking.status;
            if (therapistId) booking.therapist = therapistId;

            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get bookings for logged in patient
// @route   GET /api/wellness/my-bookings
// @access  Private (Patient)
const getMyWellnessBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ patient: req.user._id })
            .populate('therapy')
            .sort({ date: 1 });

        // Always return 200, empty array if none found
        res.status(200).json(bookings || []);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update therapy service
// @route   PUT /api/wellness/therapies/:id
// @access  Private (Wellness Staff, Admin)
const updateTherapy = async (req, res) => {
    const { name, description, durationMinutes, price, image, category, requiredRooms } = req.body;

    try {
        const therapy = await Therapy.findById(req.params.id);

        if (therapy) {
            therapy.name = name || therapy.name;
            therapy.description = description || therapy.description;
            therapy.durationMinutes = durationMinutes || therapy.durationMinutes;
            therapy.price = price || therapy.price;
            therapy.image = image !== undefined ? image : therapy.image;
            therapy.category = category || therapy.category;
            therapy.requiredRooms = requiredRooms || therapy.requiredRooms;

            const updatedTherapy = await therapy.save();
            res.json(updatedTherapy);
        } else {
            res.status(404).json({ message: 'Therapy not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete therapy service
// @route   DELETE /api/wellness/therapies/:id
// @access  Private (Wellness Staff, Admin)
const deleteTherapy = async (req, res) => {
    try {
        const therapy = await Therapy.findById(req.params.id);

        if (therapy) {
            await therapy.deleteOne();
            res.json({ message: 'Therapy removed' });
        } else {
            res.status(404).json({ message: 'Therapy not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getTherapies, createTherapy, bookTherapy, getBookings, updateBookingStatus, getMyWellnessBookings, updateTherapy, deleteTherapy };
