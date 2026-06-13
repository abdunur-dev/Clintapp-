import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SHADOWS } from '../theme/theme';
import { OrnamentalBorder } from './ParchmentPage';
import { api } from '../services/api';
import { LOCAL_HADITHS } from '../data/hadiths';

export default function HadithBookReader({ bookSlug, bookTitle, onBack }) {
  const insets = useSafeAreaInsets();
  const [hadiths, setHadiths] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getHadiths({ book: bookSlug }).then((res) => {
      if (res.hadiths?.length) setHadiths(res.hadiths);
    }).catch(() => {
      setHadiths(LOCAL_HADITHS.filter((h) => h.book === bookSlug));
    }).finally(() => setLoading(false));
  }, [bookSlug]);

  const hadith = hadiths[index];
  const total = hadiths.length;

  const goTo = (dir) => {
    const next = index + dir;
    if (next >= 0 && next < total) {
      setIndex(next);
      setPanelOpen(false);
    }
  };

  const handleTranslate = async () => {
    if (!hadith || hadith.amharic || translating) return;
    setTranslating(true);
    try {
      const res = await api.translateText(hadith.arabic, 'am');
      setHadiths((prev) =>
        prev.map((h) =>
          h._id === hadith._id ? { ...h, amharic: res.translation } : h
        )
      );
    } catch (_) {}
    setTranslating(false);
  };

  const availableLangs = [];
  if (hadith?.english) availableLangs.push('en');
  if (hadith?.amharic) availableLangs.push('am');
  if (hadith?.arabic) availableLangs.push('ar');

  return (
    <View style={styles.screen}>
      {/* Background gradients */}
      <LinearGradient
        colors={['#0B0C1A', '#1A1530', '#0B0C1A']}
        style={StyleSheet.absoluteFill}
      />
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['transparent', COLORS.gold + '05', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Sacred pattern overlay */}
      <View style={styles.patternOverlay} pointerEvents="none">
        <Text style={styles.patternText}>†</Text>
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.headerBtn}>
          <ArrowLeft color={COLORS.gold} size={20} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerBookTitle}>{bookTitle}</Text>
          <View style={styles.chapterNav}>
            <TouchableOpacity
              onPress={() => goTo(-1)}
              disabled={index === 0}
              activeOpacity={0.6}
            >
              <Text style={[styles.chapterNavArrow, index === 0 && { opacity: 0.3 }]}>
                ◀
              </Text>
            </TouchableOpacity>
            <Text style={styles.chapterNavText}>
              {total > 0 ? `Hadith ${index + 1} of ${total}` : ''}
            </Text>
            <TouchableOpacity
              onPress={() => goTo(1)}
              disabled={index >= total - 1}
              activeOpacity={0.6}
            >
              <Text style={[styles.chapterNavArrow, index >= total - 1 && { opacity: 0.3 }]}>
                ▶
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.gold} size="large" />
        </View>
      ) : !hadith ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No hadiths found</Text>
        </View>
      ) : (
        <>
          {/* Up/Down Reader */}
          <View style={styles.verticalContainer}>
            {/* Top Pane — Arabic */}
            <OrnamentalBorder compact>
            <View style={styles.paneTop}>
              <View style={styles.paneOrnament}>
                <Text style={styles.paneOrnamentText}>⚜</Text>
              </View>
              <View style={styles.paneLabelRow}>
                <Text style={styles.paneLabel}>العربية ‎</Text>
                {hadith.chapter ? (
                  <Text style={styles.paneChapter}>{hadith.chapter}</Text>
                ) : null}
                <Text style={styles.paneNumber}>#{hadith.hadithNumber}</Text>
              </View>
              <View style={styles.paneLangBadge}>
                <Text style={styles.paneLangBadgeText}>Original</Text>
              </View>
              <View style={styles.arabicWrap}>
                <Text style={styles.arabic}>{hadith.arabic}</Text>
              </View>
              {hadith.narrator ? (
                <Text style={styles.narratorTop}>— Narrated by {hadith.narrator}</Text>
              ) : null}
            </View>
            </OrnamentalBorder>

            {/* Gutter */}
            <View style={styles.gutter}>
              <View style={styles.gutterLine} />
            </View>

            {/* Bottom Pane — Translations */}
            <OrnamentalBorder compact>
            <View style={styles.paneBottom}>
              <View style={styles.paneOrnament}>
                <Text style={styles.paneOrnamentText}>⚜</Text>
              </View>
              <View style={styles.paneLabelRow}>
                <Text style={styles.paneLabelEn}>ENGLISH</Text>
                <Text style={styles.paneLabelAmh}>አማርኛ</Text>
                {hadith.grade ? (
                  <Text
                    style={[
                      styles.gradeBadge,
                      hadith.grade.toLowerCase() === 'sahih' && styles.gradeSahih,
                    ]}
                  >
                    {hadith.grade}
                  </Text>
                ) : null}
              </View>

              {hadith.english ? (
                <>
                  <View style={styles.paneLangBadgeAmh}>
                    <Text style={styles.paneLangBadgeTextAmh}>English Translation</Text>
                  </View>
                  <Text style={styles.transText}>"{hadith.english}"</Text>
                </>
              ) : null}

              {hadith.amharic ? (
                <>
                  <View style={styles.paneSep} />
                  <View style={styles.paneLangBadgeAmh}>
                    <Text style={styles.paneLangBadgeTextAmh}>አማርኛ ትርጉም</Text>
                  </View>
                  <Text style={styles.amharic}>{hadith.amharic}</Text>
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleTranslate}
                  disabled={translating}
                  activeOpacity={0.7}
                  style={styles.translateBtn}
                >
                  {translating ? (
                    <ActivityIndicator size="small" color={COLORS.gold} />
                  ) : (
                    <>
                      <Globe color={COLORS.gold} size={16} />
                      <Text style={styles.translateBtnText}>Translate with Gemini</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
            </OrnamentalBorder>
          </View>

          {/* Bottom Panel Toggle */}
          <TouchableOpacity
            onPress={() => setPanelOpen(!panelOpen)}
            activeOpacity={0.8}
            style={styles.panelBtn}
          >
            {panelOpen && availableLangs.length > 0 ? (
              <View style={styles.panelContent}>
                {availableLangs.includes('ar') && (
                  <Text style={styles.panelLang}>العربية — {hadith.arabic}</Text>
                )}
                {availableLangs.includes('en') && (
                  <Text style={styles.panelLang}>English — {hadith.english}</Text>
                )}
                {availableLangs.includes('am') && (
                  <Text style={styles.panelLang}>አማርኛ — {hadith.amharic}</Text>
                )}
              </View>
            ) : (
              <>
                <Text style={styles.panelText}>ፍትህ ዘበአምላክ</Text>
                <Text style={styles.panelEn}>OPEN TRANSLATION PANEL</Text>
              </>
            )}
          </TouchableOpacity>
        </>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.muted,
    fontFamily: 'CrimsonPro_400Regular',
    fontSize: 14,
  },

  /* Header */
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

  /* Vertical layout */
  verticalContainer: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: 60,
    gap: 4,
  },

  /* Top pane — Arabic */
  paneTop: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.md,
  },
  paneOrnament: {
    alignItems: 'center',
    marginBottom: 4,
  },
  paneOrnamentText: {
    fontSize: 14,
    color: COLORS.gold,
    opacity: 0.6,
  },
  paneLangBadge: {
    alignSelf: 'center',
    backgroundColor: COLORS.gold + '22',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: COLORS.gold + '50',
    marginBottom: 8,
  },
  paneLangBadgeText: {
    fontSize: 7,
    color: COLORS.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'CrimsonPro_400Regular',
  },
  paneLangBadgeAmh: {
    alignSelf: 'center',
    backgroundColor: COLORS.gold + '18',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: COLORS.gold + '40',
    marginBottom: 4,
  },
  paneLangBadgeTextAmh: {
    fontSize: 7,
    color: COLORS.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'CrimsonPro_400Regular',
  },
  paneSep: {
    height: 1,
    width: '40%',
    backgroundColor: COLORS.goldDim + '30',
    alignSelf: 'center',
    marginVertical: 6,
  },
  paneLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  paneLabel: {
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'CrimsonPro_400Regular',
    opacity: 0.7,
  },
  paneLabelEn: {
    fontSize: 9,
    color: '#C8BFA088',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'CrimsonPro_400Regular',
  },
  paneLabelAmh: {
    fontSize: 9,
    color: '#A8988088',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'CrimsonPro_400Regular',
  },
  paneChapter: {
    fontSize: 8,
    color: `${COLORS.gold}55`,
    textTransform: 'uppercase',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  paneNumber: {
    fontSize: 9,
    color: `${COLORS.gold}88`,
    fontWeight: '600',
  },
  arabicWrap: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  arabic: {
    fontSize: 28,
    lineHeight: 44,
    color: '#E8DCC8',
    textAlign: 'center',
    fontWeight: '500',
  },
  narratorTop: {
    fontSize: 10,
    color: COLORS.mutedLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: SPACING.sm,
  },

  /* Gutter */
  gutter: {
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gutterLine: {
    height: 1,
    width: '60%',
    backgroundColor: COLORS.goldDim + '30',
  },

  /* Bottom pane — Translations */
  paneBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  transText: {
    fontSize: 15,
    color: '#C8BFA0',
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  amharic: {
    fontSize: 14,
    color: '#A89880',
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  translateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
    backgroundColor: COLORS.gold + '10',
  },
  translateBtnText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'CrimsonPro_700Bold',
  },
  gradeBadge: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.gold,
  },
  gradeSahih: { color: '#4A8C5C' },

  /* Bottom panel */
  panelBtn: {
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
  panelText: {
    fontSize: 11,
    color: COLORS.goldDim,
    fontFamily: 'CrimsonPro_400Regular',
    letterSpacing: 2,
    marginBottom: 2,
  },
  panelEn: {
    fontSize: 8,
    color: COLORS.gold + '70',
    letterSpacing: 3,
  },
  panelContent: {
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  panelLang: {
    fontSize: 11,
    color: COLORS.gold,
    fontFamily: 'CrimsonPro_400Regular',
    marginBottom: 4,
    textAlign: 'center',
  },
});
