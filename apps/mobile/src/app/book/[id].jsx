import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  Moon,
  Church,
  Feather,
  Heart,
  Download,
  Share2,
  Star,
  Bookmark,
  Type,
  Sun,
  Moon as MoonIcon,
  Highlighter,
  MessageCircle,
  Plus,
  Check,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";
import { CartButton } from "../../components/CartButton";
import { useCartStore } from "../../stores/cartStore";
import { useReaderStore } from "../../stores/readerStore";
import ManuscriptReader from "../../components/ManuscriptReader";
import { FadeInView, ScaleInView, ScaleButton } from "../../components/animations";
import { api } from "../../services/api";
import { LOCAL_HADITHS } from "../../data/hadiths";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmall = SCREEN_WIDTH < 360;

const ICON_MAP = {
  Moon,
  Church,
  Feather,
  BookOpen,
};

export default function BookDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [saved, setSaved] = useState(false);
  const [fontLevel, setFontLevel] = useState(1);
  const [theme, setTheme] = useState(0);
  const [highlighted, setHighlighted] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const { addItem, getItem } = useCartStore();
  const { bookmarks, toggleBookmark } = useReaderStore();
  const isBookmarked = bookmarks.some((b) => b.bookId === String(id));

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hadithPreview, setHadithPreview] = useState([]);

  useEffect(() => {
    api.getBook(id).then(setBook).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (book?.sacredType === "hadith" && book.bookSlug) {
      api.getHadiths({ book: book.bookSlug, limit: 4 }).then((res) => {
        if (res.hadiths?.length) setHadithPreview(res.hadiths);
      }).catch(() => {
        const local = LOCAL_HADITHS.filter((h) => h.book === book.bookSlug);
        if (local.length) setHadithPreview(local.slice(0, 4));
      });
    }
  }, [book]);

  const fontSizes = [13, 15, 18];
  const fontSize = fontSizes[fontLevel];

  const handleAddToCart = useCallback(() => {
    if (!book) return;
    addItem({
      bookId: book._id || String(id),
      title: book.title,
      titleAm: book.titleAm,
      author: book.author,
      price: book.price,
      coverColor: book.color,
      iconName: book.iconName || 'BookOpen',
      category: book.category,
    });
  }, [book, id, addItem]);

  const handleShare = useCallback(() => {
    if (!book) return;
    Share.share({
      message: `${book.title} — ${book.titleAm}\n\n${book.description}\n\nRead more on ንባብ ቤት`,
      title: book.title,
    });
  }, [book]);

  const handleToggleFont = useCallback(() => {
    setFontLevel((prev) => (prev + 1) % 3);
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev + 1) % 3);
  }, []);

  const handleToggleHighlight = useCallback(() => {
    setHighlighted((prev) => !prev);
  }, []);

  const handleToggleBookmark = useCallback(() => {
    if (!book) return;
    toggleBookmark({
      bookId: book._id || String(id),
      verseNumber: Math.round(book.pages * (book.progress || 0)),
      chapterNumber: 1,
      label: book.title,
    });
    Alert.alert(isBookmarked ? "Removed" : "Bookmarked", isBookmarked ? "Bookmark removed" : "Added to your bookmarks");
  }, [book, id, isBookmarked, toggleBookmark]);

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: COLORS.muted, fontFamily: "CrimsonPro_400Regular", fontSize: 16 }}>Book not found</Text>
      </View>
    );
  }

  const isInCart = getItem(String(id));
  const Icon = ICON_MAP[book.iconName] || BookOpen;
  const themes = [
    { bg: COLORS.bg, text: COLORS.white, label: "Dark" },
    { bg: "#F5E6C8", text: "#2A1A0A", label: "Sepia" },
    { bg: "#FFFFFF", text: "#1A1A1A", label: "Light" },
  ];
  const currentTheme = themes[theme];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient
        colors={["#12144A22", "#0B0C1A"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Hero Header */}
      <FadeInView>
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: SPACING.xl,
          paddingBottom: SPACING.lg,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ScaleButton onPress={() => router.back()}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: COLORS.card,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
            }}
          >
            <ArrowLeft color={COLORS.gold} size={20} strokeWidth={2} />
          </View>
        </ScaleButton>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <ScaleButton onPress={handleShare}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: COLORS.card,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
            }}
          >
            <Share2 color={COLORS.mutedLight} size={18} />
          </View>
          </ScaleButton>
          <ScaleButton onPress={() => setSaved(!saved)}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: saved ? COLORS.gold + "22" : COLORS.card,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: saved ? COLORS.gold : COLORS.cardBorder,
            }}
          >
            <Heart
              color={saved ? COLORS.gold : COLORS.mutedLight}
              size={18}
              fill={saved ? COLORS.gold : "none"}
              strokeWidth={2}
            />
          </View>
          </ScaleButton>
          <CartButton onPress={() => router.push("/cart")} />
        </View>
      </View>
      </FadeInView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Book Cover */}
        <ScaleInView delay={100}>
        <View
          style={{
            alignItems: "center",
            paddingVertical: SPACING.xl,
          }}
        >
          <LinearGradient
            colors={[book.color, "#1A1B3A"]}
            style={{
              width: 180,
              height: 260,
              borderRadius: RADIUS.md,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: COLORS.gold + "60",
              ...SHADOWS.gold,
            }}
          >
            <Icon color={COLORS.gold} size={64} strokeWidth={1.2} />
            <View
              style={{
                position: "absolute",
                bottom: 24,
                left: 16,
                right: 16,
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: "CrimsonPro_700Bold",
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 4,
                }}
              >
                {book.titleAm}
              </Text>
              <Text
                style={{
                  color: COLORS.gold,
                  fontFamily: "CrimsonPro_400Regular",
                  fontSize: 11,
                  textAlign: "center",
                  letterSpacing: 1,
                }}
              >
                {book.author.toUpperCase()}
              </Text>
            </View>
          </LinearGradient>
        </View>
        </ScaleInView>

        {/* Book Info */}
        <FadeInView delay={200}>
        <View
          style={{
            paddingHorizontal: SPACING.xl,
            alignItems: "center",
            marginBottom: SPACING.xl,
          }}
        >
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 26,
              color: COLORS.white,
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            {book.title}
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 16,
              color: COLORS.gold,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            {book.titleAm} · {book.author}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: COLORS.card,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: RADIUS.pill,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
            }}
          >
            <Star color={COLORS.gold} size={14} fill={COLORS.gold} />
            <Text
              style={{
                color: COLORS.gold,
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 13,
              }}
            >
              {book.rating}
            </Text>
            <View
              style={{
                width: 1,
                height: 12,
                backgroundColor: COLORS.cardBorder,
              }}
            />
            <Text
              style={{
                color: COLORS.muted,
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 12,
              }}
            >
              {book.pages} pages · {book.chapters} chapters
            </Text>
          </View>
        </View>
        </FadeInView>

        {/* Description */}
        <FadeInView delay={400}>
        <View
          style={{
            marginHorizontal: SPACING.xl,
            marginBottom: SPACING.lg,
          }}
        >
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 18,
              color: COLORS.white,
              marginBottom: 8,
            }}
          >
            About this book
          </Text>
          <Text
            style={{
              color: COLORS.mutedLight,
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            {book.description}
          </Text>
        </View>
        </FadeInView>

        {book.sacredType === "hadith" ? (
          <FadeInView delay={500}>
          <View style={{ marginHorizontal: SPACING.xl, marginBottom: SPACING.lg }}>
            <Text style={{ fontFamily: "CrimsonPro_700Bold", fontSize: 18, color: COLORS.white, marginBottom: SPACING.md }}>
              Browse Hadiths
            </Text>
            <Text style={{ color: COLORS.mutedLight, fontFamily: "CrimsonPro_400Regular", fontSize: 12, lineHeight: 18 }}>
              Browse authentic hadiths from {book.title} with Arabic text, English translations, and auto-translate to Amharic.
            </Text>
          </View>
          </FadeInView>
        ) : (
          <FadeInView delay={500}>
          <View
            style={{
              marginHorizontal: SPACING.xl,
              marginBottom: SPACING.lg,
            }}
          >
            <Text
              style={{
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 18,
                color: COLORS.white,
                marginBottom: SPACING.md,
              }}
            >
              Reading Tools
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: SPACING.md,
                marginBottom: SPACING.md,
              }}
            >
              <ScaleButton onPress={handleToggleFont} style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: COLORS.card,
                  borderRadius: RADIUS.md,
                  padding: SPACING.md,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.cardBorder,
                }}
              >
                <Type color={COLORS.gold} size={18} strokeWidth={1.5} />
                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 10,
                    marginTop: 4,
                    fontFamily: "CrimsonPro_400Regular",
                  }}
                >
                  Font
                </Text>
                <Text
                  style={{
                    color: COLORS.goldDim,
                    fontSize: 8,
                    marginTop: 1,
                    fontFamily: "CrimsonPro_400Regular",
                  }}
                >
                  {["S", "M", "L"][fontLevel]}
                </Text>
              </View>
              </ScaleButton>
              <ScaleButton onPress={handleToggleTheme} style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: COLORS.card,
                  borderRadius: RADIUS.md,
                  padding: SPACING.md,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.cardBorder,
                }}
              >
                {theme === 0 ? (
                  <Sun color={COLORS.gold} size={18} strokeWidth={1.5} />
                ) : (
                  <MoonIcon color={COLORS.gold} size={18} strokeWidth={1.5} />
                )}
                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 10,
                    marginTop: 4,
                    fontFamily: "CrimsonPro_400Regular",
                  }}
                >
                  Theme
                </Text>
                <Text
                  style={{
                    color: COLORS.goldDim,
                    fontSize: 8,
                    marginTop: 1,
                    fontFamily: "CrimsonPro_400Regular",
                  }}
                >
                  {["Dark", "Sepia", "Light"][theme]}
                </Text>
              </View>
              </ScaleButton>
              <ScaleButton onPress={handleToggleHighlight} style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: highlighted ? COLORS.gold + "22" : COLORS.card,
                  borderRadius: RADIUS.md,
                  padding: SPACING.md,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: highlighted ? COLORS.gold : COLORS.cardBorder,
                }}
              >
                <Highlighter
                  color={COLORS.gold}
                  size={18}
                  strokeWidth={1.5}
                />
                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 10,
                    marginTop: 4,
                    fontFamily: "CrimsonPro_400Regular",
                  }}
                >
                  Highlight
                </Text>
                <Text
                  style={{
                    color: highlighted ? COLORS.gold : COLORS.goldDim,
                    fontSize: 8,
                    marginTop: 1,
                    fontFamily: "CrimsonPro_400Regular",
                  }}
                >
                  {highlighted ? "On" : "Off"}
                </Text>
              </View>
              </ScaleButton>
              <ScaleButton onPress={handleToggleBookmark} style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: isBookmarked ? COLORS.gold + "22" : COLORS.card,
                  borderRadius: RADIUS.md,
                  padding: SPACING.md,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: isBookmarked ? COLORS.gold : COLORS.cardBorder,
                }}
              >
                <Bookmark
                  color={COLORS.gold}
                  size={18}
                  strokeWidth={1.5}
                  fill={isBookmarked ? COLORS.gold : "none"}
                />
                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 10,
                    marginTop: 4,
                    fontFamily: "CrimsonPro_400Regular",
                  }}
                >
                  Bookmark
                </Text>
                <Text
                  style={{
                    color: isBookmarked ? COLORS.gold : COLORS.goldDim,
                    fontSize: 8,
                    marginTop: 1,
                    fontFamily: "CrimsonPro_400Regular",
                  }}
                >
                  {isBookmarked ? "Saved" : "Add"}
                </Text>
              </View>
              </ScaleButton>
            </View>
          </View>
          </FadeInView>
        )}

        {/* Sample / Hadith Preview */}
        <FadeInView delay={600}>
        {book.sacredType === "hadith" && hadithPreview.length > 0 ? (
          <View style={{ marginHorizontal: SPACING.xl, marginBottom: SPACING.lg }}>
            <Text style={{ fontFamily: "CrimsonPro_700Bold", fontSize: 18, color: COLORS.white, marginBottom: SPACING.md }}>
              Preview Hadiths
            </Text>
            {hadithPreview.map((h) => (
              <View key={h._id} style={{
                backgroundColor: "#1A1520", borderRadius: RADIUS.md,
                borderWidth: 1, borderColor: "#3A2A30", padding: 14, marginBottom: 10,
              }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 8, color: `${COLORS.gold}55`, textTransform: "uppercase", letterSpacing: 1 }}>
                    {h.chapter}
                  </Text>
                  <Text style={{ fontSize: 9, color: `${COLORS.gold}88` }}>#{h.hadithNumber}</Text>
                </View>
                <Text style={{
                  fontSize: isSmall ? 16 : 20, lineHeight: isSmall ? 24 : 32,
                  color: "#E8DCC8", textAlign: "right", marginBottom: 8, fontWeight: "500",
                }}>
                  {h.arabic}
                </Text>
                <View style={{ height: 1, backgroundColor: "#2A1E28", marginBottom: 8 }} />
                {h.english ? (
                  <Text style={{ fontSize: 12, color: "#C8BFA0", lineHeight: 18, fontStyle: "italic" }}>
                    "{h.english}"
                  </Text>
                ) : null}
                {h.amharic ? (
                  <Text style={{ fontSize: 12, color: "#A89880", lineHeight: 18, marginTop: 4 }}>
                    {h.amharic}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              marginHorizontal: SPACING.xl,
              padding: SPACING.lg,
              backgroundColor: currentTheme.bg,
              borderRadius: RADIUS.lg,
              borderStyle: "dashed",
              borderWidth: 1.5,
              borderColor: highlighted ? COLORS.gold : COLORS.gold + "60",
              marginBottom: SPACING.lg,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MessageCircle color={COLORS.gold} size={14} />
                <Text
                  style={{
                    color: COLORS.gold,
                    fontFamily: "CrimsonPro_700Bold",
                    fontSize: 13,
                    marginLeft: 6,
                  }}
                >
                  Preview
                </Text>
              </View>
              {highlighted && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: COLORS.gold + "22",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: RADIUS.pill,
                  }}
                >
                  <Check color={COLORS.gold} size={10} strokeWidth={2.5} />
                  <Text
                    style={{
                      color: COLORS.gold,
                      fontFamily: "CrimsonPro_700Bold",
                      fontSize: 9,
                    }}
                  >
                    Highlighted
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                color: currentTheme.text,
                fontFamily: "CrimsonPro_400Regular",
                fontSize: fontSize,
                lineHeight: fontSize * 1.6,
                fontStyle: "italic",
                backgroundColor: highlighted ? COLORS.gold + "18" : "transparent",
                paddingHorizontal: highlighted ? 4 : 0,
                borderRadius: 2,
              }}
            >
              "{book.sample}"
            </Text>
          </View>
        )}
        </FadeInView>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: SPACING.xl,
          paddingTop: SPACING.md,
          paddingBottom: insets.bottom + SPACING.lg,
          backgroundColor: COLORS.bgElevated,
          borderTopWidth: 1,
          borderTopColor: COLORS.cardBorder,
          gap: SPACING.sm,
        }}
      >
        {/* Main CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setReaderOpen(true)}
          style={{
            width: "100%",
            height: 54,
            borderRadius: RADIUS.md,
            backgroundColor: COLORS.gold,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
            ...SHADOWS.gold,
          }}
        >
          <BookOpen color={COLORS.bg} size={18} strokeWidth={2} />
          <Text
            style={{
              color: COLORS.bg,
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 17,
              letterSpacing: 0.5,
            }}
          >
            {book.sacredType === "hadith" ? "Browse Hadiths" : book.progress > 0 ? "Continue Reading" : "Start Reading"}
          </Text>
        </TouchableOpacity>

        {/* Secondary actions */}
        <View
          style={{
            flexDirection: "row",
            gap: SPACING.md,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              height: 40,
              borderRadius: RADIUS.md,
              backgroundColor: COLORS.card,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 6,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
            }}
          >
            <Download color={COLORS.muted} size={14} strokeWidth={1.8} />
            <Text
              style={{
                color: COLORS.muted,
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 12,
              }}
            >
              Download
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleAddToCart}
            style={{
              flex: 1,
              height: 40,
              borderRadius: RADIUS.md,
              backgroundColor: isInCart ? COLORS.gold + "22" : COLORS.card,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 6,
              borderWidth: 1,
              borderColor: isInCart ? COLORS.gold : COLORS.cardBorder,
            }}
          >
            <Plus
              color={isInCart ? COLORS.gold : COLORS.muted}
              size={14}
              strokeWidth={2}
            />
            <Text
              style={{
                color: isInCart ? COLORS.gold : COLORS.muted,
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 12,
              }}
            >
              {isInCart ? "In Cart" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {readerOpen && (
        <View style={StyleSheet.absoluteFill}>
          <ManuscriptReader
            bookId={String(id === 1 ? 'quran' : id === 2 ? 'bible' : 'bible')}
            hadithSlug={book.sacredType === "hadith" ? book.bookSlug : undefined}
            hadithTitle={book.sacredType === "hadith" ? book.title : undefined}
            onBack={() => setReaderOpen(false)}
          />
        </View>
      )}
    </View>
  );
}
