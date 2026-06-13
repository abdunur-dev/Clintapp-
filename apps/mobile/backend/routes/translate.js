import { Router } from "express";
import { translateText } from "../services/gemini.js";
import Hadith from "../models/Hadith.js";

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

export default router;
