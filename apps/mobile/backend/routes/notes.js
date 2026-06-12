import { Router } from "express";
import Note from "../models/Note.js";

const router = Router();
const USER_ID = "anonymous";

router.get("/", async (req, res) => {
  try {
    const { tag, search } = req.query;
    const filter = { userId: USER_ID };
    if (tag && tag !== "All") filter.tag = tag;
    if (search) filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const note = await Note.create({ userId: USER_ID, ...req.body });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: USER_ID },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: USER_ID });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
