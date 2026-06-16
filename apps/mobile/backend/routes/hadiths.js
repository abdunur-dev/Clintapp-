import { Router } from "express";
import Hadith from "../models/Hadith.js";
import Book from "../models/Book.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { book, search, page = 1 } = req.query;
    let limit = req.query.limit ? Number(req.query.limit) : 100;
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
    let hadiths;
    if (limit > 0) {
      hadiths = await Hadith.find(filter)
        .sort({ hadithNumber: 1 })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      hadiths = await Hadith.find(filter).sort({ hadithNumber: 1 });
    }
    const pages = limit > 0 ? Math.ceil(total / limit) : 1;
    res.json({ hadiths, total, page: Number(page), pages });
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
    let hadiths = req.body;
    const mode = req.query.mode || "skip";
    // Support both { hadiths: [...] } and direct array
    if (hadiths && !Array.isArray(hadiths) && Array.isArray(hadiths.hadiths)) {
      hadiths = hadiths.hadiths;
    }
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

    if (mode === "upsert") {
      // Update existing records with non-empty fields, insert new ones
      let updated = 0;
      let inserted = 0;
      let errorCount = 0;
      const BATCH = 500;

      for (let i = 0; i < hadiths.length; i += BATCH) {
        const batch = hadiths.slice(i, i + BATCH);
        const upsertOps = batch.map(h => {
          const setFields = {};
          for (const key of ["arabic", "english", "amharic", "narrator", "grade", "chapter", "chapterId", "reference"]) {
            if (h[key] !== undefined && h[key] !== null && h[key] !== "") {
              setFields[key] = h[key];
            }
          }
          return {
            updateOne: {
              filter: { book: h.book, hadithNumber: h.hadithNumber },
              update: { $set: setFields },
              upsert: true,
            },
          };
        });

        const result = await Hadith.bulkWrite(upsertOps, { ordered: false });
        updated += (result.modifiedCount || 0) + (result.upsertedCount || 0);
        errorCount += (result.writeErrors || []).length;
      }

      return res.json({ count: updated, skipped: errorCount, mode: "upsert" });
    }

    // Default "skip" mode: dedup by book + hadithNumber
    const pairs = [...new Set(hadiths.map(h => `${h.book}|${h.hadithNumber}`))];
    const existing = await Hadith.find({
      $or: pairs.map(p => {
        const [book, hadithNumber] = p.split("|");
        return { book, hadithNumber: Number(hadithNumber) };
      }),
    }, { book: 1, hadithNumber: 1, _id: 0 }).lean();
    const existingSet = new Set(existing.map(e => `${e.book}|${e.hadithNumber}`));
    const newHadiths = hadiths.filter(h => !existingSet.has(`${h.book}|${h.hadithNumber}`));
    const skipped = hadiths.length - newHadiths.length;

    if (newHadiths.length === 0) {
      return res.json({ count: 0, skipped, hadiths: [], autoCreatedBooks: autoBooks.length });
    }

    // Batch insert in groups of 500
    const BATCH_SIZE = 500;
    let created = [];
    for (let i = 0; i < newHadiths.length; i += BATCH_SIZE) {
      const batch = newHadiths.slice(i, i + BATCH_SIZE);
      const inserted = await Hadith.insertMany(batch, { ordered: false });
      created.push(...inserted);
    }

    res.status(201).json({ count: created.length, skipped, hadiths: created, autoCreatedBooks: autoBooks.length });
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
