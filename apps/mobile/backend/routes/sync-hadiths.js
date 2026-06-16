import { Router } from "express";
import Hadith from "../models/Hadith.js";

const router = Router();

const BOOK_API_MAP = {
  "Sahih al Bukhari": "eng-bukhari",
  "Sahih Muslim": "eng-muslim",
  "Sunan Abu Dawud": "eng-abudawud",
  "Sunan an Nasai": "eng-nasai",
  "Sunan Ibn Majah": "eng-ibnmajah",
  "Jami At Tirmidhi": "eng-tirmidhi",
  "Muwatta Malik": "eng-malik",
};

router.post("/", async (req, res) => {
  try {
    const { book: singleBook } = req.body;
    const booksToSync = singleBook
      ? { [singleBook]: BOOK_API_MAP[singleBook] }
      : BOOK_API_MAP;

    const results = [];

    for (const [bookName, apiSlug] of Object.entries(booksToSync)) {
      if (!apiSlug) continue;

      const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${apiSlug}.min.json`;

      const resp = await fetch(url);
      if (!resp.ok) {
        results.push({ book: bookName, error: `Fetch failed: ${resp.status}` });
        continue;
      }

      const data = await resp.json();
      const hadiths = data.hadiths || [];

      let updated = 0;
      let skipped = 0;

      for (const h of hadiths) {
        if (!h.text) { skipped++; continue; }

        const result = await Hadith.findOneAndUpdate(
          { book: bookName, hadithNumber: h.hadithnumber, english: "" },
          { $set: { english: h.text } },
          { new: false }
        );

        if (result) updated++;
      }

      results.push({ book: bookName, total: hadiths.length, updated, skipped });
    }

    res.json({ message: "Sync complete", results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/check", async (req, res) => {
  try {
    const books = BOOK_API_MAP;
    const report = {};
    for (const bookName of Object.keys(books)) {
      const total = await Hadith.countDocuments({ book: bookName });
      const withEnglish = await Hadith.countDocuments({ book: bookName, english: { $ne: "" } });
      report[bookName] = { total, withEnglish };
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
