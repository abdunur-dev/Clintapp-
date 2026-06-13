import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Moon,
  Church,
  BookOpen,
  Star,
  Feather,
  ChevronRight,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";
import { CartButton } from "../../components/CartButton";
import { FadeInView, ScaleInView, SlideUpView } from "../../components/animations";
import { api } from "../../services/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ICON_MAP = { Moon, Church, Feather, BookOpen };

const categories = [
  { id: "islamic", title: "እስልምና", subtitle: "Islamic", icon: Moon },
  {
    id: "christianity",
    title: "ክርስትና",
    subtitle: "Christianity",
    icon: Church,
  },
  { id: "philosophy", title: "ፍልስፍና", subtitle: "Philosophy", icon: Feather },
  { id: "fiction", title: "ልብ ወለድ", subtitle: "Fiction", icon: BookOpen },
];

function StarField() {
  const stars = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    top: Math.random() * 300,
    left: Math.random() * 380,
    size: Math.random() > 0.8 ? 3 : 2,
    opacity: 0.2 + Math.random() * 0.5,
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
            borderRadius: s.size / 2,
            backgroundColor: COLORS.gold,
            opacity: s.opacity,
          }}
        />
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [activeCategory, setActiveCategory] = useState("islamic");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.getSacredBooks().then(setBooks).catch(() => {});
  }, []);

  const handleCartPress = () => router.push("/cart");

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient
        colors={["#12144A22", "#0B0C1A", "#0B0C1A"]}
        style={StyleSheet.absoluteFill}
      />
      <StarField />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: SPACING.xl,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: SPACING.lg,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 22,
              color: COLORS.gold,
              letterSpacing: 2,
            }}
          >
            ንባብ ቤት
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 10,
              color: COLORS.muted,
              letterSpacing: 3,
            }}
          >
            HOUSE OF READING
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <CartButton onPress={handleCartPress} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <FadeInView delay={100}>
        <View
          style={{
            paddingHorizontal: SPACING.xl,
            paddingTop: SPACING.sm,
          }}
        >
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 32,
              color: COLORS.white,
            }}
          >
            Welcome
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 13,
              color: COLORS.gold,
              letterSpacing: 2,
              marginTop: 4,
            }}
          >
            እንኳን ደህና መጣህ
          </Text>
        </View>
        </FadeInView>

        {/* Category Grid */}
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.xl }}>
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 18,
              color: COLORS.white,
              marginBottom: SPACING.md,
            }}
          >
            Browse
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {categories.map((cat, i) => {
              const isActive = activeCategory === cat.id;
              const cardWidth = (SCREEN_WIDTH - SPACING.xl * 2 - 12) / 2;
              return (
              <ScaleInView key={cat.id} delay={200 + i * 80} style={{ width: cardWidth }}>
              <TouchableOpacity
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: isActive ? "#1E1F4A" : COLORS.card,
                  borderRadius: RADIUS.lg,
                  paddingVertical: SPACING.xl,
                  paddingHorizontal: SPACING.md,
                  alignItems: "center",
                  borderWidth: 1.5,
                  borderColor: isActive ? COLORS.gold : COLORS.cardBorder,
                  ...SHADOWS.card,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: isActive ? "#2A2B5A" : COLORS.accent,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: SPACING.sm,
                    borderWidth: 1,
                    borderColor: isActive ? COLORS.gold + "80" : COLORS.cardBorder,
                  }}
                >
                  <cat.icon color={COLORS.gold} size={24} strokeWidth={1.5} />
                </View>
                <Text
                  style={{
                    fontFamily: "CrimsonPro_700Bold",
                    fontSize: 16,
                    color: COLORS.white,
                  }}
                >
                  {cat.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "CrimsonPro_400Regular",
                    fontSize: 10,
                    color: COLORS.muted,
                    letterSpacing: 1,
                    marginTop: 2,
                  }}
                >
                  {cat.subtitle.toUpperCase()}
                </Text>
                {isActive && (
                  <View style={{ position: "absolute", top: 8, right: 12 }}>
                    <Star color={COLORS.gold} size={10} fill={COLORS.gold} />
                  </View>
                )}
              </TouchableOpacity>
              </ScaleInView>
              );
            })}
          </View>
        </View>

        {/* Continue Reading */}
        <SlideUpView delay={300}>
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.md }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: SPACING.md,
            }}
          >
            <Text
              style={{
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 18,
                color: COLORS.white,
              }}
            >
              Continue Reading
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/library")}
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
              }}
            >
              <Text
                style={{
                  color: COLORS.gold,
                  fontSize: 12,
                  fontFamily: "CrimsonPro_700Bold",
                }}
              >
                See all
              </Text>
              <ChevronRight color={COLORS.gold} size={14} />
            </TouchableOpacity>
          </View>

          {books.map((book, i) => (
            <FadeInView key={book._id} delay={400 + i * 100}>
            <TouchableOpacity
              onPress={() => router.push(`/book/${book._id}`)}
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
                  width: 56,
                  height: 78,
                  borderRadius: RADIUS.md,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: SPACING.lg,
                  borderWidth: 1,
                  borderColor: COLORS.gold + "30",
                }}
              >
                {React.createElement(ICON_MAP[book.iconName] || BookOpen, {
                  color: COLORS.gold,
                  size: 24,
                  strokeWidth: 1.5,
                })}
              </LinearGradient>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "CrimsonPro_700Bold",
                    fontSize: 16,
                    color: COLORS.white,
                    marginBottom: 2,
                  }}
                >
                  {book.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "CrimsonPro_400Regular",
                    fontSize: 12,
                    color: COLORS.gold,
                    marginBottom: 4,
                  }}
                >
                  {book.titleAm}
                </Text>
                <Text
                  style={{
                    fontFamily: "CrimsonPro_400Regular",
                    fontSize: 12,
                    color: COLORS.muted,
                    marginBottom: 8,
                  }}
                >
                  {book.author}
                </Text>
                <View
                  style={{
                    height: 4,
                    backgroundColor: COLORS.accent,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      width: `${book.progress * 100}%`,
                      height: "100%",
                      backgroundColor: COLORS.gold,
                      borderRadius: 2,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: "CrimsonPro_400Regular",
                    fontSize: 11,
                    color: COLORS.gold,
                    marginTop: 4,
                  }}
                >
                  {Math.round(book.progress * 100)}% complete
                </Text>
              </View>

              <ChevronRight
                color={COLORS.muted}
                size={18}
                style={{ marginLeft: SPACING.sm }}
              />
            </TouchableOpacity>
            </FadeInView>
          ))}
        </View>
        </SlideUpView>


      </ScrollView>


    </View>
  );
}
