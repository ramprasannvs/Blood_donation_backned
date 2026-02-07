import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Donor from "../models/donorModel.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await Donor.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                msg: "Email already registered",
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const donor = new Donor({
            name,
            email,
            password: hashed,
            role,
        });

        await donor.save();

        return res.status(201).json({
            success: true,
            msg: "Registration successful!",
        });
    } catch (err) {
        console.error("Register error ❌", err);
        return res.status(500).json({
            success: false,
            msg: "Server error",
        });
    }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const donor = await Donor.findOne({ email });
        if (!donor) {
            return res.status(400).json({
                success: false,
                msg: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, donor.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: "Invalid credentials",
            });
        }

        // ✅ Role check
        if (donor.role !== role) {
            return res.status(400).json({
                success: false,
                msg: `Role mismatch! You are registered as ${donor.role}`,
            });
        }

        // ✅ JWT token
        const token = jwt.sign(
            {
                id: donor._id,
                role: donor.role,
                name: donor.name,
                email: donor.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // ✅ IMPORTANT: frontend-compatible response
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: donor._id,
                name: donor.name,
                email: donor.email,
                role: donor.role,
            },
        });
    } catch (err) {
        console.error("Login error ❌", err);
        return res.status(500).json({
            success: false,
            msg: "Server error",
        });
    }
});

export default router;
