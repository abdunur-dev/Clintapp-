/**
 * Sync books from production (Vercel) to local MongoDB
 * This fetches all books from the production API and replaces the local books collection.
 */

const PRODUCTION_API = "https://clintapp-backend.vercel.app/api/books";
const LOCAL_MONGO_URI = "mongodb://localhost:27017/clintapp";

async function sync() {
  const mongoose = require("mongoose");

  // 1. Fetch books from production
  console.log("Fetching books from production API...");
  const res = await fetch(PRODUCTION_API);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  const books = await res.json();
  console.log(`Found ${books.length} books on production.`);

  // 2. Connect to local MongoDB
  console.log("Connecting to local MongoDB...");
  await mongoose.connect(LOCAL_MONGO_URI);
  const db = mongoose.connection.db;

  // 3. Clear local books and insert production books
  const booksCol = db.collection("books");
  const localCount = await booksCol.countDocuments();
  console.log(`Local database has ${localCount} books. Replacing with production data...`);

  await booksCol.deleteMany({});

  // Convert _id strings back to ObjectId
  const { ObjectId } = require("mongoose").Types;
  const docs = books.map((b) => {
    const doc = { ...b };
    if (doc._id) doc._id = new ObjectId(doc._id);
    // Convert date strings back to Date objects
    if (doc.createdAt) doc.createdAt = new Date(doc.createdAt);
    if (doc.updatedAt) doc.updatedAt = new Date(doc.updatedAt);
    return doc;
  });

  await booksCol.insertMany(docs);
  console.log(`Successfully synced ${docs.length} books to local database!`);

  // 4. List what we synced
  console.log("\nSynced books:");
  docs.forEach((b, i) => {
    console.log(`  ${i + 1}. ${b.title} (${b.category}) - ${b.pages} pages`);
  });

  await mongoose.disconnect();
  console.log("\nDone!");
}

sync().catch((err) => {
  console.error("Sync error:", err.message);
  process.exit(1);
});
