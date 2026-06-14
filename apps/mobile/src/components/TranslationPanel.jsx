import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Bookmark, Copy, Share2, PenLine, Headphones } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { useReaderStore } from '../stores/readerStore';
import { LANGUAGES, getVerseText, getAvailableLangs } from '../data/sacred-texts';
import { api } from '../services/api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.4;

export default function TranslationPanel({
  bookId,
  chapterNumber,
  verses: propVerses,
}) {
  const {
    selectedVerse,
    panelOpen,
    setPanelOpen,
    panelLang,
    setPanelLang,
    leftLang,
    rightLang,
    isBookmarked,
    toggleBookmark,
  } = useReaderStore();
  const slideAnim = useRef(new Animated.Value(PANEL_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: panelOpen ? 0 : PANEL_HEIGHT,
      useNativeDriver: true,
      tension: 60,
      friction: 12,
    }).start();
  }, [panelOpen, slideAnim]);

  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    setAnalysisResult(null);
    setAnalysisLoading(false);
  }, [selectedVerse, panelLang]);

  const handleLangSelect = (langId) => {
    setPanelLang(langId);
  };

  if (!selectedVerse) return null;

  const getText = (langId) => {
    if (propVerses) {
      const v = propVerses.find(v => v.number === selectedVerse);
      return v ? v[langId] || '' : '';
    }
    return getVerseText(bookId, chapterNumber, selectedVerse, langId);
  };
  const verseText = getText(panelLang);
  const leftText = getText(leftLang);
  const rightText = getText(rightLang);

  const isHadith = !!propVerses;
  const allBookLangs = isHadith
    ? LANGUAGES.filter(l => ['arabic', 'english', 'amharic'].includes(l.id))
    : LANGUAGES.filter(l => {
        const avail = propVerses
          ? ['arabic', 'english', 'amharic', 'geez', 'greek', 'hebrew', 'latin']
          : getAvailableLangs(bookId) || [];
        return avail.includes(l.id);
      });
  const languages = allBookLangs;
  const currentLang = languages.find(l => l.id === panelLang) || languages[0];
  const isBookmarkedVerse = isBookmarked(selectedVerse, chapterNumber, bookId);

  const availableLangs = languages.filter(
    l => l.id !== leftLang && l.id !== rightLang
  );

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity
        onPress={() => setPanelOpen(!panelOpen)}
        activeOpacity={0.9}
        style={styles.handle}
      >
        <View style={styles.handleBar} />
        <Text style={styles.handleLabel}>
          Verse {selectedVerse} {isBookmarkedVerse ? '✦' : ''}
        </Text>
      </TouchableOpacity>

      {panelOpen && (
        <View style={styles.content}>
          {/* Verse comparison */}
          <ScrollView style={styles.verseArea} showsVerticalScrollIndicator={false}>
            <View style={styles.comparisonRow}>
              <View style={styles.compCol}>
                <Text style={styles.compLang}>
                  {languages.find(l => l.id === leftLang)?.label}
                </Text>
                <Text style={styles.compText}>{leftText}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.compCol}>
                <Text style={styles.compLang}>
                  {languages.find(l => l.id === rightLang)?.label}
                </Text>
                <Text style={styles.compText}>{rightText}</Text>
              </View>
            </View>

            <View style={styles.panelLangSection}>
              <Text style={styles.panelLangLabel}>
                {currentLang?.label} — {currentLang?.labelEn}
              </Text>

              {verseText ? (
                <Text style={styles.panelVerseText}>{verseText}</Text>
              ) : (
                <Text style={styles.noDataText}>No content available for this language</Text>
              )}

              <TouchableOpacity
                onPress={async () => {
                  const sourceText = getText(leftLang || 'arabic') || getText('arabic') || verseText;
                  if (!sourceText) return;
                  setAnalysisLoading(true);
                  try {
                    const res = await api.scholarlyAnalysis(sourceText, { book: bookId || undefined });
                    setAnalysisResult(res.result);
                  } catch (_) {
                    setAnalysisResult('❌ የትንተና አገልግሎት አልተሳካም። እባክዎ በኋላ ይሞክሩ።');
                  }
                  setAnalysisLoading(false);
                }}
                disabled={analysisLoading}
                activeOpacity={0.7}
                style={styles.analysisBtn}
              >
                {analysisLoading ? (
                  <ActivityIndicator size="small" color={COLORS.gold} />
                ) : (
                  <>
                    <Text style={styles.analysisBtnIcon}>📖</Text>
                    <Text style={styles.analysisBtnText}>ትንተና (Analysis)</Text>
                  </>
                )}
              </TouchableOpacity>

              {analysisResult && (
                <View style={styles.analysisResultBox}>
                  <ScrollView showsVerticalScrollIndicator={false} style={styles.analysisScroll}>
                    <Text style={styles.analysisText}>{analysisResult}</Text>
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Quick language switches */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.langStrip}
            >
              {availableLangs.map(l => (
                <TouchableOpacity
                  key={l.id}
                  onPress={() => handleLangSelect(l.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.langChip,
                    panelLang === l.id && styles.langChipActive,
                  ]}
                >
                  <Text style={[
                    styles.langChipText,
                    panelLang === l.id && styles.langChipTextActive,
                  ]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <ActionButton icon={Bookmark} label={isBookmarkedVerse ? 'Saved' : 'Save'}
              active={isBookmarkedVerse}
              onPress={() => toggleBookmark({
                verseNumber: selectedVerse,
                chapterNumber,
                bookId,
              })}
            />
            <ActionButton icon={Copy} label="Copy" />
            <ActionButton icon={Share2} label="Share" />
            <ActionButton icon={PenLine} label="Note" />
            <ActionButton icon={Headphones} label="Listen" />
          </View>
        </View>
      )}
    </Animated.View>
  );
}

function ActionButton({ icon: Icon, label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.actionBtn, active && styles.actionBtnActive]}
    >
      <Icon
        color={active ? COLORS.gold : COLORS.mutedLight}
        size={18}
        strokeWidth={active ? 2.5 : 1.8}
      />
      <Text style={[styles.actionLabel, active && styles.actionLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: PANEL_HEIGHT,
    backgroundColor: COLORS.manuscriptBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold + '50',
    borderBottomWidth: 0,
    ...SHADOWS.manuscript,
    zIndex: 100,
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.goldDim + '30',
  },
  handleBar: {
    width: 40,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.gold,
    marginBottom: 4,
    opacity: 0.6,
  },
  handleLabel: {
    fontSize: 11,
    color: COLORS.gold,
    fontFamily: 'CrimsonPro_700Bold',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  verseArea: {
    flex: 1,
  },
  comparisonRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg + '80',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.goldDim + '30',
    marginBottom: SPACING.md,
  },
  compCol: {
    flex: 1,
    paddingHorizontal: 4,
  },
  compLang: {
    fontSize: 8,
    color: COLORS.goldDim,
    fontFamily: 'CrimsonPro_700Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  compText: {
    fontSize: 12,
    color: COLORS.parchment,
    fontFamily: 'CrimsonPro_400Regular',
    lineHeight: 18,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.goldDim + '30',
    marginHorizontal: 8,
  },
  panelLangSection: {
    backgroundColor: COLORS.card + '60',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.goldDim + '20',
  },
  panelLangLabel: {
    fontSize: 9,
    color: COLORS.gold,
    fontFamily: 'CrimsonPro_700Bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  panelVerseText: {
    fontSize: 14,
    color: COLORS.parchmentDark,
    fontFamily: 'CrimsonPro_400Regular',
    lineHeight: 22,
  },
  langStrip: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.goldDim + '40',
    marginRight: 8,
  },
  langChipActive: {
    backgroundColor: COLORS.gold + '20',
    borderColor: COLORS.gold,
  },
  langChipText: {
    fontSize: 12,
    color: COLORS.muted,
    fontFamily: 'CrimsonPro_400Regular',
  },
  langChipTextActive: {
    color: COLORS.gold,
    fontFamily: 'CrimsonPro_700Bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.goldDim + '20',
  },
  actionBtn: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionBtnActive: {
    backgroundColor: COLORS.gold + '15',
  },
  actionLabel: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
    fontFamily: 'CrimsonPro_400Regular',
    letterSpacing: 0.5,
  },
  actionLabelActive: {
    color: COLORS.gold,
  },
  noDataText: {
    fontSize: 11,
    color: COLORS.muted,
    fontFamily: 'CrimsonPro_400Regular',
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
  analysisBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.sm,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gold + '66',
    backgroundColor: COLORS.manuscriptBg,
  },
  analysisBtnIcon: {
    fontSize: 14,
  },
  analysisBtnText: {
    color: COLORS.parchment,
    fontSize: 12,
    fontFamily: 'CrimsonPro_700Bold',
  },
  analysisResultBox: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.bg + '99',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gold + '33',
    padding: SPACING.sm,
    maxHeight: 240,
  },
  analysisScroll: {
    flex: 1,
  },
  analysisText: {
    fontSize: 12,
    color: COLORS.parchmentDark,
    fontFamily: 'CrimsonPro_400Regular',
    lineHeight: 20,
  },
});