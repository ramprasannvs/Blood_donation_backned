import mongoose from "mongoose";

const bloodDonationSchema = new mongoose.Schema(
    {
        donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
        donorName: String,
        bloodGroup: String,
        donationDate: Date,
        hospital: String,
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("BloodDonation", bloodDonationSchema);
