import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import bloodDonationRoutes from "./routes/bloodDonation.js";
import certificateRoutes from "./routes/certificate.js";

dotenv.config();

const app = express();

/* ================= CORS ================= */
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(express.json());

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
});

/* ================= API ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/blood-donation", bloodDonationRoutes);
app.use("/api/certificates", certificateRoutes);

/* ================= MONGODB (VERCEL SAFE) ================= */
let isConnected = false;

async function connectDB() {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("MongoDB Connected ✅");
    } catch (err) {
        console.error("MongoDB Error ❌", err);
    }
}

connectDB();

/* ================= EXPORT (NO app.listen) ================= */
export default app;
