import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "anonymous" },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "pending" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
