import dns from "dns";
dns.setServers(["8.8.8.8"]);

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "db-export");

const ATLAS_URI = "mongodb+srv://abdurhamannur894_db_user:Abdu%40127082@cluster.h6ciz8x.mongodb.net/clintapp?appName=Cluster&serverSelectionTimeoutMS=60000&socketTimeoutMS=300000";

const CONCURRENCY = 4;

async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);
    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}

async function importToAtlas() {
  await mongoose.connect(ATLAS_URI);
  console.log("Connected to Atlas\n");

  const db = mongoose.connection.db;
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const name = file.replace(".json", "");
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
    const docs = JSON.parse(raw);
    if (docs.length === 0) continue;

    const col = db.collection(name);
    await col.deleteMany({});

    const bulk = docs.map((d) => {
      if (d._id && typeof d._id === "string") d._id = new mongoose.Types.ObjectId(d._id);
      return d;
    });

    const CHUNK = 5000;
    const chunks = [];
    for (let i = 0; i < bulk.length; i += CHUNK) chunks.push(bulk.slice(i, i + CHUNK));

    let inserted = 0;
    await asyncPool(CONCURRENCY, chunks, async (chunk) => {
      await col.insertMany(chunk, { ordered: false });
      inserted += chunk.length;
      process.stdout.write(`  ${name}: ${inserted}/${bulk.length}\r`);
    });

    console.log(`\n  ${name}: ${docs.length} docs imported\n`);
  }

  console.log("All data imported to Atlas!");
  await mongoose.disconnect();
}

importToAtlas().catch((err) => {
  console.error("Import failed:", err.message);
  process.exit(1);
});
