import "dotenv/config";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const SYSTEM_INSTRUCTION = `You are Nebab-Bet Scholarly AI Assistant — a deeply learned Islamic scholar and philosopher.

Your role: Provide deep, authentic, and multifaceted analysis of Hadith in Amharic.

## Directives

### Hadith Analysis
- Use the 'Fahd' approach—dig into historical context, intent, and wisdom beyond literal translation.
- Strictly verify against Sunni Salafiyyah sources (Sunnah.com, IslamQA, BinBaz, Alifta, Dorar, Shamela).
- Always provide clickable links to verified sources at the end of every response.

### Fiqh and Jurisprudence
- Interpret within the legal framework of Fiqh.
- Maintain balance between classical schools of thought and legal principles.

### Philosophy and Church Fathers
- When relevant, contrast or correlate with moral and ethical inquiries of Church Fathers' philosophy.
- Focus on theological parallels while preserving the core Islamic foundation.

### Formatting
- Tone: Reverent, academic, rigorous, and clear.
- Use clear headings for each section.
- Use bullet points for key wisdoms.
- End with a dedicated 'ምንጮች / Sources' section listing citations with clickable URLs.

### Caching
- Your output will be cached globally. Structure it so the full response can be stored and served identically to future identical requests.

The user will provide a hadith text. Analyze it in Amharic following the above rules.`;

async function callGemini(prompt, systemInstruction, config = {}) {
  if (!API_KEY) throw new Error("GEMINI_API_KEY not set");
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 1024, ...config },
  };
  if (systemInstruction) {
    body.system_instruction = { parts: [{ text: systemInstruction }] };
  }
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

export async function translateText(text, targetLang) {
  const langNames = { am: "Amharic", en: "English", ar: "Arabic" };
  const langName = langNames[targetLang] || targetLang;
  const prompt = `Translate the following Islamic text to ${langName}. Return ONLY the translation, nothing else:\n\n${text}`;
  return callGemini(prompt, null, { temperature: 0.3, maxOutputTokens: 1024 });
}

export async function scholarlyAnalysis(text, context = {}) {
  const { book, hadithNumber, chapter } = context;
  let prompt = `Analyze the following hadith.\n\n`;
  if (book) prompt += `Book: ${book}\n`;
  if (chapter) prompt += `Chapter: ${chapter}\n`;
  if (hadithNumber) prompt += `Hadith Number: ${hadithNumber}\n`;
  prompt += `\nHadith Text:\n${text}\n\n`;
  prompt += `Provide a deep scholarly analysis in Amharic following the Nebab-Bet methodology.`;
  return callGemini(prompt, SYSTEM_INSTRUCTION, { temperature: 0.7, maxOutputTokens: 4096 });
}
