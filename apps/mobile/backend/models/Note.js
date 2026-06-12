import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "anonymous" },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    type: { type: String, enum: ["note", "quote", "highlight"], default: "note" },
    tag: { type: String, default: "General" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", default: null },
    verseRef: { type: String, default: "" },
    color: { type: String, default: "#C9A84C" },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
