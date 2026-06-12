import { Router } from "express";
import CartItem from "../models/CartItem.js";

const router = Router();
const USER_ID = "anonymous";

router.get("/", async (req, res) => {
  try {
    const items = await CartItem.find({ userId: USER_ID });
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    res.json({ items, count, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { bookId, title, titleAm, author, price, coverColor, iconName, category } = req.body;
    const existing = await CartItem.findOne({ userId: USER_ID, bookId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }
    const item = await CartItem.create({
      userId: USER_ID, bookId, title, titleAm, author, price, coverColor, iconName, category,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:bookId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findOne({ userId: USER_ID, bookId: req.params.bookId });
    if (!item) return res.status(404).json({ error: "Item not found" });
    if (quantity <= 0) {
      await item.deleteOne();
      return res.json({ message: "Item removed" });
    }
    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:bookId", async (req, res) => {
  try {
    await CartItem.findOneAndDelete({ userId: USER_ID, bookId: req.params.bookId });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: USER_ID });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
