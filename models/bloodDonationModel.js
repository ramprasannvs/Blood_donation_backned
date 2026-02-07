
import mongoose from "mongoose";

const bloodDonationSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    donationDate: { type: Date, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminViewed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const BloodDonation = mongoose.model('BloodDonation', bloodDonationSchema);
export default BloodDonation; 