import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "db-export");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clintapp";

async function exportDB() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to local DB");

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();

  for (const col of collections) {
    const name = col.name;
    const docs = await db.collection(name).find().toArray();
    const filePath = path.join(OUT_DIR, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2));
    console.log(`  ${name}: ${docs.length} docs → ${filePath}`);
  }

  console.log(`\nDone! Data exported to ${OUT_DIR}`);
  await mongoose.disconnect();
}

exportDB().catch((err) => {
  console.error("Export failed:", err.message);
  process.exit(1);
});
