import { Router } from "express";
import Hadith from "../models/Hadith.js";
import Book from "../models/Book.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { book, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (book) filter.book = book;
    if (search) {
      filter.$or = [
        { arabic: { $regex: search, $options: "i" } },
        { english: { $regex: search, $options: "i" } },
        { amharic: { $regex: search, $options: "i" } },
        { chapter: { $regex: search, $options: "i" } },
        { narrator: { $regex: search, $options: "i" } },
      ];
    }
    const total = await Hadith.countDocuments(filter);
    const hadiths = await Hadith.find(filter)
      .sort({ hadithNumber: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ hadiths, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/books", async (req, res) => {
  try {
    const books = await Hadith.distinct("book");
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hadith = await Hadith.findById(req.params.id);
    if (!hadith) return res.status(404).json({ error: "Hadith not found" });
    res.json(hadith);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const hadith = await Hadith.create(req.body);
    res.status(201).json(hadith);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { hadiths } = req.body;
    if (!Array.isArray(hadiths) || hadiths.length === 0) {
      return res.status(400).json({ error: "hadiths must be a non-empty array" });
    }

    // Auto-create Book if it doesn't exist
    const bookNames = [...new Set(hadiths.map(h => h.book).filter(Boolean))];
    const existingBooks = await Book.find({ bookSlug: { $in: bookNames } }).lean();
    const existingSlugs = new Set(existingBooks.map(b => b.bookSlug));
    const autoBooks = bookNames
      .filter(name => !existingSlugs.has(name))
      .map(name => ({
        title: name,
        category: "Hadith",
        isSacred: true,
        sacredType: "hadith",
        bookSlug: name,
        color: "#2A5C3A",
        iconName: "BookOpen",
        price: 0,
        rating: 5,
        chapters: 0,
        pages: hadiths.filter(h => h.book === name).length,
      }));
    if (autoBooks.length > 0) {
      await Book.insertMany(autoBooks);
    }

    const created = await Hadith.insertMany(hadiths);
    res.status(201).json({ count: created.length, hadiths: created, autoCreatedBooks: autoBooks.length });
  } catch (err) {
    if (err.name === "ValidationError") {
      const fields = Object.keys(err.errors).join(", ");
      res.status(400).json({ error: `Validation failed: ${fields}` });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

router.put("/:id", async (req, res) => {
  try {
    const hadith = await Hadith.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hadith) return res.status(404).json({ error: "Hadith not found" });
    res.json(hadith);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const hadith = await Hadith.findByIdAndDelete(req.params.id);
    if (!hadith) return res.status(404).json({ error: "Hadith not found" });
    res.json({ message: "Hadith deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
