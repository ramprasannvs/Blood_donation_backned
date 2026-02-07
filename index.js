

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import bloodDonationRoutes from "./routes/bloodDonation.js"; // ✅ Add this
import certificateRoutes from "./routes/certificate.js"; // ✅ Agar alag file banayi hai toh
dotenv.config();
const app = express();

// ✅ CORS Setup - Allow frontend port 3000
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
});

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blood-donation", bloodDonationRoutes); // ✅ Add this route

app.use("/api/certificates", certificateRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected ✅");
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => console.error("MongoDB Error ❌:", err));