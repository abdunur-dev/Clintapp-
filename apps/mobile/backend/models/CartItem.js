import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "anonymous" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    title: { type: String, required: true },
    titleAm: { type: String, default: "" },
    author: { type: String, default: "" },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    coverColor: { type: String, default: "" },
    iconName: { type: String, default: "BookOpen" },
    category: { type: String, default: "" },
  },
  { timestamps: true }
);

cartItemSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default mongoose.model("CartItem", cartItemSchema);
