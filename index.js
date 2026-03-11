import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import bloodDonationRoutes from "./routes/bloodDonation.js";
import certificateRoutes from "./routes/certificate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* ================= CORS ================= */
// app.use(
//     cors({
//         origin: ["http://localhost:3000", "http://localhost:3001"],
//         credentials: true,
//     })
// );

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
app.use(express.json());

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.join(__dirname, "upload")));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
});

/* ================= API ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/blood-donation", bloodDonationRoutes);
app.use("/api/certificates", certificateRoutes);

/* ================= MONGODB ================= */
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

/* ================= START SERVER ================= */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} `);
});

export default app;
