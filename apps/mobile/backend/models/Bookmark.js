import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "anonymous" },
    bookId: { type: String, required: true },
    verseNumber: { type: Number, default: 0 },
    chapterNumber: { type: Number, default: 1 },
    label: { type: String, default: "" },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, bookId: 1, verseNumber: 1, chapterNumber: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
