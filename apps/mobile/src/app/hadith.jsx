import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Search, Globe } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, SHADOWS } from "../theme/theme";
import { api } from "../services/api";
import { LOCAL_HADITHS, LOCAL_BOOKS } from "../data/hadiths";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmall = SCREEN_WIDTH < 360;

function filterLocal(hadiths, book, q) {
  let result = hadiths;
  if (book) result = result.filter((h) => h.book === book);
  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(
      (h) =>
        String(h.hadithNumber).includes(q) ||
        h.book?.toLowerCase().includes(lower) ||
        h.chapter?.toLowerCase().includes(lower) ||
        h.narrator?.toLowerCase().includes(lower)
    );
  }
  return result;
}

function HadithCard({ hadith, onTranslate, translating }) {
  return (
    <View style={s.card}>
      <View style={s.cardBadgeRow}>
        <Text style={s.cardChapter}>{hadith.chapter}</Text>
        <Text style={s.cardNumber}>#{hadith.hadithNumber}</Text>
      </View>

      {/* Top — Arabic */}
      <View style={s.cardArabicWrap}>
        <Text style={s.cardArabic}>{hadith.arabic}</Text>
      </View>

      {/* Gutter */}
      <View style={s.cardGutter}>
        <View style={s.cardGutterLine} />
      </View>

      {/* Bottom — Translations */}
      <View style={s.cardTransWrap}>
        <View style={s.cardLangRow}>
          <Text style={s.cardLabelEn}>ENGLISH</Text>
          <Text style={s.cardLabelAmh}>አማርኛ</Text>
          {hadith.grade ? (
            <Text
              style={[
                s.cardGrade,
                hadith.grade.toLowerCase() === "sahih" && s.cardGradeSahih,
              ]}
            >
              {hadith.grade}
            </Text>
          ) : null}
        </View>

        {hadith.english ? (
          <Text style={s.cardTransText}>"{hadith.english}"</Text>
        ) : null}

        {hadith.amharic ? (
          <Text style={s.cardAmharic}>{hadith.amharic}</Text>
        ) : (
          <TouchableOpacity
            onPress={() => onTranslate(hadith)}
            disabled={translating}
            activeOpacity={0.7}
            style={s.cardTranslateBtn}
          >
            {translating ? (
              <ActivityIndicator size="small" color={COLORS.gold} />
            ) : (
              <>
                <Globe color={COLORS.gold} size={14} />
                <Text style={s.cardTranslateText}>Translate to Amharic</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {hadith.narrator ? (
        <Text style={s.cardNarrator}>— {hadith.narrator}</Text>
      ) : null}
    </View>
  );
}

export default function HadithScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [hadiths, setHadiths] = useState(() => filterLocal(LOCAL_HADITHS, "", ""));
  const [search, setSearch] = useState("");
  const [bookFilter, setBookFilter] = useState("");
  const [books, setBooks] = useState(LOCAL_BOOKS);
  const [translatingId, setTranslatingId] = useState(null);

  const load = (book, q) => {
    api.getHadiths({ book, search: q }).then((res) => {
      if (res.hadiths?.length) setHadiths(res.hadiths);
    }).catch(() => {
      setHadiths(filterLocal(LOCAL_HADITHS, book, q));
    });
  };

  useEffect(() => { load("", ""); }, []);

  const timerRef = useRef(null);
  const handleSearch = (text) => {
    setSearch(text);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => load(bookFilter, text), 200);
  };

  const handleBookFilter = (book) => {
    setBookFilter(book);
    load(book, search);
  };

  const handleTranslate = async (hadith) => {
    if (hadith.amharic || translatingId) return;
    setTranslatingId(hadith._id);
    try {
      const res = await api.translateText(hadith.arabic, "am");
      setHadiths((prev) =>
        prev.map((h) =>
          h._id === hadith._id ? { ...h, amharic: res.translation } : h
        )
      );
    } catch (_) {}
    setTranslatingId(null);
  };

  return (
    <View style={s.screen}>
      {/* Background gradients */}
      <LinearGradient
        colors={["#0B0C1A", "#1A1530", "#0B0C1A"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={["transparent", COLORS.gold + "05", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Sacred pattern */}
      <View style={s.patternOverlay} pointerEvents="none">
        <Text style={s.patternText}>†</Text>
      </View>

      <StatusBar barStyle="light-content" backgroundColor="#0B0C1A" />

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={s.headerBtn}
        >
          <ArrowLeft color={COLORS.gold} size={20} strokeWidth={2} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Hadith</Text>
          <Text style={s.headerSub}>Prophetic Traditions</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Search + Filters */}
      <View style={s.controls}>
        <View style={s.searchWrap}>
          <Search color={COLORS.muted} size={14} />
          <TextInput
            value={search}
            onChangeText={handleSearch}
            placeholder="Search..."
            placeholderTextColor={COLORS.muted}
            style={s.searchInput}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: "row", marginTop: 4 }}
        >
          <TouchableOpacity
            onPress={() => handleBookFilter("")}
            style={[s.chip, !bookFilter && s.chipActive]}
          >
            <Text style={[s.chipText, !bookFilter && s.chipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {books.map((b) => (
            <TouchableOpacity
              key={b}
              onPress={() => handleBookFilter(b)}
              style={[s.chip, bookFilter === b && s.chipActive]}
            >
              <Text style={[s.chipText, bookFilter === b && s.chipTextActive]}>
                {b}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Hadith Cards */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      >
        {hadiths.length === 0 ? (
          <View style={s.center}>
            <Text style={s.centerText}>No hadiths found</Text>
          </View>
        ) : (
          <>
            <Text style={s.count}>{hadiths.length} hadiths</Text>
            {hadiths.map((h) => (
              <HadithCard
                key={h._id}
                hadith={h}
                onTranslate={handleTranslate}
                translating={translatingId === h._id}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  patternOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.03,
    pointerEvents: "none",
  },
  patternText: {
    fontSize: 400,
    color: COLORS.gold,
    fontFamily: "serif",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.goldDim + "30",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.manuscriptBg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder + "60",
  },
  headerCenter: { alignItems: "center", flex: 1 },
  headerTitle: {
    fontSize: 18,
    color: COLORS.goldLight,
    fontFamily: "CrimsonPro_700Bold",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 9,
    color: COLORS.goldDim,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "CrimsonPro_400Regular",
    marginTop: 1,
  },

  /* Search + Filters */
  controls: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, gap: 6 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.manuscriptBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder + "40",
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: { flex: 1, paddingVertical: 8, color: COLORS.text, fontSize: 13, fontFamily: "CrimsonPro_400Regular" },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder + "40",
    marginRight: 8,
  },
  chipActive: { borderColor: COLORS.gold, backgroundColor: COLORS.gold + "15" },
  chipText: { fontSize: 11, color: COLORS.muted, fontFamily: "CrimsonPro_400Regular" },
  chipTextActive: { color: COLORS.gold },

  count: { fontSize: 11, color: COLORS.muted, marginBottom: 12, fontFamily: "CrimsonPro_400Regular" },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 80, gap: 12 },
  centerText: { color: COLORS.muted, fontSize: 13, fontFamily: "CrimsonPro_400Regular" },

  /* Card */
  card: {
    backgroundColor: "#1A1520",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A2A30",
    padding: 16,
    marginBottom: 12,
  },
  cardBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardChapter: {
    fontSize: 8,
    color: `${COLORS.gold}55`,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "CrimsonPro_400Regular",
    flex: 1,
  },
  cardNumber: { fontSize: 9, color: `${COLORS.gold}88`, fontWeight: "600" },

  cardArabicWrap: { alignItems: "center", paddingHorizontal: SPACING.sm },
  cardArabic: {
    fontSize: isSmall ? 20 : 26,
    lineHeight: isSmall ? 32 : 42,
    color: "#E8DCC8",
    textAlign: "center",
    fontWeight: "500",
  },

  cardGutter: { height: 10, justifyContent: "center", alignItems: "center", marginVertical: SPACING.sm },
  cardGutterLine: { height: 1, width: "60%", backgroundColor: COLORS.goldDim + "30" },

  cardTransWrap: { alignItems: "center" },
  cardLangRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 6,
  },
  cardLabelEn: {
    fontSize: 8,
    color: "#C8BFA088",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: "CrimsonPro_400Regular",
  },
  cardLabelAmh: {
    fontSize: 8,
    color: "#A8988088",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: "CrimsonPro_400Regular",
  },
  cardTransText: {
    fontSize: 14,
    color: "#C8BFA0",
    lineHeight: 22,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 6,
  },
  cardAmharic: {
    fontSize: 13,
    color: "#A89880",
    lineHeight: 20,
    textAlign: "center",
  },
  cardTranslateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gold + "44",
    backgroundColor: COLORS.gold + "10",
    marginTop: 4,
  },
  cardTranslateText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "CrimsonPro_700Bold",
  },
  cardGrade: {
    fontSize: 7,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: COLORS.gold,
  },
  cardGradeSahih: { color: "#4A8C5C" },
  cardNarrator: {
    fontSize: 10,
    color: COLORS.mutedLight,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#2A1E28",
  },
});
