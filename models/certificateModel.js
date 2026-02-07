import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
    {
        certificateId: {
            type: String,
            unique: true,
        },
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donor",
        },
        donorName: String,
        bloodGroup: String,
        donationDate: Date,
        issuedDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
