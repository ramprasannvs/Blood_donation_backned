import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import bloodDonationRoutes from "./routes/bloodDonation.js";
import certificateRoutes from "./routes/certificate.js";

dotenv.config();

const app = express();

/* =====================
   MIDDLEWARE
===================== */

// ✅ CORS (Vercel friendly)
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// ✅ JSON parser
app.use(express.json());

/* =====================
   ROUTES
===================== */

app.use("/api/auth", authRoutes);
app.use("/api/blood-donation", bloodDonationRoutes);
app.use("/api/certificates", certificateRoutes);

// ✅ Health check (browser test ke liye)
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

/* =====================
   DATABASE + SERVER
===================== */

const PORT = process.env.PORT || 8080;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected ✅");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB Error ❌:", err);
    });
