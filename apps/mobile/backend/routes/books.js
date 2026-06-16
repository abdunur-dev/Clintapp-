import { Router } from "express";
import multer from "multer";
import path from "path";
import Book from "../models/Book.js";
import Hadith from "../models/Hadith.js";
import { createUploader } from "../config/cloudinary.js";

const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

const upload = hasCloudinary
  ? createUploader("covers")
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
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/sacred", async (req, res) => {
  try {
    const books = await Book.find({ isSacred: true });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { books } = req.body;
    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ error: "books must be a non-empty array" });
    }
    const created = await Book.insertMany(books);
    res.status(201).json({ count: created.length, books: created });
  } catch (err) {
    if (err.name === "ValidationError") {
      const fields = Object.keys(err.errors).join(", ");
      res.status(400).json({ error: `Validation failed: ${fields}` });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/upload-cover", (req, res, next) => {
  upload.single("cover")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message, type: "multer_error" });
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    if (hasCloudinary) {
      res.json({ coverUrl: req.file.path });
    } else {
      res.json({ coverUrl: "/uploads/" + Date.now() + "-" + req.file.originalname, note: "Cloudinary not configured" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    // Cascade delete: remove associated hadiths
    if (book.bookSlug) {
      await Hadith.deleteMany({ book: book.bookSlug });
    }
    res.json({ message: "Book deleted", hadithsRemoved: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
