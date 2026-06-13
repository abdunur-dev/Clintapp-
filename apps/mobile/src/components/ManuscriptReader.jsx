import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SHADOWS } from '../theme/theme';
import { useReaderStore } from '../stores/readerStore';
import { LANGUAGES, BOOKS_DATA_SACRED, getAvailableLangs } from '../data/sacred-texts';
import { LOCAL_HADITHS } from '../data/hadiths';
import ParchmentPage from './ParchmentPage';
import LanguageSelector from './LanguageSelector';
import TranslationPanel from './TranslationPanel';
import { api } from '../services/api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HADITH_LANGS = ['arabic', 'english', 'amharic'];

export default function ManuscriptReader({ bookId, onBack, hadithSlug, hadithTitle }) {
  const insets = useSafeAreaInsets();

  // Hadith state
  const [hadiths, setHadiths] = useState([]);
  const [hadithsLoading, setHadithsLoading] = useState(!!hadithSlug);

  const isHadith = !!hadithSlug;

  const book = isHadith
    ? {
        titleEn: hadithTitle || 'Hadith Collection',
        chapters: hadiths.length > 0
          ? [{ number: 1, title: hadithTitle || 'Hadith', verses: hadiths.map(h => ({
              number: h.hadithNumber,
              arabic: h.arabic,
              english: h.english,
              amharic: h.amharic,
              chapter: h.chapter,
              narrator: h.narrator,
              grade: h.grade,
            })) }]
          : []
      }
    : BOOKS_DATA_SACRED[bookId];

  const availableLangs = isHadith
    ? HADITH_LANGS
    : getAvailableLangs(bookId);

  const langOptions = LANGUAGES.filter(l => availableLangs.includes(l.id));

  const {
    leftLang, setLeftLang,
    rightLang, setRightLang,
    selectedVerse, setSelectedVerse,
    panelOpen, setPanelOpen,
    setPanelLang,
  } = useReaderStore();

  // Ensure selected languages are available
  useEffect(() => {
    if (availableLangs.length === 0) return;
    if (!availableLangs.includes(leftLang)) setLeftLang(availableLangs[0]);
    if (!availableLangs.includes(rightLang)) setRightLang(availableLangs[1] || availableLangs[0]);
  }, [availableLangs.join(',')]);

  // Load hadiths when hadithSlug is provided
  useEffect(() => {
    if (!isHadith) return;
    setHadithsLoading(true);
    api.getHadiths({ book: hadithSlug }).then((res) => {
      if (res.hadiths?.length) {
        setHadiths(res.hadiths);
      } else {
        setHadiths(LOCAL_HADITHS.filter((h) => h.book === hadithSlug));
      }
    }).catch(() => {
      setHadiths(LOCAL_HADITHS.filter((h) => h.book === hadithSlug));
    }).finally(() => setHadithsLoading(false));
  }, [hadithSlug]);

  const [chapterIndex, setChapterIndex] = useState(0);
  const chapter = book?.chapters[chapterIndex];
  const leftLangInfo = LANGUAGES.find(l => l.id === leftLang && availableLangs.includes(l.id));
  const rightLangInfo = LANGUAGES.find(l => l.id === rightLang && availableLangs.includes(l.id));

  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  const syncing = useRef(false);

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

  const handleTopScroll = (e) => {
    if (syncing.current) return;
    syncing.current = true;
    const y = e.nativeEvent.contentOffset.y;
    bottomScrollRef.current?.scrollTo({ y, animated: false });
    setTimeout(() => { syncing.current = false; }, 16);
  };

  const handleBottomScroll = (e) => {
    if (syncing.current) return;
    syncing.current = true;
    const y = e.nativeEvent.contentOffset.y;
    topScrollRef.current?.scrollTo({ y, animated: false });
    setTimeout(() => { syncing.current = false; }, 16);
  };

  const verses = chapter?.verses || [];

  if (hadithsLoading) {
    return (
      <View style={styles.screen}>
        <LinearGradient colors={['#0B0C1A', '#1A1530', '#0B0C1A']} style={StyleSheet.absoluteFill} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={COLORS.gold} size="large" />
          <Text style={styles.loadingText}>Loading hadiths...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Background gradients */}
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
          {isHadith ? (
            <Text style={styles.headerSub}>{hadiths.length} hadiths · Authentic</Text>
          ) : null}
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
              {isHadith
                ? `Hadiths 1–${verses.length}`
                : chapter?.title || chapter?.titleEn || `Chapter ${chapterIndex + 1}`
              }
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

      {/* Info text for hadiths */}
      {isHadith && verses.length > 0 ? (
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            Read, study, and translate hadiths from this authentic collection
          </Text>
        </View>
      ) : null}

      {/* Language Selectors */}
      <View style={styles.langBar}>
        <LanguageSelector
          languages={langOptions}
          selected={leftLang}
          onSelect={setLeftLang}
          label="Top"
        />
        <View style={styles.langDivider}>
          <Text style={styles.langDividerText}>∥</Text>
        </View>
        <LanguageSelector
          languages={langOptions}
          selected={rightLang}
          onSelect={setRightLang}
          label="Bottom"
        />
      </View>

      {/* Vertical Panes */}
      {verses.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No content found</Text>
        </View>
      ) : (
        <View style={styles.panes}>
          {/* Top Pane */}
          <View style={styles.pane}>
            <ParchmentPage
              verses={verses}
              lang={leftLang}
              langLabel={langOptions.find(l => l.id === leftLang)?.labelEn || leftLang}
              chapterTitle={chapter?.title}
              onVersePress={handleVersePress}
              selectedVerse={selectedVerse}
              bookId={bookId || hadithSlug}
              chapterNumber={chapter?.number || 1}
              script={leftLangInfo?.script || 'ltr'}
              scrollRef={topScrollRef}
              onScroll={handleTopScroll}
              compact
            />
          </View>

          {/* Gutter */}
          <View style={styles.gutter}>
            <View style={styles.gutterLine} />
          </View>

          {/* Bottom Pane */}
          <View style={styles.pane}>
            <ParchmentPage
              verses={verses}
              lang={rightLang}
              langLabel={langOptions.find(l => l.id === rightLang)?.labelEn || rightLang}
              chapterTitle={chapter?.title}
              onVersePress={handleVersePress}
              selectedVerse={selectedVerse}
              bookId={bookId || hadithSlug}
              chapterNumber={chapter?.number || 1}
              script={rightLangInfo?.script || 'ltr'}
              scrollRef={bottomScrollRef}
              onScroll={handleBottomScroll}
              compact
            />
          </View>
        </View>
      )}

      {/* Translation Panel */}
      {(selectedVerse && panelOpen) ? (
        <TranslationPanel
          bookId={bookId || hadithSlug}
          chapterNumber={chapter?.number || 1}
          verses={isHadith ? verses : undefined}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (verses[0]) {
              setSelectedVerse(verses[0].number);
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
    pointerEvents: 'none',
  },
  patternText: {
    fontSize: 400,
    color: COLORS.gold,
    fontFamily: 'serif',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.muted,
    fontFamily: 'CrimsonPro_400Regular',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.muted,
    fontFamily: 'CrimsonPro_400Regular',
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
  headerSub: {
    fontSize: 9,
    color: COLORS.gold + '70',
    letterSpacing: 1,
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
  infoBar: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: 6,
    backgroundColor: COLORS.gold + '08',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gold + '20',
  },
  infoText: {
    fontSize: 10,
    color: COLORS.goldDim,
    textAlign: 'center',
    fontFamily: 'CrimsonPro_400Regular',
    letterSpacing: 0.5,
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
  panes: {
    flex: 1,
    paddingBottom: 60,
  },
  pane: {
    height: SCREEN_HEIGHT / 2 - 120,
    paddingHorizontal: 4,
  },
  gutter: {
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gutterLine: {
    height: 1,
    width: '60%',
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
