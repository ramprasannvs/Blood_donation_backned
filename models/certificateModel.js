import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodDonation', required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
    donorName: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    donationDate: { type: Date, required: true },
    certificateId: { type: String, unique: true },
    issuedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'revoked'], default: 'active' }
}, { timestamps: true });


certificateSchema.pre('save', function (next) {
    if (!this.certificateId) {
        this.certificateId = 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;