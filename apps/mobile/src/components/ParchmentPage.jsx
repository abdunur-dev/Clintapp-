import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { useReaderStore } from '../stores/readerStore';
import { api } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmall = SCREEN_WIDTH < 380;
const PAGE_WIDTH = SCREEN_WIDTH / 2 - 6;

export function OrnamentalBorder({ children, compact }) {
  const borderColors = [COLORS.gold, COLORS.ornamentBorder, COLORS.goldDim];
  return (
    <View style={[styles.pageOuter, compact && { width: '100%', flex: 1 }]}>
      <LinearGradient
        colors={borderColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.borderOuter}
      />
      <LinearGradient
        colors={['#2A1A0A', '#3A2A1A', '#2A1A0A']}
        style={styles.pageBackground}
      >
        <LinearGradient
          colors={['rgba(245, 230, 200, 0.12)', 'rgba(245, 230, 200, 0.06)']}
          style={StyleSheet.absoluteFill}
        />
        {compact ? null : (
          <>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </>
        )}
        <View style={[styles.centerOrnament, compact && { top: 8 }]}>
          <View style={[styles.ornamentDiamond, compact && { width: 4, height: 4 }]} />
        </View>
        {children}
      </LinearGradient>
    </View>
  );
}

export default function ParchmentPage({
  verses,
  lang,
  langLabel,
  chapterTitle,
  onVersePress,
  selectedVerse,
  bookId,
  chapterNumber,
  script = 'ltr',
  scrollRef,
  onScroll,
  compact,
  translations: externalTranslations,
}) {
  const { fontSize, isBookmarked, toggleBookmark } = useReaderStore();
  const isRTL = script === 'rtl';
  const [localTranslations, setLocalTranslations] = useState({});
  const translations = externalTranslations || localTranslations;
  const [translatingVerse, setTranslatingVerse] = useState(null);

  const translateVerse = async (verseNum, sourceText, targetLangId) => {
    setTranslatingVerse(verseNum);
    const targetLang = targetLangId === 'amharic' ? 'am' : targetLangId === 'arabic' ? 'ar' : 'en';
    try {
      const res = await api.translateText(sourceText, targetLang);
      setLocalTranslations(prev => ({ ...prev, [verseNum]: res.translation }));
    } catch (_) {}
    setTranslatingVerse(null);
  };

  const needsTranslate = verses.length > 0 && !verses[0][lang] && verses[0]['arabic'];

  return (
    <OrnamentalBorder compact={compact}>
      <View style={[styles.pageInner, isRTL && compact && { direction: 'rtl' }, compact && styles.pageInnerCompact]}>
        {compact ? null : (
          <View style={styles.headerOrnament}>
            <Text style={styles.headerLine}>⚜</Text>
          </View>
        )}
        <View style={[styles.langLabel, compact && { position: 'relative', top: 0, right: 0, alignSelf: 'center', marginBottom: 4 }]}>
          <Text style={styles.langText}>{langLabel}</Text>
        </View>
        {needsTranslate && (
          <TouchableOpacity
            onPress={() => translateVerse(verses[0].number, verses[0]['arabic'], lang)}
            activeOpacity={0.7}
            style={styles.paneTranslateBtn}
          >
            {translatingVerse ? (
              <ActivityIndicator size="small" color={COLORS.gold} />
            ) : (
              <Text style={styles.paneTranslateText}>
                {lang === 'amharic' ? 'አማርኛ' : lang === 'english' ? 'English' : lang}
              </Text>
            )}
          </TouchableOpacity>
        )}
        {chapterTitle && (
          <Text style={[styles.chapterTitle, isRTL && { textAlign: 'right' }, compact && { fontSize: 10, marginBottom: 4 }]}>
            {chapterTitle}
          </Text>
        )}
        <ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.versesScroll}
          contentContainerStyle={styles.versesContent}
          showsVerticalScrollIndicator={false}
        >
          {verses.map((verse) => {
            const translated = translations[verse.number];
            let text = translated || verse[lang] || '';
            const isFallback = !text && verse['arabic'];
            if (isFallback) text = verse['arabic'];
            const isFallbackTranslate = isFallback && !translated;
            const isSelected = selectedVerse === verse.number;
            const isBookmarkedVerse = isBookmarked(verse.number, chapterNumber, bookId);

            return (
              <TouchableOpacity
                key={verse.number}
                onPress={() => onVersePress?.(verse.number)}
                activeOpacity={0.7}
                style={[
                  styles.verseRow,
                  isSelected && styles.verseSelected,
                  isRTL && { flexDirection: 'row-reverse' },
                ]}
              >
                <View
                  style={[
                    styles.verseNumberBadge,
                    isSelected && styles.verseNumberBadgeActive,
                    isBookmarkedVerse && styles.verseNumberBadgeBookmarked,
                  ]}
                >
                  <Text style={styles.verseNumberText}>
                    {verse.number}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  {verse.grade ? (
                    <Text style={[styles.gradeBadge,
                      verse.grade.toLowerCase().includes('sahih') && styles.gradeSahih,
                      verse.grade.toLowerCase().includes('da') && styles.gradeDaif,
                      verse.grade.toLowerCase().includes('hasan') && styles.gradeHasan,
                    ]}>{verse.grade}</Text>
                  ) : null}
                  <Text
                    style={[
                      styles.verseText,
                      isFallbackTranslate && styles.verseTextFallback,
                      {
                        fontSize: fontSize,
                        fontFamily: isFallbackTranslate ? 'serif' : (lang === 'arabic' ? 'serif' : 'CrimsonPro_400Regular'),
                      },
                      isRTL && { textAlign: 'right' },
                      isSelected && styles.verseTextActive,
                    ]}
                  >
                    {text || '...'}
                  </Text>
                  {verse.narrator ? (
                    <Text style={styles.narratorText}>{verse.narrator}</Text>
                  ) : null}
                  {isFallbackTranslate && (
                    <Text style={styles.fallbackBadge}>መልስ</Text>
                  )}
                </View>
                {isBookmarkedVerse && <Text style={styles.bookmarkIndicator}>✦</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </OrnamentalBorder>
  );
}

function toEthiopicNumeral(n) {
  if (!n) return '';
  const ethNum = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱', '፲', '፲፩', '፲፪', '፲፫', '፲፬', '፲፭', '፲፮', '፲፯', '፲፰', '፲፱', '፳', '፳፩', '፳፪', '፳፫', '፳፬', '፳፭', '፳፮', '፳፯', '፳፰', '፳፱', '፴'];
  return ethNum[n] || String(n);
}

const styles = StyleSheet.create({
  pageOuter: {
    width: PAGE_WIDTH,
    borderRadius: 4,
    overflow: 'hidden',
    ...SHADOWS.manuscript,
  },
  borderOuter: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  pageBackground: {
    flex: 1,
    margin: 2.5,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.goldDim + '60',
    overflow: 'hidden',
  },
  pageInner: {
    flex: 1,
    padding: isSmall ? 6 : 10,
  },
  pageInnerCompact: {
    padding: 6,
  },
  headerOrnament: {
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLine: {
    fontSize: 12,
    color: COLORS.gold,
    opacity: 0.7,
  },
  langLabel: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: COLORS.gold + '22',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: COLORS.gold + '50',
  },
  langText: {
    fontSize: 8,
    color: COLORS.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'CrimsonPro_400Regular',
  },
  chapterTitle: {
    fontFamily: 'CrimsonPro_700Bold',
    fontSize: isSmall ? 10 : 12,
    color: COLORS.goldLight,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  paneTranslateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
    backgroundColor: COLORS.gold + '10',
    marginBottom: 6,
  },
  paneTranslateText: {
    fontSize: 10,
    color: COLORS.gold,
    fontFamily: 'CrimsonPro_700Bold',
    letterSpacing: 0.5,
  },
  versesScroll: {
    flex: 1,
  },
  versesContent: {
    paddingBottom: 20,
  },
  verseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRadius: 4,
    marginBottom: 2,
  },
  verseSelected: {
    backgroundColor: COLORS.gold + '18',
    borderWidth: 0.5,
    borderColor: COLORS.gold + '40',
  },
  verseNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.goldDim + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: COLORS.goldDim,
    flexShrink: 0,
  },
  verseNumberBadgeActive: {
    backgroundColor: COLORS.gold + '60',
    borderColor: COLORS.gold,
  },
  verseNumberBadgeBookmarked: {
    backgroundColor: COLORS.gemRuby + '60',
    borderColor: COLORS.sealRed,
  },
  verseNumberText: {
    fontSize: 8,
    color: COLORS.goldLight,
    fontFamily: 'CrimsonPro_400Regular',
  },
  verseText: {
    flex: 1,
    color: COLORS.parchment,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  verseTextActive: {
    color: COLORS.goldLight,
  },
  verseTextFallback: {
    opacity: 0.5,
    fontStyle: 'italic',
  },
  fallbackBadge: {
    fontSize: 7,
    color: COLORS.goldDim,
    fontFamily: 'CrimsonPro_400Regular',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  gradeBadge: {
    fontSize: 8,
    fontFamily: 'CrimsonPro_700Bold',
    letterSpacing: 0.5,
    marginBottom: 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  gradeSahih: {
    color: '#4CAF50',
    backgroundColor: '#4CAF5022',
    borderWidth: 0.5,
    borderColor: '#4CAF5066',
  },
  gradeDaif: {
    color: '#FF9800',
    backgroundColor: '#FF980022',
    borderWidth: 0.5,
    borderColor: '#FF980066',
  },
  gradeHasan: {
    color: '#2196F3',
    backgroundColor: '#2196F322',
    borderWidth: 0.5,
    borderColor: '#2196F366',
  },
  narratorText: {
    fontSize: 8,
    color: COLORS.goldDim,
    fontFamily: 'CrimsonPro_400Regular',
    fontStyle: 'italic',
    marginTop: 1,
  },
  bookmarkIndicator: {
    fontSize: 10,
    color: COLORS.gold,
    marginLeft: 2,
  },
  cornerTL: {
    position: 'absolute', top: 4, left: 4,
    width: 12, height: 12,
    borderTopWidth: 1.5, borderLeftWidth: 1.5,
    borderColor: COLORS.goldDim + '60',
  },
  cornerTR: {
    position: 'absolute', top: 4, right: 4,
    width: 12, height: 12,
    borderTopWidth: 1.5, borderRightWidth: 1.5,
    borderColor: COLORS.goldDim + '60',
  },
  cornerBL: {
    position: 'absolute', bottom: 4, left: 4,
    width: 12, height: 12,
    borderBottomWidth: 1.5, borderLeftWidth: 1.5,
    borderColor: COLORS.goldDim + '60',
  },
  cornerBR: {
    position: 'absolute', bottom: 4, right: 4,
    width: 12, height: 12,
    borderBottomWidth: 1.5, borderRightWidth: 1.5,
    borderColor: COLORS.goldDim + '60',
  },
  centerOrnament: {
    position: 'absolute',
    top: 16,
    left: 0, right: 0,
    alignItems: 'center',
  },
  ornamentDiamond: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.gold,
    transform: [{ rotate: '45deg' }],
    opacity: 0.4,
  },
});