import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  Alert,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BOOKS_DATA = {
  1: {
    id: 1,
    title: "Quran — Amharic",
    titleAm: "ቅዱስ ቁርአን",
    author: "Translation",
    category: "Islamic",
    pages: 604,
    rating: 5,
    icon: Moon,
    color: "#4A8C5C",
    description:
      "The Holy Qur'an in Amharic translation. A guide for those who are conscious of Allah, with verses that bring peace and guidance to the soul.",
    progress: 0.34,
    sample: "በስመ አላህ በጣም ቸር በጣም አዛኝ። ሁሉንም ምስጋና የአለማችን ጌታ ለአላህ ይገባል። በመጨረሻው ቀን ባለቤት።",
    chapters: 114,
  },
  2: {
    id: 2,
    title: "The Bible — Amharic",
    titleAm: "ቅዱስ መጽሐፍ",
    author: "Holy Scripture",
    category: "Christianity",
    pages: 1189,
    rating: 5,
    icon: Church,
    color: "#5C6A9A",
    description:
      "The Holy Bible in Amharic, containing the Old and New Testaments. A sacred text of faith, hope, and divine love.",
    progress: 0.12,
    sample: "መጀመሪያ ነገሥት ነበረ ቃሉ፥ ቃሉም ከእግዚአብሔር ጋር ነበረ፥ ቃሉም እግዚአብሔር ነበረ።",
    chapters: 66,
  },
  3: {
    id: 3,
    title: "Meditations",
    titleAm: "ሥነ አዕምሮ",
    author: "Marcus Aurelius",
    category: "Philosophy",
    pages: 254,
    rating: 4.7,
    icon: Feather,
    color: "#8C6A3A",
    description:
      "Personal writings of the Roman Emperor Marcus Aurelius, reflecting on Stoic philosophy and the nature of the human mind.",
    progress: 0.65,
    sample: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    chapters: 12,
  },
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

  const fontSizes = [13, 15, 18];
  const fontSize = fontSizes[fontLevel];

  const handleAddToCart = useCallback(() => {
    addItem({
      bookId: String(id || 1),
      title: BOOKS_DATA[id]?.title || BOOKS_DATA[1].title,
      titleAm: BOOKS_DATA[id]?.titleAm || BOOKS_DATA[1].titleAm,
      author: BOOKS_DATA[id]?.author || BOOKS_DATA[1].author,
      price: 299,
      coverColor: BOOKS_DATA[id]?.color || BOOKS_DATA[1].color,
      iconName: (BOOKS_DATA[id]?.icon || BOOKS_DATA[1].icon).displayName || 'BookOpen',
      category: BOOKS_DATA[id]?.category || BOOKS_DATA[1].category,
    });
  }, [id, addItem]);

  const handleShare = useCallback(() => {
    Share.share({
      message: `${BOOKS_DATA[id]?.title || BOOKS_DATA[1].title} — ${BOOKS_DATA[id]?.titleAm || BOOKS_DATA[1].titleAm}\n\n${BOOKS_DATA[id]?.description || BOOKS_DATA[1].description}\n\nRead more on ንባብ ቤት`,
      title: BOOKS_DATA[id]?.title || BOOKS_DATA[1].title,
    });
  }, [id]);

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
    const b = BOOKS_DATA[id] || BOOKS_DATA[1];
    toggleBookmark({
      bookId: String(id),
      verseNumber: Math.round(b.pages * (b.progress || 0)),
      chapterNumber: 1,
      label: b.title,
    });
    Alert.alert(isBookmarked ? "Removed" : "Bookmarked", isBookmarked ? "Bookmark removed" : "Added to your bookmarks");
  }, [id, isBookmarked, toggleBookmark]);

  if (!fontsLoaded) return null;

  const book = BOOKS_DATA[id] || BOOKS_DATA[1];
  const isInCart = getItem(String(id));
  const Icon = book.icon;
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

        {/* Reading Tools */}
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

        {/* Sample */}
        <FadeInView delay={600}>
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
            {book.progress > 0 ? "Continue Reading" : "Start Reading"}
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
            onBack={() => setReaderOpen(false)}
          />
        </View>
      )}
    </View>
  );
}
