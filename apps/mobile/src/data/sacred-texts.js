export const LANGUAGES = [
  { id: 'arabic', label: 'العربية', labelEn: 'Arabic', script: 'rtl', font: 'serif' },
  { id: 'geez', label: 'ግዕዝ', labelEn: 'Ge\'ez', script: 'ltr', font: 'serif' },
  { id: 'amharic', label: 'አማርኛ', labelEn: 'Amharic', script: 'ltr', font: 'serif' },
  { id: 'hebrew', label: 'עברית', labelEn: 'Hebrew', script: 'rtl', font: 'serif' },
  { id: 'greek', label: 'Ελληνικά', labelEn: 'Greek', script: 'ltr', font: 'serif' },
  { id: 'latin', label: 'Latina', labelEn: 'Latin', script: 'ltr', font: 'serif' },
  { id: 'english', label: 'English', labelEn: 'English', script: 'ltr', font: 'sans' },
];

export function getAvailableLangs(bookId) {
  return ['english'];
}