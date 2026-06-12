import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Search,
  BookOpen,
  Moon,
  Church,
  Feather,
  Star,
  X,
  TrendingUp,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";

const ALL_BOOKS = [];

const TRENDING = [];

const POPULAR_CATEGORIES = [];

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
  const [query, setQuery] = useState("");
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });

  if (!fontsLoaded) return null;

  const results =
    query.length > 1
      ? ALL_BOOKS.filter(
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
            placeholder="Search books, authors, topics…"
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
        {query.length > 1 ? (
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
                  key={book.id}
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
                    <book.icon
                      color={COLORS.gold}
                      size={20}
                      strokeWidth={1.5}
                    />
                  </LinearGradient>
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
                      {book.author}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 4,
                      }}
                    >
                      <Star color={COLORS.gold} size={10} fill={COLORS.gold} />
                      <Text
                        style={{
                          color: COLORS.gold,
                          fontSize: 11,
                          fontFamily: "CrimsonPro_400Regular",
                        }}
                      >
                        {book.rating}
                      </Text>
                      <Text
                        style={{
                          color: COLORS.muted,
                          fontSize: 11,
                          fontFamily: "CrimsonPro_400Regular",
                        }}
                      >
                        · {book.category}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        ) : (
          <>
            {/* Trending */}
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <TrendingUp color={COLORS.gold} size={16} />
                <Text
                  style={{
                    fontFamily: "CrimsonPro_700Bold",
                    fontSize: 18,
                    color: COLORS.white,
                  }}
                >
                  Trending
                </Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {TRENDING.map((term, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setQuery(term)}
                    style={{
                      backgroundColor: COLORS.card,
                      borderRadius: 20,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderWidth: 1,
                      borderColor: COLORS.cardBorder,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <TrendingUp color={COLORS.gold} size={12} />
                    <Text
                      style={{
                        fontFamily: "CrimsonPro_400Regular",
                        fontSize: 13,
                        color: COLORS.white,
                      }}
                    >
                      {term}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Browse by Category */}
            <Text
              style={{
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 18,
                color: COLORS.white,
                marginBottom: 14,
              }}
            >
              Browse by Category
            </Text>
            {POPULAR_CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setQuery(cat.label)}
                style={{
                  backgroundColor: COLORS.card,
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: COLORS.cardBorder,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: COLORS.accent,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 14,
                    borderWidth: 1,
                    borderColor: COLORS.cardBorder,
                  }}
                >
                  <cat.icon color={COLORS.gold} size={20} strokeWidth={1.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "CrimsonPro_700Bold",
                      fontSize: 16,
                      color: COLORS.white,
                    }}
                  >
                    {cat.label}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CrimsonPro_400Regular",
                      fontSize: 12,
                      color: COLORS.muted,
                    }}
                  >
                    {cat.count} books
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: COLORS.accent,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.gold,
                      fontSize: 12,
                      fontFamily: "CrimsonPro_700Bold",
                    }}
                  >
                    Explore
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Popular picks */}
            <Text
              style={{
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 18,
                color: COLORS.white,
                marginTop: 8,
                marginBottom: 14,
              }}
            >
              Popular Picks
            </Text>
            {ALL_BOOKS.slice(0, 4).map((book) => (
              <TouchableOpacity
                key={book.id}
                onPress={() => router.push(`/book/${book.id}`)}
                activeOpacity={0.8}
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
                  <book.icon color={COLORS.gold} size={20} strokeWidth={1.5} />
                </LinearGradient>
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
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Star color={COLORS.gold} size={10} fill={COLORS.gold} />
                    <Text
                      style={{
                        color: COLORS.gold,
                        fontSize: 11,
                        fontFamily: "CrimsonPro_400Regular",
                      }}
                    >
                      {book.rating}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

    </View>
  );
}
