// backend/routes/certificate.js - NAYI FILE BANAO
import express from "express";
import Certificate from "../models/certificateModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get certificates for a donor
router.get("/:donorId", auth, async (req, res) => {
    try {
        const certificates = await Certificate.find({ donorId: req.params.donorId });
        res.json(certificates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// Get single certificate by ID
router.get("/single/:certificateId", auth, async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
        if (!certificate) {
            return res.status(404).json({ msg: "Certificate not found" });
        }
        res.json(certificate);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;