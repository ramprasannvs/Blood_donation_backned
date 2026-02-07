import express from "express";
import BloodDonation from "../models/bloodDonation.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/blood-donation
 * Save blood donation
 */
router.post("/", auth, async (req, res) => {
    try {
        const donation = new BloodDonation({
            donorId: req.user.id,
            donorName: req.user.name,
            ...req.body,
        });

        await donation.save();

        return res.status(201).json({
            success: true,
            msg: "Donation saved",
        });
    } catch (err) {
        console.error("Blood donation error ❌", err);
        return res.status(500).json({
            success: false,
            msg: "Server error",
        });
    }
});

export default router;
