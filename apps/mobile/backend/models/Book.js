import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleAm: { type: String, required: true },
    author: { type: String, required: true },
    category: {
      type: String,
      enum: ["Islamic", "Christianity", "Philosophy", "Fiction"],
      required: true,
    },
    pages: { type: Number, required: true },
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
    sacredType: { type: String, enum: ["quran", "bible", null], default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
