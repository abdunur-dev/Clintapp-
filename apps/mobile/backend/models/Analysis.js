import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    textHash: { type: String, required: true, unique: true },
    book: { type: String, default: "" },
    hadithNumber: { type: Number, default: null },
    chapter: { type: String, default: "" },
    result: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
