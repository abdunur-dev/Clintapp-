import { Router } from "express";
import Bookmark from "../models/Bookmark.js";

const router = Router();
const USER_ID = "anonymous";

router.get("/:bookId", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: USER_ID, bookId: req.params.bookId });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { bookId, verseNumber, chapterNumber, label } = req.body;
    const existing = await Bookmark.findOne({ userId: USER_ID, bookId, verseNumber, chapterNumber });
    if (existing) {
      await existing.deleteOne();
      return res.json({ message: "Bookmark removed" });
    }
    const bookmark = await Bookmark.create({ userId: USER_ID, bookId, verseNumber, chapterNumber, label });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ _id: req.params.id, userId: USER_ID });
    res.json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
