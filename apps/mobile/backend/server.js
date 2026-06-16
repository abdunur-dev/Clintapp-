import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import booksRouter from "./routes/books.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import notesRouter from "./routes/notes.js";
import bookmarksRouter from "./routes/bookmarks.js";
import receiptsRouter from "./routes/receipts.js";
import hadithsRouter from "./routes/hadiths.js";
import translateRouter from "./routes/translate.js";
import paymentsRouter from "./routes/payments.js";
import syncHadithsRouter from "./routes/sync-hadiths.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clintapp";

mongoose.set("bufferCommands", false);

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const adminDist = path.join(__dirname, "..", "admin", "dist");
if (fs.existsSync(adminDist)) {
  app.use(express.static(adminDist));
  app.get("/admin/*", (req, res) => {
    res.sendFile(path.join(adminDist, "index.html"));
  });
}

app.get("/bulk-import", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bulk Hadith Import</title>
<style>
body{background:#0B0C1A;color:#fff;font-family:system-ui,sans-serif;padding:20px;max-width:600px;margin:0 auto}
h1{color:#C9A84C;font-size:20px}
label{display:block;margin:16px 0 6px;font-size:12px;color:#A0A0C0}
input,textarea{width:100%;padding:8px;border-radius:6px;border:1px solid #252650;background:#13142A;color:#fff;font-size:13px;box-sizing:border-box}
button{margin-top:12px;padding:10px 24px;border-radius:8px;border:none;background:#C9A84C;color:#0B0C1A;font-weight:700;cursor:pointer;font-size:13px}
button:disabled{opacity:0.5}
#log{margin-top:16px;font-size:12px;white-space:pre-wrap;font-family:monospace}
.success{color:#4A8C5C}
.error{color:#E05555}
.info{color:#A0A0C0}
.file-info{margin:8px 0;font-size:12px;color:#7878A0}
progress{width:100%;height:8px;border-radius:4px;margin-top:8px}
</style>
</head>
<body>
<h1>Bulk Hadith Import</h1>
<label>Backend API URL</label>
<input id="apiUrl" value="https://clintapp-backend.vercel.app/api" />
<label>Choose JSON file (hadith-api format)</label>
<input type="file" id="fileInput" accept=".json" />
<div class="file-info" id="fileInfo"></div>
<button id="importBtn" disabled>Import</button>
<progress id="progress" value="0" max="100"></progress>
<div id="log"></div>
<script>
const apiUrl=document.getElementById('apiUrl');
const fileInput=document.getElementById('fileInput');
const importBtn=document.getElementById('importBtn');
const progress=document.getElementById('progress');
const log=document.getElementById('log');
const fileInfo=document.getElementById('fileInfo');
function isEnglish(source){const t=source.hadiths?.[0]?.text||'';return t?!/[\\u0600-\\u06FF]/.test(t):false}
function transform(source){const name=source.metadata?.name?.trim()||'',sec=source.metadata?.sections||{},raw=source.hadiths||[],eng=isEnglish(source);return raw.map(h=>({book:name,chapter:sec[String(h.reference?.book)]||'',chapterId:h.reference?.book??null,hadithNumber:h.hadithnumber,arabic:eng?'':h.text||'',english:eng?h.text||'':h.english||'',amharic:h.amharic||'',grade:Array.isArray(h.grades)&&h.grades[0]?(h.grades[0].grade||h.grades[0].name||''):'',reference:h.reference||{}}))}
function normalize(s){return s.metadata&&Array.isArray(s.hadiths)?transform(s):Array.isArray(s)?s:[s]}
function add(m,t='info'){const d=document.createElement('div');d.className=t;d.textContent=m;log.appendChild(d)}
fileInput.addEventListener('change',()=>{const f=fileInput.files?.[0];if(f){fileInfo.textContent=f.name+' ('+(f.size/1024/1024).toFixed(1)+' MB)';importBtn.disabled=false}else{fileInfo.textContent='';importBtn.disabled=true}});
importBtn.addEventListener('click',async()=>{const file=fileInput.files?.[0];if(!file)return;importBtn.disabled=true;log.innerHTML='';progress.value=0;try{const text=await file.text(),source=JSON.parse(text),hadiths=normalize(source),total=hadiths.length,label=source.metadata?.name||file.name;add('Parsed '+total+' hadiths from "'+label+'"','info');add('Detected: '+(isEnglish(source)?'English':'Arabic')+' edition','info');const BATCH=500;let imported=0,skipped=0,url=apiUrl.value.replace(/\\/+$/,'');for(let i=0;i<total;i+=BATCH){const batch=hadiths.slice(i,i+BATCH);progress.value=Math.round(i/total*100);add('Sending batch '+(Math.floor(i/BATCH)+1)+'/'+Math.ceil(total/BATCH)+' ('+batch.length+' hadiths)...','info');const res=await fetch(url+'/hadiths/bulk?mode=upsert',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(batch)});if(!res.ok){const e=await res.text();throw new Error('HTTP '+res.status+': '+e.slice(0,200))}const data=await res.json();imported+=data.count||0;skipped+=data.skipped||0;add('  \\u2713 '+data.count+' updated'+(data.skipped?', '+data.skipped+' errors':''),'success')}progress.value=100;add('\\n\\u2705 Done! '+imported+' updated, '+skipped+' errors from "'+label+'"','success')}catch(err){add('\\n\\u274c '+err.message,'error');progress.value=0}importBtn.disabled=false});
</script>
</body>
</html>`);
});

app.get("/api/health", (req, res) => {
  const state = mongoose.connection.readyState;
  const status = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    status: "ok",
    mongodb: status[state] || state,
    hasMongoUri: !!process.env.MONGODB_URI,
    cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
  });
});

app.use("/api/books", booksRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/notes", notesRouter);
app.use("/api/bookmarks", bookmarksRouter);
app.use("/api/receipts", receiptsRouter);
app.use("/api/hadiths", hadithsRouter);
app.use("/api/translate", translateRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/sync-hadiths", syncHadithsRouter);

app.get("/api/db", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const data = {};
    for (const col of collections) {
      data[col.name] = await db.collection(col.name).find().toArray();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== "production") {
  async function connectLocal() {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 30000, connectTimeoutMS: 30000 });
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("MongoDB connection error:", err.message);
    }
  }
  connectLocal();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
