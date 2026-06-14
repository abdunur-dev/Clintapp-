import { Router } from "express";
import { createHash } from "crypto";
import { translateText, scholarlyAnalysis } from "../services/gemini.js";
import Hadith from "../models/Hadith.js";
import Analysis from "../models/Analysis.js";

const router = Router();

router.post("/hadith/:id", async (req, res) => {
  try {
    const { targetLang } = req.body; // "en" or "am"
    if (!targetLang || !["en", "am"].includes(targetLang)) {
      return res.status(400).json({ error: "targetLang must be 'en' or 'am'" });
    }
    const hadith = await Hadith.findById(req.params.id);
    if (!hadith) return res.status(404).json({ error: "Hadith not found" });

    const field = targetLang === "en" ? "english" : "amharic";
    if (hadith[field]) return res.json({ message: "Already translated", hadith });

    const translation = await translateText(hadith.arabic, targetLang);
    hadith[field] = translation;
    await hadith.save();
    res.json({ message: "Translated", hadith });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/text", async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) return res.status(400).json({ error: "text and targetLang required" });
    const translation = await translateText(text, targetLang);
    res.json({ translation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/scholarly", async (req, res) => {
  try {
    const { text, book, hadithNumber, chapter } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });

    // Generate cache key
    const cacheKey = createHash("sha256").update(text.slice(0, 500) + "|" + (book || "") + "|" + (hadithNumber || "")).digest("hex");

    // Check cache
    const cached = await Analysis.findOne({ textHash: cacheKey }).lean();
    if (cached) {
      return res.json({ result: cached.result, cached: true });
    }

    // Call Gemini
    const result = await scholarlyAnalysis(text, { book, hadithNumber, chapter });

    // Cache the result
    await Analysis.create({ textHash: cacheKey, book: book || "", hadithNumber: hadithNumber || null, chapter: chapter || "", result });

    res.json({ result, cached: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
