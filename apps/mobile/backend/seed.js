import "dotenv/config";
import mongoose from "mongoose";
import Book from "./models/Book.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clintapp";

const books = [
  {
    title: "Quran — Amharic",
    titleAm: "ቅዱስ ቁርአን",
    author: "Translation",
    category: "Islamic",
    pages: 604,
    chapters: 114,
    rating: 5,
    price: 299,
    color: "#4A8C5C",
    iconName: "Moon",
    description:
      "The Holy Qur'an in Amharic translation. A guide for those who are conscious of Allah, with verses that bring peace and guidance to the soul.",
    sample: "በስመ አላህ በጣም ቸር በጣም አዛኝ። ሁሉንም ምስጋና የአለማችን ጌታ ለአላህ ይገባል። በመጨረሻው ቀን ባለቤት።",
    progress: 0.34,
    isSacred: true,
    sacredType: "quran",
  },
  {
    title: "The Bible — Amharic",
    titleAm: "ቅዱስ መጽሐፍ",
    author: "Holy Scripture",
    category: "Christianity",
    pages: 1189,
    chapters: 66,
    rating: 5,
    price: 299,
    color: "#5C6A9A",
    iconName: "Church",
    description:
      "The Holy Bible in Amharic, containing the Old and New Testaments. A sacred text of faith, hope, and divine love.",
    sample: "መጀመሪያ ነገሥት ነበረ ቃሉ፥ ቃሉም ከእግዚአብሔር ጋር ነበረ፥ ቃሉም እግዚአብሔር ነበረ።",
    progress: 0.12,
    isSacred: true,
    sacredType: "bible",
  },
  {
    title: "Meditations",
    titleAm: "ሥነ አዕምሮ",
    author: "Marcus Aurelius",
    category: "Philosophy",
    pages: 254,
    chapters: 12,
    rating: 4.7,
    price: 199,
    color: "#8C6A3A",
    iconName: "Feather",
    description:
      "Personal writings of the Roman Emperor Marcus Aurelius, reflecting on Stoic philosophy and the nature of the human mind.",
    sample: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    progress: 0.65,
    isSacred: false,
    sacredType: null,
  },
  {
    title: "The Alchemist",
    titleAm: "አልኬሚስቱ",
    author: "Paulo Coelho",
    category: "Fiction",
    pages: 197,
    chapters: 0,
    rating: 4.5,
    price: 249,
    color: "#C9A84C",
    iconName: "BookOpen",
    description:
      "A mystical story about following your dreams and listening to your heart. Follow Santiago on his journey to discover his personal legend.",
    sample: "When you want something, all the universe conspires in helping you to achieve it.",
    progress: 0,
    isSacred: false,
    sacredType: null,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    await Book.deleteMany({});
    const created = await Book.insertMany(books);
    console.log(`Seeded ${created.length} books`);
    await mongoose.disconnect();
    console.log("Done");
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
