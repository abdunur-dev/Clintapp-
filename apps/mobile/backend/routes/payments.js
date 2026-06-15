import { Router } from "express";
import multer from "multer";
import path from "path";
import PaymentMethod from "../models/PaymentMethod.js";
import { createUploader } from "../config/cloudinary.js";

const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

const upload = hasCloudinary
  ? createUploader("qr-codes")
  : multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext || mime) return cb(null, true);
        cb(new Error("Only image files (jpg, png, gif, webp) are allowed"));
      },
    });

const router = Router();

router.get("/", async (req, res) => {
  try {
    const methods = await PaymentMethod.find().sort({ isActive: -1, bank: 1 });
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/active", async (req, res) => {
  try {
    const methods = await PaymentMethod.find({ isActive: true });
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const method = await PaymentMethod.create(req.body);
    res.status(201).json(method);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/upload-qr", upload.single("qr"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    if (hasCloudinary) {
      res.json({ qrCodeUrl: req.file.path });
    } else {
      res.json({ qrCodeUrl: "/uploads/" + Date.now() + "-" + req.file.originalname, note: "Cloudinary not configured" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const method = await PaymentMethod.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!method) return res.status(404).json({ error: "Payment method not found" });
    res.json(method);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const method = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (!method) return res.status(404).json({ error: "Payment method not found" });
    res.json({ message: "Payment method deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
