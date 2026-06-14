import "dotenv/config";
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import booksRouter from "./routes/books.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import notesRouter from "./routes/notes.js";
import bookmarksRouter from "./routes/bookmarks.js";
import receiptsRouter from "./routes/receipts.js";
import hadithsRouter from "./routes/hadiths.js";
import translateRouter from "./routes/translate.js";
import paymentsRouter from "./routes/payments.js";
import PaymentMethod from "./models/PaymentMethod.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clintapp";

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const adminDist = path.join(__dirname, "..", "admin", "dist");
if (fs.existsSync(adminDist)) {
  app.use(express.static(adminDist));
  app.get("/admin/*", (req, res) => {
    res.sendFile(path.join(adminDist, "index.html"));
  });
}

app.use("/api/books", booksRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/notes", notesRouter);
app.use("/api/bookmarks", bookmarksRouter);
app.use("/api/receipts", receiptsRouter);
app.use("/api/hadiths", hadithsRouter);
app.use("/api/translate", translateRouter);
app.use("/api/payments", paymentsRouter);

app.get("/api/db", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const data = {};
    for (const col of collections) {
      data[col.name] = await db.collection(col.name).find().toArray();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function connectAndSeed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
  const count = await PaymentMethod.countDocuments();
  if (count === 0) {
    await PaymentMethod.create({ bank: "Commercial Bank of Ethiopia", accountName: "Nbab-Bet Books", accountNumber: "1000123456789", isActive: true });
    console.log("Seeded default payment method");
  }
}

connectAndSeed().catch((err) => {
  console.error("MongoDB connection error:", err.message);
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
