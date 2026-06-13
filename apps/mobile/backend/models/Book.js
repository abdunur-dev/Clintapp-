import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    titleAm: { type: String, default: "" },
    author: { type: String, default: "" },
    category: { type: String, default: "General" },
    pages: { type: Number, default: 0 },
    chapters: { type: Number, default: 0 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    price: { type: Number, default: 299 },
    color: { type: String, default: "#4A8C5C" },
    iconName: { type: String, default: "BookOpen" },
    description: { type: String, default: "" },
    sample: { type: String, default: "" },
    progress: { type: Number, default: 0, min: 0, max: 1 },
    coverUrl: { type: String, default: "" },
    isSacred: { type: Boolean, default: false },
    sacredType: { type: String, default: null },
    bookSlug: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
