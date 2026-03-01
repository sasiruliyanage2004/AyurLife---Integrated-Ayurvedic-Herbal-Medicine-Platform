import mongoose from 'mongoose';

const therapySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    durationMinutes: Number,
    price: Number,
    image: { type: String, default: '' },
    category: { type: String, default: 'General' },
    requiredRooms: [{ type: String }] // e.g., ["Steam Room", "Massage Table"]
}, { timestamps: true });

export const Therapy = mongoose.model('Therapy', therapySchema);

const bookingSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    therapy: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapy', required: true },
    date: Date,
    time: String,
    therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Staff member
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
