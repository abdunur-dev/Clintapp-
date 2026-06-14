import mongoose from "mongoose";
import PaymentMethod from "../models/PaymentMethod.js";
import app from "../server.js";

let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null, seeded: false };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/clintapp";
    cached.promise = mongoose.connect(uri, { serverSelectionTimeoutMS: 30000, connectTimeoutMS: 30000 }).then(async () => {
      if (!cached.seeded) {
        const count = await PaymentMethod.countDocuments();
        if (count === 0) {
          await PaymentMethod.create({ bank: "Commercial Bank of Ethiopia", accountName: "Nbab-Bet Books", accountNumber: "1000123456789", isActive: true });
        }
        cached.seeded = true;
      }
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (e) {
    console.error("MongoDB connection failed:", e.message);
  }
  app(req, res);
}
