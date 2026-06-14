import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    bank: { type: String, default: "" },
    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    qrCodeUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentMethod", paymentMethodSchema);
