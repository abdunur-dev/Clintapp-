import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";

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
  const [fontSize, setFontSize] = useState(0);
  const [theme, setTheme] = useState(0);

  if (!fontsLoaded) return null;

  const book = BOOKS_DATA[id] || BOOKS_DATA[1];
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
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
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
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.7}
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
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSaved(!saved)}
            activeOpacity={0.7}
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
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Book Cover */}
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

        {/* Book Info */}
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

        {/* Progress */}
        <View
          style={{
            marginHorizontal: SPACING.xl,
            padding: SPACING.lg,
            backgroundColor: COLORS.card,
            borderRadius: RADIUS.lg,
            borderWidth: 1,
            borderColor: COLORS.cardBorder,
            marginBottom: SPACING.lg,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: COLORS.muted,
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 12,
              }}
            >
              Your progress
            </Text>
            <Text
              style={{
                color: COLORS.gold,
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 12,
              }}
            >
              {Math.round(book.progress * 100)}% complete
            </Text>
          </View>
          <View
            style={{
              height: 6,
              backgroundColor: COLORS.accent,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${book.progress * 100}%`,
                height: "100%",
                backgroundColor: COLORS.gold,
                borderRadius: 3,
              }}
            />
          </View>
          <Text
            style={{
              color: COLORS.mutedLight,
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 12,
              marginTop: 6,
            }}
          >
            Page {Math.round(book.pages * book.progress)} of {book.pages}
          </Text>
        </View>

        {/* Description */}
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

        {/* Reading Tools */}
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
            {[
              { icon: Type, label: "Font Size" },
              { icon: theme === 0 ? Sun : MoonIcon, label: "Theme" },
              { icon: Highlighter, label: "Highlight" },
              { icon: Bookmark, label: "Bookmark" },
            ].map((tool, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: COLORS.card,
                  borderRadius: RADIUS.md,
                  padding: SPACING.md,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.cardBorder,
                }}
              >
                <tool.icon color={COLORS.gold} size={18} strokeWidth={1.5} />
                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 10,
                    marginTop: 4,
                    fontFamily: "CrimsonPro_400Regular",
                  }}
                >
                  {tool.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sample */}
        <View
          style={{
            marginHorizontal: SPACING.xl,
            padding: SPACING.lg,
            backgroundColor: "#1A1B38",
            borderRadius: RADIUS.lg,
            borderStyle: "dashed",
            borderWidth: 1.5,
            borderColor: COLORS.gold + "60",
            marginBottom: SPACING.lg,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
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
          <Text
            style={{
              color: COLORS.mutedLight,
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 15,
              lineHeight: 24,
              fontStyle: "italic",
            }}
          >
            "{book.sample}"
          </Text>
        </View>
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
          backgroundColor: COLORS.bg,
          borderTopWidth: 1,
          borderTopColor: COLORS.cardBorder,
          flexDirection: "row",
          gap: SPACING.md,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: COLORS.card,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: COLORS.cardBorder,
          }}
        >
          <Download color={COLORS.gold} size={20} strokeWidth={1.8} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // Start reading
          }}
          style={{
            flex: 1,
            height: 56,
            borderRadius: 28,
            backgroundColor: COLORS.gold,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
            ...SHADOWS.gold,
          }}
        >
          <BookOpen color={COLORS.bg} size={18} strokeWidth={2} />
          <Text
            style={{
              color: COLORS.bg,
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 16,
              letterSpacing: 0.5,
            }}
          >
            {book.progress > 0 ? "Continue Reading" : "Start Reading"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
