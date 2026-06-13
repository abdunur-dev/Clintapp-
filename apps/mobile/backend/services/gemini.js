import "dotenv/config";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

export async function translateText(text, targetLang) {
  if (!API_KEY) throw new Error("GEMINI_API_KEY not set");
  const langNames = { am: "Amharic", en: "English", ar: "Arabic" };
  const langName = langNames[targetLang] || targetLang;
  const prompt = `Translate the following Islamic text to ${langName}. Return ONLY the translation, nothing else:\n\n${text}`;

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!translated) throw new Error("Gemini returned empty response");
  return translated;
}
