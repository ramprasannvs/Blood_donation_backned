

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Donor from "../models/donorModel.js";

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await Donor.findOne({ email });
        if (existing) return res.status(400).json({ msg: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);

        const donor = new Donor({ name, email, password: hashed, role });
        await donor.save();

        res.json({ msg: "Registration successful!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// Login Route - UPDATED
router.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const donor = await Donor.findOne({ email });
        if (!donor) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, donor.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // ✅ Role check
        if (donor.role !== role) {
            return res.status(400).json({ msg: `Role mismatch! You are registered as ${donor.role}` });
        }

        // JWT token mein email bhi include karo
        const token = jwt.sign(
            {
                id: donor._id,
                role: donor.role,
                name: donor.name,
                email: donor.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: { id: donor._id, name: donor.name, email: donor.email, role: donor.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;