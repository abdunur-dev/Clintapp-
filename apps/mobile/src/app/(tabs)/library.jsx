import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
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
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";
import api from "../../services/api";

const TABS = ["All", "Islamic", "Christianity", "Philosophy", "Fiction"];

const ICON_MAP = { Moon, Church, Feather, BookOpen };

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
  const IconComponent = ICON_MAP[book.iconName] || BookOpen;
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
        <IconComponent color={COLORS.gold} size={26} strokeWidth={1.5} />
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
            backgroundColor: COLORS.gold,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: RADIUS.sm,
            borderWidth: 1,
            borderColor: COLORS.goldLight,
          }}
        >
          <Download color={COLORS.bg} size={14} strokeWidth={2.5} />
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
  const [savedIds, setSavedIds] = useState(new Set());
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBooks().then(setBooks).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (!fontsLoaded) return null;

  const filtered =
    activeTab === "All" ? books : books.filter((b) => b.category === activeTab);

  const toggleSaved = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    );
  }

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
        }}
      >
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
          { label: "Total Books", value: books.length },
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
            key={book._id}
            book={book}
            saved={savedIds.has(book._id)}
            onPress={() => router.push(`/book/${book._id}`)}
            onToggleSaved={() => toggleSaved(book._id)}
          />
        ))}
      </ScrollView>

    </View>
  );
}
