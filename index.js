import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import bloodDonationRoutes from "./routes/bloodDonation.js";
import certificateRoutes from "./routes/certificate.js";

dotenv.config();

const app = express();

/* ✅ CORS (Vercel + Frontend ke liye) */
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());

/* ✅ Root route (test ke liye) */
app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
});

app.use("/api/blood-donation", bloodDonationRoutes);

/* ✅ API Routes */
app.use("/api/auth", authRoutes);
app.use("/api/blood-donation", bloodDonationRoutes);
app.use("/api/certificates", certificateRoutes);

/* ✅ MongoDB connect (NO listen) */
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected ✅");
    })
    .catch((err) => {
        console.error("MongoDB Error ❌:", err);
    });

/* ✅ Vercel ke liye export */
export default app;
