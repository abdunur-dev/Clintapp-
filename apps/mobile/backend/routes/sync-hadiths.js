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
      const apiHadiths = data.hadiths || [];

      const bulkOps = [];

      for (const h of apiHadiths) {
        if (!h.text) continue;
        bulkOps.push({
          updateOne: {
            filter: { book: bookName, hadithNumber: h.hadithnumber, english: "" },
            update: { $set: { english: h.text } },
          },
        });

        if (bulkOps.length >= 500) {
          await Hadith.bulkWrite(bulkOps, { ordered: false });
          bulkOps.length = 0;
        }
      }

      if (bulkOps.length > 0) {
        await Hadith.bulkWrite(bulkOps, { ordered: false });
      }

      results.push({ book: bookName, total: apiHadiths.length });
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
