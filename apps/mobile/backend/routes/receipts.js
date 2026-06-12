import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Receipt from "../models/Receipt.js";
import Order from "../models/Order.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|bmp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only image files (jpg, png, gif, webp) are allowed"));
  },
});

const router = Router();
const USER_ID = "anonymous";

router.post("/upload", upload.single("receipt"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: "orderId is required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const imagePath = "/uploads/" + req.file.filename;
    const receipt = await Receipt.create({
      orderId,
      userId: USER_ID,
      imagePath,
    });

    order.status = "confirmed";
    await order.save();

    res.status(201).json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 }).populate("orderId");
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const receipt = await Receipt.findOne({ orderId: req.params.orderId });
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/review", async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Status must be approved or rejected" });
    }
    const receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      { status, notes, reviewedBy: "admin", reviewedAt: new Date() },
      { new: true }
    );
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });

    if (status === "approved") {
      await Order.findByIdAndUpdate(receipt.orderId, { status: "confirmed" });
    } else {
      await Order.findByIdAndUpdate(receipt.orderId, { status: "pending" });
    }

    res.json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
