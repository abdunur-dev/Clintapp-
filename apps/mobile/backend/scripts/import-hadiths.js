import { readFileSync, readdirSync } from "fs";
import { join, resolve } from "path";

const API = process.env.API_URL || "http://localhost:4000/api";

function transformSourceJson(source) {
  const bookName = source.metadata?.name?.trim() || "";
  const sections = source.metadata?.sections || {};
  const raw = source.hadiths || [];

  return raw.map((h) => ({
    book: bookName,
    chapter: sections[String(h.reference?.book)] || "",
    chapterId: h.reference?.book ?? null,
    hadithNumber: h.hadithnumber,
    arabic: h.text || "",
    english: h.english || "",
    amharic: h.amharic || "",
    grade:
      Array.isArray(h.grades) && h.grades[0]
        ? h.grades[0].grade || h.grades[0].name || ""
        : "",
    reference: h.reference || {},
  }));
}

async function importFile(filePath) {
  const raw = readFileSync(filePath, "utf-8");
  const source = JSON.parse(raw);
  const hadiths = transformSourceJson(source);
  const bookName = source.metadata?.name || filePath;

  console.log(
    `\n📖 ${bookName} — ${hadiths.length} hadiths after transform`
  );

  const res = await fetch(`${API}/hadiths/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hadiths),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error);

  console.log(
    `   ✅ Imported: ${result.count}, Skipped: ${result.skipped || 0}` +
      (result.autoCreatedBooks
        ? `, Auto-created books: ${result.autoCreatedBooks}`
        : "")
  );
  return result;
}

async function main() {
  const dir = resolve(process.argv[2] || ".");
  console.log(`🔍 Scanning directory: ${dir}`);
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort();
  console.log(`📁 Found ${files.length} JSON files\n`);

  let totalImported = 0;
  let totalSkipped = 0;

  for (const file of files) {
    const filePath = join(dir, file);
    try {
      const result = await importFile(filePath);
      totalImported += result.count || 0;
      totalSkipped += result.skipped || 0;
      // Small delay between files
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }
  }

  console.log(
    `\n═══════════════════════════════════════`
  );
  console.log(
    `🏁 Done! Total imported: ${totalImported}, Total skipped: ${totalSkipped}`
  );
}

main().catch(console.error);
