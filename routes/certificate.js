import express from "express";
import PDFDocument from "pdfkit";
import Certificate from "../models/certificateModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ================= DOWNLOAD CERTIFICATE PDF ================= */
router.get("/download/:id", auth, async (req, res) => {
    try {
        const cert = await Certificate.findById(req.params.id);
        if (!cert) {
            return res.status(404).json({ msg: "Certificate not found" });
        }

        // PDF headers
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Certificate-${cert.certificateId}.pdf`
        );

        const doc = new PDFDocument({ size: "A4", margin: 50 });
        doc.pipe(res);

        /* ======= DESIGN ======= */
        doc
            .fontSize(26)
            .fillColor("#8B0000")
            .text("BLOOD DONATION", { align: "center" });

        doc
            .fontSize(22)
            .fillColor("#8B0000")
            .text("CERTIFICATE", { align: "center" });

        doc.moveDown(2);

        doc
            .fontSize(14)
            .fillColor("#000")
            .text("This certificate is awarded to", { align: "center" });

        doc.moveDown(1);

        doc
            .fontSize(28)
            .fillColor("#8B0000")
            .text(cert.donorName, { align: "center" });

        doc.moveDown(1.5);

        doc
            .fontSize(14)
            .fillColor("#000")
            .text(
                "for their selfless act of donating blood, which has helped save lives and bring hope to those in need.",
                { align: "center" }
            );

        doc.moveDown(2);

        doc
            .fontSize(14)
            .text(
                `Blood Group: ${cert.bloodGroup}`,
                { align: "center" }
            );

        doc.moveDown(1);

        doc
            .fontSize(14)
            .text(
                `Donation Date: ${new Date(cert.donationDate).toDateString()}`,
                { align: "center" }
            );

        doc.moveDown(2);

        doc
            .fontSize(13)
            .text(
                `Issued on: ${new Date(cert.issuedDate).toDateString()}`,
                { align: "center" }
            );

        doc.moveDown(3);

        doc
            .fontSize(12)
            .text("Director, Blood Services", { align: "center" });

        doc.text("CareDrop Foundation", { align: "center" });

        doc.end();
    } catch (err) {
        console.error("PDF error ❌", err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;
