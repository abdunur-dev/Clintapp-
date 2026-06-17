import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Search,
  BookOpen,
  Moon,
  Church,
  Feather,
  X,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";
import { api, getImageUrl } from "../../services/api";

const ICON_MAP = { Moon, Church, Feather, BookOpen };

function StarField() {
  const stars = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    top: Math.random() * 200,
    left: Math.random() * 400,
    size: 2,
    opacity: 0.12 + Math.random() * 0.2,
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

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState(params.q || "");
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBooks().then(setAllBooks).catch(console.error).finally(() => setLoading(false));
  }, []);

  const results =
    query.length > 1
      ? allBooks.filter(
          (b) =>
            b.title.toLowerCase().includes(query.toLowerCase()) ||
            b.titleAm.includes(query) ||
            b.author.toLowerCase().includes(query.toLowerCase()) ||
            b.category.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

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
              marginBottom: 4,
            }}
          >
            DISCOVER
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 28,
              color: COLORS.white,
            }}
          >
            Search
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 14,
              color: COLORS.gold,
            }}
          >
            ፈልግ
          </Text>
      </View>

      {/* Search Input */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.card,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: query.length > 0 ? COLORS.gold : COLORS.cardBorder,
            paddingHorizontal: 14,
            paddingVertical: 12,
            gap: 10,
          }}
        >
          <Search color={COLORS.gold} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search books, authors, or topics"
            placeholderTextColor={COLORS.muted}
            style={{
              flex: 1,
              color: COLORS.white,
              fontSize: 15,
              fontFamily: "CrimsonPro_400Regular",
            }}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <X color={COLORS.muted} size={16} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <ActivityIndicator color={COLORS.gold} size="large" />
          </View>
        ) : query.length > 1 ? (
          <>
            <Text
              style={{
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 13,
                color: COLORS.muted,
                marginBottom: 14,
              }}
            >
              {results.length} result{results.length !== 1 ? "s" : ""} for "
              {query}"
            </Text>
            {results.length === 0 ? (
              <View style={{ alignItems: "center", marginTop: 60 }}>
                <Search color={COLORS.muted} size={48} strokeWidth={1} />
                <Text
                  style={{
                    fontFamily: "CrimsonPro_700Bold",
                    fontSize: 20,
                    color: COLORS.mutedLight,
                    marginTop: 16,
                  }}
                >
                  No results found
                </Text>
                <Text
                  style={{
                    fontFamily: "CrimsonPro_400Regular",
                    fontSize: 14,
                    color: COLORS.muted,
                    marginTop: 6,
                  }}
                >
                  Try a different keyword
                </Text>
              </View>
            ) : (
              results.map((book) => (
                <TouchableOpacity
                  key={book._id}
                  onPress={() => router.push(`/book/${book._id}`)}
                  style={{
                    backgroundColor: COLORS.card,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: COLORS.cardBorder,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {(() => {
                    const coverSrc = getImageUrl(book.coverUrl);
                    if (coverSrc) return <Image source={{ uri: coverSrc }} style={{ width: 48, height: 64, borderRadius: 8, marginRight: 14 }} resizeMode="cover" />;
                    return (
                    <LinearGradient
                      colors={["#2A2B5A", "#1A1B3A"]}
                      style={{
                        width: 48,
                        height: 64,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 14,
                      }}
                    >
                      {React.createElement(ICON_MAP[book.iconName] || BookOpen, { color: COLORS.gold, size: 20, strokeWidth: 1.5 })}
                    </LinearGradient>
                    );
                  })()}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "CrimsonPro_700Bold",
                        fontSize: 15,
                        color: COLORS.white,
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
                      }}
                    >
                      {book.author} · {book.category}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        ) : null}
      </ScrollView>

    </View>
  );
}
