import mongoose from "mongoose";

const hadithSchema = new mongoose.Schema(
  {
    book: { type: String, required: true },
    chapter: { type: String, default: "" },
    chapterId: { type: Number, default: null },
    hadithNumber: { type: Number, required: true },
    arabic: { type: String, required: true },
    english: { type: String, default: "" },
    amharic: { type: String, default: "" },
    narrator: { type: String, default: "" },
    grade: { type: String, default: "" },
    reference: { type: Object, default: {} },
  },
  { timestamps: true }
);

hadithSchema.index({ book: 1, hadithNumber: 1 }, { unique: true });

export default mongoose.model("Hadith", hadithSchema);
