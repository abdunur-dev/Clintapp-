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
<title>Universal Book Import</title>
<style>
body{background:#0B0C1A;color:#fff;font-family:system-ui,sans-serif;padding:20px;max-width:700px;margin:0 auto}
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
#preview{margin-top:20px;display:none}
#preview h3{color:#C9A84C;font-size:14px;margin:0 0 8px}
.preview-item{padding:8px 0;border-bottom:1px solid #1E1F3A;font-size:12px;line-height:1.5}
.preview-num{color:#C9A84C;font-weight:700;margin-right:6px}
.preview-text{color:#D0D0E0}
</style>
</head>
<body>
<h1>Universal Book Import</h1>
<label>Backend API URL</label>
<input id="apiUrl" value="https://clintapp-backend.vercel.app/api" />
<label>Category</label>
<select id="categorySelect" style="width:100%;padding:8px;border-radius:6px;border:1px solid #252650;background:#13142A;color:#fff;font-size:13px;box-sizing:border-box">
<option value="">Auto-detect</option>
<option value="Islamic">Islamic</option>
<option value="Hadith">Hadith</option>
<option value="Christianity">Christianity</option>
<option value="Fiction">Fiction</option>
<option value="Philosophy">Philosophy</option>
<option value="Scrolls">Scrolls</option>
<option value="General">General</option>
</select>
<label>Choose JSON file (any format)</label>
<input type="file" id="fileInput" accept=".json" />
<div class="file-info" id="fileInfo"></div>
<button id="importBtn" disabled>Import</button>
<progress id="progress" value="0" max="100"></progress>
<div id="log"></div>
<div id="preview"><h3>Preview</h3><div id="previewContent"></div></div>
<script>
const apiUrl=document.getElementById('apiUrl'),categorySelect=document.getElementById('categorySelect'),fileInput=document.getElementById('fileInput'),importBtn=document.getElementById('importBtn'),progress=document.getElementById('progress'),log=document.getElementById('log'),fileInfo=document.getElementById('fileInfo'),preview=document.getElementById('preview'),previewContent=document.getElementById('previewContent');
function hasArabic(t){return/[\\u0600-\\u06FF]/.test(t)}
function normalizeAny(s){if(s.metadata&&Array.isArray(s.hadiths))return transformH(s);return extractAll(s)}
function transformH(s){const n=s.metadata?.name?.trim()||'',sec=s.metadata?.sections||{},raw=s.hadiths||[],eng=!hasArabic(raw[0]?.text||'');return raw.map(h=>({book:n,chapter:sec[String(h.reference?.book)]||'',chapterId:h.reference?.book??null,hadithNumber:h.hadithnumber,arabic:eng?'':h.text||'',english:eng?h.text||'':h.english||'',amharic:h.amharic||'',grade:Array.isArray(h.grades)&&h.grades[0]?(h.grades[0].grade||h.grades[0].name||''):'',narrator:'',reference:h.reference||{}}))}
function extractAll(s){const b=s.book||s.title||s.name||s.id||'Book',items=[];function add(num,text,ch){const n=Number(num)||(items.length+1);items.push({book:b,chapter:ch||'',hadithNumber:n,arabic:'',english:String(text),amharic:'',grade:'',narrator:'',reference:{}})}
function pt(v){if(typeof v==='string')return v;if(typeof v==='number'||typeof v==='boolean')return String(v);if(!v||typeof v!=='object')return'';return v.text||v.content||v.english||v.arabic||v.verseText||''}
function pn(v,f){return Number(v?.verse??v?.number??v?.id??v?.chapter??f)||f}
function pc(v){return v?.chapter||v?.section||''}
if(Array.isArray(s)){for(let i=0;i<s.length;i++){const v=s[i];add(pn(v,i+1),pt(v)||JSON.stringify(v),pc(v))}return items}
if(s.chapters&&Array.isArray(s.chapters)){let idx=0;for(const ch of s.chapters){const cn=ch.chapter||ch.number||ch.id||ch.title||String(idx+1);const verses=ch.verses||ch.content||ch.paragraphs||ch.items||ch.lines||ch.texts||[];const arr=Array.isArray(verses)?verses:(typeof verses==='string'?[verses]:[]);let vi=0;for(const v of arr){vi++;add(pn(v,vi),pt(v)||JSON.stringify(v),cn)}idx++}return items}
if(s.sections&&Array.isArray(s.sections)){for(const sec of s.sections){const sn=sec.section||sec.number||sec.id||sec.title||String(items.length+1);const t=sec.text||sec.content||'';if(t&&typeof t==='string')add(1,t,sn);const sub=sec.items||sec.verses||[];if(Array.isArray(sub)){for(const v of sub)add(pn(v,items.length+1),pt(v)||JSON.stringify(v),sn)}}return items}
if(s.pages&&Array.isArray(s.pages)){for(const p of s.pages){const pn2=p.page||p.number||p.id||String(items.length+1);const t=p.text||p.content||'';if(t&&typeof t==='string')add(pn2,t)}return items}
const body=s.content||s.text||s.body;if(body){if(typeof body==='string'){add(1,body);return items}if(typeof body==='object')return extractAll(body)}
const numKeys=Object.keys(s).filter(k=>/^\\d+$/.test(k)).map(Number).sort((a,b)=>a-b);if(numKeys.length>0){for(const k of numKeys)add(k,typeof s[k]==='string'?s[k]:JSON.stringify(s[k]));return items}
const fb=['description','summary','introduction','data','verses','lines','entries'];for(const key of fb){if(Array.isArray(s[key])){for(let i=0;i<s[key].length;i++){const v=s[key][i];add(pn(v,i+1),pt(v)||JSON.stringify(v),pc(v))}return items}if(s[key]&&typeof s[key]==='string'){add(1,s[key]);return items}}
add(1,JSON.stringify(s));return items}
function showPreview(items,total){const show=Math.min(5,items.length);previewContent.innerHTML=items.slice(0,show).map(i=>'<div class=\"preview-item\"><span class=\"preview-num\">#'+i.hadithNumber+'</span><span class=\"preview-text\">'+esc(i.english.slice(0,200))+'</span></div>').join('');if(total>show)previewContent.innerHTML+='<div class=\"preview-item\" style=\"color:#7878A0\">... and '+(total-show)+' more items</div>';preview.style.display='block'}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
function add(m,t){const d=document.createElement('div');d.className=t||'info';d.textContent=m;log.appendChild(d)}
function label(s){return s.metadata?.name||s.book||s.title||s.name||'Book'}
fileInput.addEventListener('change',()=>{const f=fileInput.files?.[0];if(f){fileInfo.textContent=f.name+' ('+(f.size/1024/1024).toFixed(1)+' MB)';importBtn.disabled=false}else{fileInfo.textContent='';importBtn.disabled=true}preview.style.display='none'});
importBtn.addEventListener('click',async()=>{const file=fileInput.files?.[0];if(!file)return;importBtn.disabled=true;log.innerHTML='';progress.value=0;preview.style.display='none';try{const text=await file.text(),source=JSON.parse(text),hadiths=normalizeAny(source),total=hadiths.length,bookLabel=label(source);add('Parsed '+total+' items from "'+bookLabel+'"','info');const BATCH=500;let imported=0,skipped=0,url=apiUrl.value.replace(/\\/+$/,''),cat=categorySelect.value,params=cat?'?mode=upsert&category='+encodeURIComponent(cat):'?mode=upsert';for(let i=0;i<total;i+=BATCH){const batch=hadiths.slice(i,i+BATCH);progress.value=Math.round(i/total*100);add('Sending batch '+(Math.floor(i/BATCH)+1)+'/'+Math.ceil(total/BATCH)+' ('+batch.length+' items)...','info');const res=await fetch(url+'/hadiths/bulk'+params,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(batch)});if(!res.ok){const e=await res.text();throw new Error('HTTP '+res.status+': '+e.slice(0,200))}const data=await res.json();imported+=data.count||0;skipped+=data.skipped||0;add('  \\u2713 '+data.count+' imported'+(data.skipped?', '+data.skipped+' skipped':''),'success')}progress.value=100;add('\\n\\u2705 Done! '+imported+' imported, '+skipped+' skipped from "'+bookLabel+'"','success');showPreview(hadiths,total)}catch(err){add('\\n\\u274c '+err.message,'error');progress.value=0}importBtn.disabled=false});
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
