
import express from "express";
import BloodDonation from "../models/bloodDonationModel.js";
import Certificate from "../models/certificateModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// User submits blood donation
router.post("/submit", auth, async (req, res) => {
    try {
        const { bloodGroup, donationDate, location } = req.body;

        const donation = new BloodDonation({
            donorId: req.user.id,
            donorName: req.user.name,
            donorEmail: req.user.email,
            bloodGroup,
            donationDate,
            location
        });

        await donation.save();
        res.json({ msg: "Blood donation submitted successfully!", donation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// routes/bloodDonation.js 
router.get("/admin/all", auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Access denied" });
        }

        const donations = await BloodDonation.find().populate('donorId', 'name email');
        res.json(donations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// Admin updates donation status - WITH CERTIFICATE GENERATION
router.put("/admin/update-status/:id", auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Access denied" });
        }

        const { status } = req.body;
        const donation = await BloodDonation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        // Agar approve kiya hai toh certificate generate karo
        if (status === 'approved') {
            const certificate = new Certificate({
                donationId: donation._id,
                donorId: donation.donorId,
                donorName: donation.donorName,
                bloodGroup: donation.bloodGroup,
                donationDate: donation.donationDate
            });

            await certificate.save();
            console.log("Certificate generated:", certificate.certificateId);
        }

        res.json({
            msg: "Status updated successfully!",
            donation,
            certificate: status === 'approved' ? "Certificate generated" : undefined
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// Get certificates for a donor
router.get("/certificates/:donorId", auth, async (req, res) => {
    try {
        const certificates = await Certificate.find({ donorId: req.params.donorId });
        res.json(certificates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;