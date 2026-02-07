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

// ================= ADMIN: GET ALL DONATIONS =================
router.get("/", auth, async (req, res) => {
    try {
        // sirf admin allow
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied" });
        }

        const donations = await BloodDonation.find().sort({ createdAt: -1 });

        res.json(donations);
    } catch (err) {
        console.error("Get donations error ❌", err);
        res.status(500).json({ msg: "Server error" });
    }

});

// ================= ADMIN: APPROVE =================
router.put("/:id/approve", auth, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied" });
        }

        const donation = await BloodDonation.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );

        res.json(donation);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// ================= ADMIN: REJECT =================
router.put("/:id/reject", auth, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied" });
        }

        const donation = await BloodDonation.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true }
        );

        res.json(donation);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});


export default router;
