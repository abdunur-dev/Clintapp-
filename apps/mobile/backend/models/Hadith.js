import mongoose from "mongoose";

const hadithSchema = new mongoose.Schema(
  {
    book: { type: String, required: true },
    chapter: { type: String, default: "" },
    hadithNumber: { type: Number, required: true },
    arabic: { type: String, required: true },
    english: { type: String, default: "" },
    amharic: { type: String, default: "" },
    narrator: { type: String, default: "" },
    grade: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Hadith", hadithSchema);
