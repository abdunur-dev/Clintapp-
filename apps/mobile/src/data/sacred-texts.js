export const LANGUAGES = [
  { id: 'arabic', label: 'العربية', labelEn: 'Arabic', script: 'rtl', font: 'serif' },
  { id: 'geez', label: 'ግዕዝ', labelEn: 'Ge\'ez', script: 'ltr', font: 'serif' },
  { id: 'amharic', label: 'አማርኛ', labelEn: 'Amharic', script: 'ltr', font: 'serif' },
  { id: 'hebrew', label: 'עברית', labelEn: 'Hebrew', script: 'rtl', font: 'serif' },
  { id: 'greek', label: 'Ελληνικά', labelEn: 'Greek', script: 'ltr', font: 'serif' },
  { id: 'latin', label: 'Latina', labelEn: 'Latin', script: 'ltr', font: 'serif' },
  { id: 'english', label: 'English', labelEn: 'English', script: 'ltr', font: 'sans' },
];

export const BOOKS_DATA_SACRED = {
  quran: {
    id: 'quran',
    title: 'القرآن الكريم',
    titleAm: 'ቅዱስ ቁርአን',
    titleEn: 'The Holy Quran',
    chapters: [
      {
        number: 1,
        title: 'الفاتحة',
        titleEn: 'The Opening',
        verses: [
          { number: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', geez: 'በስመ አላህ በጣም ቸር በጣም አዛኝ', amharic: 'በአላህ ስም እጅግ በጣም ሩህሩህ በጣም አዛኝ በሆነው', english: 'In the name of Allah, the Most Gracious, the Most Merciful' },
          { number: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', geez: 'ምስጋና ለአላህ ለዓለማት ጌታ ይገባዋል', amharic: 'ምስጋና ለአላህ ለዓለማት ጌታ ይገባዋል', english: 'All praise is due to Allah, Lord of the worlds' },
          { number: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', geez: 'በጣም ቸር በጣም አዛኝ', amharic: 'እጅግ በጣም ሩህሩህ በጣም አዛኝ', english: 'The Most Gracious, the Most Merciful' },
          { number: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', geez: 'የፍርድ ቀን ባለቤት', amharic: 'የፍርድ ቀን ባለቤት', english: 'Master of the Day of Judgment' },
          { number: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', geez: 'አንተን እንገዛለን አንተንም እንለምናለን', amharic: 'አንተን ብቻ እንገዛለን አንተንም ብቻ እንለምናለን', english: 'You alone we worship, and You alone we ask for help' },
        ],
      },
      {
        number: 112,
        title: 'الإخلاص',
        titleEn: 'Sincerity',
        verses: [
          { number: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', geez: 'በለው እርሱ አላህ አንድ ነው', amharic: 'በለው እርሱ አላህ አንድ ነው', english: 'Say, He is Allah, the One' },
          { number: 2, arabic: 'اللَّهُ الصَّمَدُ', geez: 'አላህ ረቂቅ ነው', amharic: 'አላህ ረቂቅ ነው', english: 'Allah, the Eternal Refuge' },
          { number: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', geez: 'አልወለደም አልተወለደም', amharic: 'አልወለደም አልተወለደም', english: 'He neither begets nor is born' },
          { number: 4, arabic: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', geez: 'ለእርሱም አንድም ብጤ የለውም', amharic: 'ለእርሱም አንድም ብጤ የለውም', english: 'Nor is there to Him any equivalent' },
        ],
      },
    ],
  },
  bible: {
    id: 'bible',
    title: 'መጽሐፍ ቅዱስ',
    titleEn: 'The Holy Bible',
    titleAm: 'ቅዱስ መጽሐፍ',
    chapters: [
      {
        number: 1,
        title: 'John 1',
        titleEn: 'John 1',
        verses: [
          { number: 1, geez: 'በመጀመሪያ ቃል ነበረ፥ ቃሉም በእግዚአብሔር ዘንድ ነበረ፥ ቃሉም እግዚአብሔር ነበረ።', amharic: 'በመጀመሪያ ቃል ነበረ፥ ቃሉም ከእግዚአብሔር ጋር ነበረ፥ ቃሉም እግዚአብሔር ነበረ።', english: 'In the beginning was the Word, and the Word was with God, and the Word was God.', greek: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.', latin: 'In principio erat Verbum, et Verbum erat apud Deum, et Deus erat Verbum.' },
          { number: 2, geez: 'እርሱ በመጀመሪያ በእግዚአብሔር ዘንድ ነበረ።', amharic: 'እርሱ በመጀመሪያ ከእግዚአብሔር ጋር ነበረ።', english: 'He was with God in the beginning.', greek: 'οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν θεόν.', latin: 'Hoc erat in principio apud Deum.' },
          { number: 3, geez: 'ሁሉ በእርሱ ተፈጠረ፥ ከተፈጠረውም አንዳች እንኳ ያለ እርሱ አልተፈጠረም።', amharic: 'ሁሉ በእርሱ ተፈጠረ፤ ከተፈጠረውም አንዳች እንኳ ያለ እርሱ አልተፈጠረም።', english: 'Through him all things were made; without him nothing was made that has been made.', greek: 'πάντα δι᾽ αὐτοῦ ἐγένετο, καὶ χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἕν ὃ γέγονεν.', latin: 'Omnia per ipsum facta sunt, et sine ipso factum est nihil, quod factum est.' },
          { number: 4, geez: 'በእርሱ ሕይወት ነበረች፥ ሕይወትም የሰዎች ብርሃን ነበረች።', amharic: 'በእርሱ ሕይወት ነበረች፤ ሕይወትም የሰዎች ብርሃን ነበረች።', english: 'In him was life, and that life was the light of all mankind.', greek: 'ἐν αὐτῷ ζωὴ ἦν, καὶ ἡ ζωὴ ἦν τὸ φῶς τῶν ἀνθρώπων.', latin: 'In ipso vita erat, et vita erat lux hominum.' },
          { number: 5, geez: 'ብርሃኑም በጨለማ ይበራል፥ ጨለማውም አላሸነፈውም።', amharic: 'ብርሃኑም በጨለማ ይበራል፤ ጨለማውም አላሸነፈውም።', english: 'The light shines in the darkness, and the darkness has not overcome it.', greek: 'καὶ τὸ φῶς ἐν τῇ σκοτίᾳ φαίνει, καὶ ἡ σκοτία αὐτὸ οὐ κατέλαβεν.', latin: 'Et lux in tenebris lucet, et tenebrae eam non comprehenderunt.' },
        ],
      },
      {
        number: 23,
        title: 'Psalm 23',
        titleEn: 'Psalm 23',
        verses: [
          { number: 1, geez: 'እግዚአብሔር እረኛዬ ነው፤ አይጐድለኝም።', amharic: 'እግዚአብሔር እረኛዬ ነው፤ አይጐድለኝም።', english: 'The Lord is my shepherd; I shall not want.', hebrew: 'יְהוָה רֹעִי, לֹא אֶחְסָר', latin: 'Dominus pascit me, nihil mihi deerit.' },
          { number: 2, geez: 'በለመለመ ግጦሽ ያሳድረኛል፥ ወደ ዕረፍት ውሃ ይመራኛል።', amharic: 'በለመለመ ግጦሽ ያሳድረኛል፤ ወደ ዕረፍት ውሃ ይመራኛል።', english: 'He makes me lie down in green pastures, he leads me beside quiet waters.', hebrew: 'בִּנְאוֹת דֶּשֶׁא, יַרְבִּיצֵנִי; עַל-מֵי מְנֻחוֹת יְנַהֲלֵנִי', latin: 'In pascuis virentibus cubare me facit, super aquas quietis educat me.' },
          { number: 3, geez: 'ነፍሴን ያድሳል፥ ስለ ስሙ በጽድቅ መንገድ ይመራኛል።', amharic: 'ነፍሴን ያድሳል፤ ስለ ስሙ በጽድቅ መንገድ ይመራኛል።', english: 'He refreshes my soul. He guides me along the right paths for his name\'s sake.', hebrew: 'נַפְשִׁי יְשׁוֹבֵב; יַנְחֵנִי בְמַעְגְּלֵי-צֶדֶק, לְמַעַן שְׁמוֹ', latin: 'Animam meam reficit; deducit me per semitas iustitiae propter nomen suum.' },
        ],
      },
    ],
  },
};

export function getVerseText(bookId, chapterNumber, verseNumber, lang) {
  const book = BOOKS_DATA_SACRED[bookId];
  if (!book) return '';
  const chapter = book.chapters.find(c => c.number === chapterNumber);
  if (!chapter) return '';
  const verse = chapter.verses.find(v => v.number === verseNumber);
  if (!verse) return '';
  return verse[lang] || '';
}

export function getAvailableLangs(bookId) {
  if (bookId === 'quran') return ['arabic', 'geez', 'amharic', 'english'];
  if (bookId === 'bible') return ['geez', 'amharic', 'english', 'greek', 'latin', 'hebrew'];
  return ['english'];
}