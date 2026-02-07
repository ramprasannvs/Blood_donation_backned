import express from "express";
import BloodDonation from "../models/bloodDonation.js";
import auth from "../middleware/auth.js";
import Certificate from "../models/certificateModel.js";
import { v4 as uuidv4 } from "uuid";


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

        const donation = await BloodDonation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ msg: "Donation not found" });
        }

        if (donation.status === "approved") {
            return res.status(400).json({ msg: "Already approved" });
        }

        donation.status = "approved";
        await donation.save();

        // CREATE CERTIFICATE
        const certificate = new Certificate({
            certificateId: "CERT-" + uuidv4().slice(0, 8).toUpperCase(),
            donorId: donation.donorId,
            donorName: donation.donorName,
            bloodGroup: donation.bloodGroup,
            donationDate: donation.donationDate,
        });

        await certificate.save();
        console.log("✅ Certificate created:", certificate.certificateId);

        res.json({
            success: true,
            msg: "Donation approved & certificate generated",
            certificate: certificate
        });
    } catch (err) {
        console.error("Approve error ❌", err);
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
