import mongoose from "mongoose";

const bloodDonationSchema = new mongoose.Schema(
    {
        donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
        donorName: String,
        bloodGroup: String,
        donationDate: Date,
        hospital: String,
    },
    { timestamps: true }
);

export default mongoose.model("BloodDonation", bloodDonationSchema);
