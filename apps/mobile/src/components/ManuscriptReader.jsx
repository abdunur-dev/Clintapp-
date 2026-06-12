import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SHADOWS } from '../theme/theme';
import { useReaderStore } from '../stores/readerStore';
import { LANGUAGES, BOOKS_DATA_SACRED, getAvailableLangs } from '../data/sacred-texts';
import ParchmentPage from './ParchmentPage';
import LanguageSelector from './LanguageSelector';
import TranslationPanel from './TranslationPanel';

export default function ManuscriptReader({ bookId, onBack }) {
  const insets = useSafeAreaInsets();
  const book = BOOKS_DATA_SACRED[bookId];
  const availableLangs = getAvailableLangs(bookId);
  const langOptions = LANGUAGES.filter(l => availableLangs.includes(l.id));

  const {
    leftLang, setLeftLang,
    rightLang, setRightLang,
    selectedVerse, setSelectedVerse,
    panelOpen, setPanelOpen,
    setPanelLang,
  } = useReaderStore();

  const [chapterIndex, setChapterIndex] = useState(0);
  const chapter = book?.chapters[chapterIndex];
  const rightLangInfo = LANGUAGES.find(l => l.id === rightLang && availableLangs.includes(l.id));
  const leftLangInfo = LANGUAGES.find(l => l.id === leftLang && availableLangs.includes(l.id));

  const handleVersePress = (verseNum) => {
    if (selectedVerse === verseNum) {
      setSelectedVerse(null);
      setPanelOpen(false);
    } else {
      setSelectedVerse(verseNum);
      setPanelOpen(true);
      setPanelLang(
        LANGUAGES.find(l => l.id !== leftLang && l.id !== rightLang && availableLangs.includes(l.id))?.id || 'amharic'
      );
    }
  };

  const goToChapter = (direction) => {
    const next = chapterIndex + direction;
    if (next >= 0 && next < (book?.chapters.length || 0)) {
      setChapterIndex(next);
      setSelectedVerse(null);
      setPanelOpen(false);
    }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#0B0C1A', '#1A1530', '#0B0C1A']} style={StyleSheet.absoluteFill}>
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={['transparent', COLORS.gold + '05', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </LinearGradient>

      {/* Sacred Pattern Overlay */}
      <View style={styles.patternOverlay} pointerEvents="none">
        <Text style={styles.patternText}>†</Text>
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.headerBtn}>
          <ArrowLeft color={COLORS.gold} size={20} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerBookTitle}>{book?.titleEn || ''}</Text>
          <View style={styles.chapterNav}>
            <TouchableOpacity
              onPress={() => goToChapter(-1)}
              disabled={chapterIndex === 0}
              activeOpacity={0.6}
            >
              <Text style={[styles.chapterNavArrow, chapterIndex === 0 && { opacity: 0.3 }]}>
                ◀
              </Text>
            </TouchableOpacity>
            <Text style={styles.chapterNavText}>
              {chapter?.title || chapter?.titleEn || `Chapter ${chapterIndex + 1}`}
            </Text>
            <TouchableOpacity
              onPress={() => goToChapter(1)}
              disabled={chapterIndex >= (book?.chapters.length || 1) - 1}
              activeOpacity={0.6}
            >
              <Text style={[styles.chapterNavArrow,
                chapterIndex >= (book?.chapters.length || 1) - 1 && { opacity: 0.3 }
              ]}>
                ▶
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: 42 }} />
      </View>

      {/* Language Selectors */}
      <View style={styles.langBar}>
        <LanguageSelector
          languages={langOptions}
          selected={leftLang}
          onSelect={setLeftLang}
          label="Left Page"
        />
        <View style={styles.langDivider}>
          <Text style={styles.langDividerText}>∥</Text>
        </View>
        <LanguageSelector
          languages={langOptions}
          selected={rightLang}
          onSelect={setRightLang}
          label="Right Page"
        />
      </View>

      {/* Two-page Reader */}
      <View style={styles.readerContainer}>
        <ParchmentPage
          verses={chapter?.verses || []}
          lang={leftLang}
          langLabel={langOptions.find(l => l.id === leftLang)?.labelEn || leftLang}
          chapterTitle={chapter?.title}
          onVersePress={handleVersePress}
          selectedVerse={selectedVerse}
          bookId={bookId}
          chapterNumber={chapter?.number || 1}
          script={leftLangInfo?.script || 'ltr'}
        />

        <View style={styles.pageGutter}>
          <View style={styles.gutterLine} />
        </View>

        <ParchmentPage
          verses={chapter?.verses || []}
          lang={rightLang}
          langLabel={langOptions.find(l => l.id === rightLang)?.labelEn || rightLang}
          chapterTitle={chapter?.title}
          onVersePress={handleVersePress}
          selectedVerse={selectedVerse}
          bookId={bookId}
          chapterNumber={chapter?.number || 1}
          script={rightLangInfo?.script || 'ltr'}
        />
      </View>

      {/* Translation Panel */}
      {(selectedVerse && panelOpen) ? (
        <TranslationPanel
          bookId={bookId}
          chapterNumber={chapter?.number || 1}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (chapter?.verses[0]) {
              setSelectedVerse(chapter.verses[0].number);
              setPanelOpen(true);
            }
          }}
          activeOpacity={0.8}
          style={styles.openPanelBtn}
        >
          <Text style={styles.openPanelText}>ፍትህ ዘበአምላክ</Text>
          <Text style={styles.openPanelEn}>OPEN TRANSLATION PANEL</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.03,
  },
  patternText: {
    fontSize: 400,
    color: COLORS.gold,
    fontFamily: 'serif',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.goldDim + '30',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.manuscriptBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder + '60',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerBookTitle: {
    fontSize: 10,
    color: COLORS.goldDim,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'CrimsonPro_400Regular',
    marginBottom: 2,
  },
  chapterNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chapterNavText: {
    fontSize: 14,
    color: COLORS.goldLight,
    fontFamily: 'CrimsonPro_700Bold',
    letterSpacing: 0.5,
  },
  chapterNavArrow: {
    fontSize: 12,
    color: COLORS.gold,
    padding: 8,
  },
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    gap: 12,
  },
  langDivider: {
    alignItems: 'center',
  },
  langDividerText: {
    fontSize: 14,
    color: COLORS.goldDim,
    opacity: 0.5,
  },
  readerContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingBottom: 60,
  },
  pageGutter: {
    width: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gutterLine: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.goldDim + '30',
  },
  openPanelBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.manuscriptBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gold + '40',
    paddingVertical: 10,
    alignItems: 'center',
    ...SHADOWS.manuscript,
  },
  openPanelText: {
    fontSize: 11,
    color: COLORS.goldDim,
    fontFamily: 'CrimsonPro_400Regular',
    letterSpacing: 2,
    marginBottom: 2,
  },
  openPanelEn: {
    fontSize: 8,
    color: COLORS.gold + '70',
    letterSpacing: 3,
  },
});