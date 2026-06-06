import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  BookOpen,
  Moon,
  Church,
  Feather,
  Heart,
  Star,
  ChevronRight,
  Download,
  Check,
  SlidersHorizontal,
  Menu as MenuIcon,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";
import HamburgerMenu from "../../components/HamburgerMenu";

const TABS = ["All", "Islamic", "Christianity", "Philosophy", "Fiction"];

const BOOKS = [
  {
    id: 1,
    title: "The Holy Quran",
    titleAm: "ቅዱስ ቁርአን",
    author: "Allah's Revelation",
    category: "Islamic",
    pages: 604,
    downloaded: true,
    rating: 5,
    icon: Moon,
  },
  {
    id: 2,
    title: "Tafsir Ibn Kathir",
    titleAm: "ተፍሲር",
    author: "Ibn Kathir",
    category: "Islamic",
    pages: 890,
    downloaded: false,
    rating: 4.8,
    icon: Moon,
  },
  {
    id: 3,
    title: "Sahih Al-Bukhari",
    titleAm: "ሐዲስ",
    author: "Al-Bukhari",
    category: "Islamic",
    pages: 1200,
    downloaded: true,
    rating: 4.9,
    icon: Moon,
  },
  {
    id: 4,
    title: "The Holy Bible",
    titleAm: "ቅዱስ መጽሐፍ",
    author: "Holy Scripture",
    category: "Christianity",
    pages: 1189,
    downloaded: true,
    rating: 5,
    icon: Church,
  },
  {
    id: 5,
    title: "Book of Enoch",
    titleAm: "የሄኖክ መጽሐፍ",
    author: "Ancient Text",
    category: "Christianity",
    pages: 340,
    downloaded: false,
    rating: 4.6,
    icon: Church,
  },
  {
    id: 6,
    title: "Meditations",
    titleAm: "ሥነ አዕምሮ",
    author: "Marcus Aurelius",
    category: "Philosophy",
    pages: 254,
    downloaded: true,
    rating: 4.7,
    icon: Feather,
  },
  {
    id: 7,
    title: "The Republic",
    titleAm: "ሪፐብሊክ",
    author: "Plato",
    category: "Philosophy",
    pages: 416,
    downloaded: false,
    rating: 4.5,
    icon: Feather,
  },
  {
    id: 8,
    title: "Thus Spoke Zarathustra",
    titleAm: "ዛራቱስትራ",
    author: "Nietzsche",
    pages: 352,
    downloaded: false,
    rating: 4.3,
    icon: Feather,
  },
  {
    id: 9,
    title: "Fiqr Eske Mekabir",
    titleAm: "ፍቅር እስከ መቃብር",
    author: "Haddis Alemayehu",
    category: "Fiction",
    pages: 448,
    downloaded: true,
    rating: 4.9,
    icon: BookOpen,
  },
  {
    id: 10,
    title: "Oromay",
    titleAm: "ኦሮማይ",
    author: "Berhane Zerihun",
    category: "Fiction",
    pages: 310,
    downloaded: false,
    rating: 4.7,
    icon: BookOpen,
  },
];

function StarField() {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    top: Math.random() * 200,
    left: Math.random() * 400,
    size: 2,
    opacity: 0.15 + Math.random() * 0.3,
  }));
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((s) => (
        <View
          key={s.id}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            borderRadius: 1,
            backgroundColor: COLORS.gold,
            opacity: s.opacity,
          }}
        />
      ))}
    </View>
  );
}

function BookCard({ book, onPress, onToggleSaved, saved }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        flexDirection: "row",
        alignItems: "center",
        ...SHADOWS.card,
      }}
    >
      <LinearGradient
        colors={["#2A2B5A", "#1A1B3A"]}
        style={{
          width: 60,
          height: 84,
          borderRadius: RADIUS.md,
          justifyContent: "center",
          alignItems: "center",
          marginRight: SPACING.lg,
          borderWidth: 1,
          borderColor: COLORS.gold + "30",
        }}
      >
        <book.icon color={COLORS.gold} size={26} strokeWidth={1.5} />
        {book.downloaded && (
          <View
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              backgroundColor: COLORS.gold,
              borderRadius: 10,
              padding: 2,
            }}
          >
            <Check color={COLORS.bg} size={8} strokeWidth={3} />
          </View>
        )}
      </LinearGradient>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "CrimsonPro_700Bold",
            fontSize: 16,
            color: COLORS.white,
            marginBottom: 1,
          }}
        >
          {book.title}
        </Text>
        <Text
          style={{
            fontFamily: "CrimsonPro_400Regular",
            fontSize: 12,
            color: COLORS.gold,
            marginBottom: 2,
          }}
        >
          {book.titleAm}
        </Text>
        <Text
          style={{
            fontFamily: "CrimsonPro_400Regular",
            fontSize: 12,
            color: COLORS.muted,
            marginBottom: 6,
          }}
        >
          {book.author} · {book.pages} pages
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <Star color={COLORS.gold} size={11} fill={COLORS.gold} />
          <Text
            style={{
              color: COLORS.gold,
              fontSize: 11,
              fontFamily: "CrimsonPro_400Regular",
            }}
          >
            {book.rating}
          </Text>
          <View
            style={{
              width: 1,
              height: 10,
              backgroundColor: COLORS.cardBorder,
              marginHorizontal: 6,
            }}
          />
          <Text
            style={{
              color: COLORS.muted,
              fontSize: 11,
              fontFamily: "CrimsonPro_400Regular",
            }}
          >
            {book.category}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: "center", gap: 10 }}>
        <TouchableOpacity onPress={onToggleSaved} activeOpacity={0.7}>
          <Heart
            color={saved ? COLORS.gold : COLORS.muted}
            size={18}
            fill={saved ? COLORS.gold : "none"}
            strokeWidth={1.8}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={{
            backgroundColor: book.downloaded ? COLORS.accent : COLORS.gold,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: RADIUS.sm,
            borderWidth: 1,
            borderColor: book.downloaded
              ? COLORS.gold + "60"
              : COLORS.goldLight,
          }}
        >
          {book.downloaded ? (
            <Text
              style={{
                color: COLORS.gold,
                fontSize: 10,
                fontFamily: "CrimsonPro_700Bold",
                letterSpacing: 0.5,
              }}
            >
              READ
            </Text>
          ) : (
            <Download color={COLORS.bg} size={14} strokeWidth={2.5} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [savedIds, setSavedIds] = useState(new Set([1, 4, 6, 9]));
  const [menuOpen, setMenuOpen] = useState(false);

  if (!fontsLoaded) return null;

  const filtered =
    activeTab === "All" ? BOOKS : BOOKS.filter((b) => b.category === activeTab);

  const toggleSaved = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient
        colors={["#12144A18", "#0B0C1A"]}
        style={StyleSheet.absoluteFill}
      />
      <StarField />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: SPACING.xl,
          paddingBottom: SPACING.lg,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
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
            marginRight: SPACING.md,
          }}
        >
          <MenuIcon color={COLORS.gold} size={20} strokeWidth={2} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 13,
              color: COLORS.muted,
              letterSpacing: 3,
            }}
          >
            YOUR COLLECTION
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 28,
              color: COLORS.white,
              marginTop: 4,
            }}
          >
            Library
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 14,
              color: COLORS.gold,
            }}
          >
            ቤተ መጻሕፍት
          </Text>
        </View>
      </View>

      {/* Stats bar */}
      <View
        style={{
          paddingHorizontal: SPACING.xl,
          flexDirection: "row",
          gap: SPACING.md,
          marginBottom: SPACING.xl,
        }}
      >
        {[
          { label: "Total Books", value: BOOKS.length },
          {
            label: "Downloaded",
            value: BOOKS.filter((b) => b.downloaded).length,
          },
          { label: "Categories", value: 4 },
        ].map((s, i) => (
          <View
            key={i}
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
            <Text
              style={{
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 20,
                color: COLORS.gold,
              }}
            >
              {s.value}
            </Text>
            <Text
              style={{
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 10,
                color: COLORS.muted,
                textAlign: "center",
                marginTop: 2,
              }}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, marginBottom: SPACING.lg }}
        contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: 10 }}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: SPACING.lg,
              paddingVertical: 8,
              borderRadius: RADIUS.pill,
              backgroundColor: activeTab === tab ? COLORS.gold : COLORS.card,
              borderWidth: 1,
              borderColor: activeTab === tab ? COLORS.gold : COLORS.cardBorder,
            }}
          >
            <Text
              style={{
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 13,
                color: activeTab === tab ? COLORS.bg : COLORS.muted,
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Book List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: SPACING.xl,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: SPACING.lg,
          }}
        >
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 13,
              color: COLORS.muted,
            }}
          >
            {filtered.length} books found
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: RADIUS.pill,
              backgroundColor: COLORS.card,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
              gap: 4,
            }}
          >
            <SlidersHorizontal color={COLORS.gold} size={12} />
            <Text
              style={{
                color: COLORS.gold,
                fontSize: 12,
                fontFamily: "CrimsonPro_700Bold",
              }}
            >
              Sort by Rating
            </Text>
          </TouchableOpacity>
        </View>

        {filtered.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            saved={savedIds.has(book.id)}
            onPress={() => router.push(`/book/${book.id}`)}
            onToggleSaved={() => toggleSaved(book.id)}
          />
        ))}
      </ScrollView>

      <HamburgerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
