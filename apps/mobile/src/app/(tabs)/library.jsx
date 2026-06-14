import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
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
  Download,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";
import { api, getImageUrl } from "../../services/api";

const SAVED_KEY = "library-saved-ids";

const CATEGORIES = ["All", "Islamic", "Hadith", "Christianity", "Philosophy", "Fiction"];

const SECTION_CONFIG = {
  Islamic: { icon: Moon, categories: ["Islamic"], includeHadith: true },
  Hadith: { icon: Moon, categories: [], includeHadith: true },
  Christianity: { icon: Church, categories: ["Christianity"], includeHadith: false },
  Philosophy: { icon: Feather, categories: ["Philosophy"], includeHadith: false },
  Fiction: { icon: BookOpen, categories: ["Fiction"], includeHadith: false },
};

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
  const coverSrc = getImageUrl(book.coverUrl);
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
      {coverSrc ? (
        <Image source={{ uri: coverSrc }} style={{ width: 60, height: 84, borderRadius: RADIUS.md, marginRight: SPACING.lg }} resizeMode="cover" />
      ) : (
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
      )}

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
          {saved && (
            <>
              <View
                style={{
                  width: 1,
                  height: 10,
                  backgroundColor: COLORS.cardBorder,
                  marginHorizontal: 4,
                }}
              />
              <Heart color={COLORS.gold} size={10} fill={COLORS.gold} strokeWidth={2} />
            </>
          )}
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

function SectionHeader({ title, icon: Icon, count }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: SPACING.md,
        marginTop: SPACING.xl,
      }}
    >
      <Icon color={COLORS.gold} size={16} strokeWidth={1.5} />
      <Text
        style={{
          fontFamily: "CrimsonPro_700Bold",
          fontSize: 15,
          color: COLORS.white,
          letterSpacing: 1,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: COLORS.cardBorder,
          marginLeft: 8,
        }}
      />
      <Text
        style={{
          fontFamily: "CrimsonPro_400Regular",
          fontSize: 11,
          color: COLORS.muted,
        }}
      >
        {count}
      </Text>
    </View>
  );
}

function filterBooksForSection(books, sectionKey) {
  const cfg = SECTION_CONFIG[sectionKey];
  if (!cfg) return [];
  return books.filter((b) => {
    const inCategory = cfg.categories.includes(b.category);
    const isHadith = b.sacredType === "hadith";
    if (cfg.includeHadith && isHadith) return true;
    return inCategory;
  });
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeCat, setActiveCat] = useState("All");
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());
  const [books, setBooks] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getBooks(),
      AsyncStorage.getItem(SAVED_KEY).then((data) => {
        if (data) setSavedIds(new Set(JSON.parse(data)));
      }),
    ])
      .then(([allBooks]) => setBooks(allBooks))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const persistSaved = useCallback((ids) => {
    AsyncStorage.setItem(SAVED_KEY, JSON.stringify([...ids])).catch(() => {});
  }, []);

  const toggleSaved = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persistSaved(next);
      return next;
    });
  };

  if (!fontsLoaded) return null;

  const sectionsToRender = activeCat === "All"
    ? ["Islamic", "Hadith", "Christianity", "Philosophy", "Fiction"]
    : [activeCat];

  const uniqueBooks = new Map();
  books.forEach((b) => uniqueBooks.set(b._id, b));

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
          CATALOG
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

      <View
        style={{
          paddingHorizontal: SPACING.xl,
          flexDirection: "row",
          gap: SPACING.md,
          marginBottom: SPACING.xl,
        }}
      >
        {[
          { label: "Total Books", value: uniqueBooks.size },
          { label: "Favorites", value: [...savedIds].length },
          { label: "Categories", value: 5 },
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, marginBottom: SPACING.lg }}
        contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: 10 }}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCat(cat)}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: SPACING.lg,
              paddingVertical: 8,
              borderRadius: RADIUS.pill,
              backgroundColor: activeCat === cat ? COLORS.gold : COLORS.card,
              borderWidth: 1,
              borderColor: activeCat === cat ? COLORS.gold : COLORS.cardBorder,
            }}
          >
            <Text
              style={{
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 13,
                color: activeCat === cat ? COLORS.bg : COLORS.muted,
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: SPACING.xl,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {sectionsToRender.map((sectionKey) => {
          const sectionBooks = filterBooksForSection([...uniqueBooks.values()], sectionKey);
          if (sectionBooks.length === 0) return null;
          const cfg = SECTION_CONFIG[sectionKey];
          return (
            <View key={sectionKey}>
              <SectionHeader
                title={sectionKey}
                icon={cfg.icon}
                count={sectionBooks.length}
              />
              {sectionBooks.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  saved={savedIds.has(book._id)}
                  onPress={() => router.push(`/book/${book._id}`)}
                  onToggleSaved={() => toggleSaved(book._id)}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
