import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["donor", "admin"], default: "donor" },
    },
    { timestamps: true }
);

const Donor = mongoose.model("Donor", donorSchema);

export default Donor;
