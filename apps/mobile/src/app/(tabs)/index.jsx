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
  Menu,
  Crown,
  Moon,
  Church,
  BookOpen,
  Languages,
  Star,
  Feather,
  TrendingUp,
  ChevronRight,
  Bell,
  Sparkles,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";
import HamburgerMenu from "../../components/HamburgerMenu";

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

const featured = [
  {
    id: 1,
    title: "Quran — Amharic",
    titleAm: "ቅዱስ ቁርአን",
    author: "Translation",
    pages: 604,
    progress: 0.34,
    category: "Islamic",
    icon: Moon,
  },
  {
    id: 2,
    title: "The Bible — Amharic",
    titleAm: "ቅዱስ መጽሐፍ",
    author: "Holy Scripture",
    pages: 1189,
    progress: 0.12,
    category: "Christianity",
    icon: Church,
  },
  {
    id: 3,
    title: "Meditations",
    titleAm: "ሥነ አዕምሮ",
    author: "Marcus Aurelius",
    pages: 254,
    progress: 0.65,
    category: "Philosophy",
    icon: Feather,
  },
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
  const [menuOpen, setMenuOpen] = useState(false);

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
            ...SHADOWS.card,
          }}
        >
          <Menu color={COLORS.gold} size={20} strokeWidth={2} />
        </TouchableOpacity>

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
            <Bell color={COLORS.mutedLight} size={18} />
            <View
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: COLORS.gold,
                borderWidth: 1.5,
                borderColor: COLORS.card,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: COLORS.card,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: RADIUS.pill,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: COLORS.gold + "60",
            }}
          >
            <Crown color={COLORS.gold} size={14} />
            <Text
              style={{
                color: COLORS.gold,
                marginLeft: 4,
                fontSize: 12,
                fontFamily: "CrimsonPro_700Bold",
              }}
            >
              Lv.3
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View
          style={{
            paddingHorizontal: SPACING.xl,
            marginBottom: SPACING.xxl,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
            }}
          >
            <Sparkles color={COLORS.gold} size={14} />
            <Text
              style={{
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 14,
                color: COLORS.muted,
              }}
            >
              Good evening, Reader
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 28,
              color: COLORS.white,
              marginTop: 2,
            }}
          >
            Choose Your Path
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 13,
              color: COLORS.gold,
              letterSpacing: 2,
              marginTop: 2,
            }}
          >
            ምረጥ
          </Text>
        </View>

        {/* Category Grid */}
        <View
          style={{
            paddingHorizontal: SPACING.xl,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.8}
              style={{
                width: "48%",
                backgroundColor:
                  activeCategory === cat.id ? "#1E1F4A" : COLORS.card,
                borderRadius: RADIUS.lg,
                padding: SPACING.xl,
                marginBottom: 14,
                alignItems: "center",
                borderWidth: 1.5,
                borderColor:
                  activeCategory === cat.id ? COLORS.gold : COLORS.cardBorder,
                ...SHADOWS.card,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor:
                    activeCategory === cat.id ? "#2A2B5A" : COLORS.accent,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: SPACING.md,
                  borderWidth: 1,
                  borderColor:
                    activeCategory === cat.id
                      ? COLORS.gold + "80"
                      : COLORS.cardBorder,
                }}
              >
                <cat.icon
                  color={COLORS.gold}
                  size={26}
                  strokeWidth={1.5}
                />
              </View>
              <Text
                style={{
                  fontFamily: "CrimsonPro_700Bold",
                  fontSize: 18,
                  color: COLORS.white,
                  marginBottom: 2,
                }}
              >
                {cat.title}
              </Text>
              <Text
                style={{
                  fontFamily: "CrimsonPro_400Regular",
                  fontSize: 11,
                  color: COLORS.muted,
                  letterSpacing: 1,
                }}
              >
                {cat.subtitle.toUpperCase()}
              </Text>
              {activeCategory === cat.id && (
                <View style={{ position: "absolute", top: 12, right: 12 }}>
                  <Star color={COLORS.gold} size={12} fill={COLORS.gold} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Reading */}
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: 8 }}>
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
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 20,
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

          {featured.map((book) => (
            <TouchableOpacity
              key={book.id}
              onPress={() => router.push(`/book/${book.id}`)}
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
                <book.icon
                  color={COLORS.gold}
                  size={24}
                  strokeWidth={1.5}
                />
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
                style={{ marginLeft: SPACING.sm}}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Translation Hint */}
        <View
          style={{
            marginHorizontal: SPACING.xl,
            marginTop: SPACING.lg,
            padding: SPACING.lg,
            backgroundColor: "#1A1B38",
            borderRadius: RADIUS.lg,
            borderStyle: "dashed",
            borderWidth: 1.5,
            borderColor: COLORS.gold + "80",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Languages color={COLORS.gold} size={16} />
            <Text
              style={{
                color: COLORS.gold,
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 14,
                marginLeft: SPACING.sm,
              }}
            >
              AI Reading Companion
            </Text>
          </View>
          <Text
            style={{
              color: COLORS.mutedLight,
              fontSize: 13,
              fontFamily: "CrimsonPro_400Regular",
              lineHeight: 20,
            }}
          >
            Tap any Amharic word to translate it into English, and ask our AI
            companion what it means.
          </Text>
        </View>

        {/* Stats Row */}
        <View
          style={{
            paddingHorizontal: SPACING.xl,
            marginTop: SPACING.xl,
            flexDirection: "row",
            gap: SPACING.md,
          }}
        >
          {[
            { label: "Books Read", value: "12", icon: BookOpen },
            { label: "Reading Streak", value: "7 Days", icon: TrendingUp },
            { label: "Top Category", value: "Islamic", icon: Star },
          ].map((stat, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                backgroundColor: COLORS.card,
                borderRadius: RADIUS.md,
                padding: SPACING.lg,
                alignItems: "center",
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
              }}
            >
              <stat.icon color={COLORS.gold} size={18} strokeWidth={1.5} />
              <Text
                style={{
                  fontFamily: "CrimsonPro_700Bold",
                  fontSize: 16,
                  color: COLORS.white,
                  marginTop: 6,
                }}
              >
                {stat.value}
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
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/search")}
        style={{
          position: "absolute",
          right: SPACING.xl,
          bottom: 100,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: COLORS.gold,
          justifyContent: "center",
          alignItems: "center",
          ...SHADOWS.gold,
        }}
      >
        <Languages color={COLORS.bg} size={24} strokeWidth={2} />
      </TouchableOpacity>

      <HamburgerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
