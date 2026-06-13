import "dotenv/config";
import mongoose from "mongoose";
import Book from "./models/Book.js";
import Hadith from "./models/Hadith.js";

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
    description: "The Holy Qur'an in Amharic translation. A guide for those who are conscious of Allah, with verses that bring peace and guidance to the soul.",
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
    description: "The Holy Bible in Amharic, containing the Old and New Testaments.",
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
    description: "Personal writings of the Roman Emperor Marcus Aurelius.",
    sample: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    progress: 0.65,
    isSacred: false,
    sacredType: null,
  },
  {
    title: "Sahih al-Bukhari",
    titleAm: "ሳሂህ አል-ቡኻሪ",
    author: "Imam al-Bukhari",
    category: "Hadith",
    pages: 7563,
    chapters: 97,
    rating: 5,
    price: 199,
    color: "#2A5C3A",
    iconName: "BookOpen",
    description: "Sahih al-Bukhari is the most authentic hadith collection. Compiled by Imam Muhammad al-Bukhari, it contains 7,563 hadiths covering all aspects of faith, worship, and daily life.",
    sample: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    progress: 0,
    isSacred: true,
    sacredType: "hadith",
    bookSlug: "Sahih al-Bukhari",
  },
  {
    title: "Sahih Muslim",
    titleAm: "ሳሂህ ሙስሊም",
    author: "Imam Muslim",
    category: "Hadith",
    pages: 3033,
    chapters: 54,
    rating: 5,
    price: 199,
    color: "#2A4A5C",
    iconName: "BookOpen",
    description: "Sahih Muslim is the second most authentic hadith collection. Compiled by Imam Muslim ibn al-Hajjaj, it contains 3,033 hadiths organized by topic.",
    sample: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً",
    progress: 0,
    isSacred: true,
    sacredType: "hadith",
    bookSlug: "Sahih Muslim",
  },
  {
    title: "Riyad as-Salihin",
    titleAm: "ሪያድ አስ-ሳሊሂን",
    author: "Imam an-Nawawi",
    category: "Hadith",
    pages: 1896,
    chapters: 372,
    rating: 5,
    price: 149,
    color: "#5C3A2A",
    iconName: "BookOpen",
    description: "Riyad as-Salihin (Gardens of the Righteous) is a collection of authentic hadiths compiled by Imam Yahya ibn Sharaf an-Nawawi, covering manners, ethics, and spiritual development.",
    sample: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ",
    progress: 0,
    isSacred: true,
    sacredType: "hadith",
    bookSlug: "Riyad as-Salihin",
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
    description: "A mystical story about following your dreams.",
    sample: "When you want something, all the universe conspires in helping you to achieve it.",
    progress: 0,
    isSacred: false,
    sacredType: null,
  },
];

const hadiths = [
  {
    book: "Sahih al-Bukhari",
    chapter: "Revelation",
    hadithNumber: 1,
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    english: "Actions are judged by intentions.",
    amharic: "ሥራዎች በኒያ (ዓላማ) ይመዘናሉ።",
    narrator: "Umar ibn Al-Khattab",
    grade: "Sahih",
  },
  {
    book: "Sahih al-Bukhari",
    chapter: "Revelation",
    hadithNumber: 2,
    arabic: "بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ",
    english: "Islam is built upon five pillars.",
    amharic: "እስልምና በአምስት ምሰሶች ላይ የተመሠረተ ነው።",
    narrator: "Ibn Umar",
    grade: "Sahih",
  },
  {
    book: "Sahih Muslim",
    chapter: "Faith",
    hadithNumber: 1,
    arabic: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً",
    english: "Faith has seventy-some branches.",
    amharic: "እምነት ከሰባ በላይ የተናፈሱ ቅርንጫፎች አሉት።",
    narrator: "Abu Huraira",
    grade: "Sahih",
  },
  {
    book: "Riyad as-Salihin",
    chapter: "Sincerity",
    hadithNumber: 1,
    arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ",
    english: "Fear Allah wherever you are.",
    amharic: "በየትኛውም ስፍራ ብትሆን አላህን ፍራ።",
    narrator: "Abu Dharr",
    grade: "Sahih",
  },
  {
    book: "Sahih al-Bukhari",
    chapter: "Knowledge",
    hadithNumber: 25,
    arabic: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ",
    english: "Whomsoever Allah wills good for, He gives him understanding of the religion.",
    amharic: "አላህ መልካምን የሻለው ሰው በሃይማኖት ውስጥ እውቀትን ይሰጠዋል።",
    narrator: "Muawiyah",
    grade: "Sahih",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Book.deleteMany({});
    const createdBooks = await Book.insertMany(books);
    console.log(`Seeded ${createdBooks.length} books`);

    await Hadith.deleteMany({});
    const createdHadiths = await Hadith.insertMany(hadiths);
    console.log(`Seeded ${createdHadiths.length} hadiths`);

    await mongoose.disconnect();
    console.log("Done");
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
