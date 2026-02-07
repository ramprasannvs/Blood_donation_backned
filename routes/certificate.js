import express from "express";
import Certificate from "../models/certificateModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET certificates of logged-in user
router.get("/", auth, async (req, res) => {
    try {
        const certs = await Certificate.find({
            donorId: req.user.id,
        }).sort({ createdAt: -1 });

        res.json(certs);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;
