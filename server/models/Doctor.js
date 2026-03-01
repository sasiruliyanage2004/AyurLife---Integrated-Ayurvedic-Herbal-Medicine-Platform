import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        default: 'Ayurveda General'
    },
    licenseNumber: {
        type: String,
        required: true
    },
    experienceYears: Number,
    hospitalAffiliation: String,
    availability: [{
        day: String, // Mon, Tue, etc.
        startTime: String, // 09:00
        endTime: String // 17:00
    }]
}, {
    timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
