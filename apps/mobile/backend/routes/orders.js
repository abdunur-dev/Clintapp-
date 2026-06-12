import { Router } from "express";
import Order from "../models/Order.js";
import CartItem from "../models/CartItem.js";

const router = Router();
const USER_ID = "anonymous";

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ userId: USER_ID }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: USER_ID });
    if (cartItems.length === 0) return res.status(400).json({ error: "Cart is empty" });
    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const order = await Order.create({
      userId: USER_ID,
      items: cartItems.map((i) => ({
        bookId: i.bookId,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
      total,
    });
    await CartItem.deleteMany({ userId: USER_ID });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
