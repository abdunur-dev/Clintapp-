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
  User,
  Crown,
  BookOpen,
  TrendingUp,
  Star,
  Moon,
  Church,
  Feather,
  Award,
  Settings,
  Bell,
  Shield,
  ChevronRight,
  Flame,
  Clock,
  Check,
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

const ACHIEVEMENTS = [
  {
    id: 1,
    title: "First Read",
    desc: "Completed your first book",
    icon: BookOpen,
    unlocked: true,
  },
  {
    id: 2,
    title: "7-Day Streak",
    desc: "Read 7 days in a row",
    icon: Flame,
    unlocked: true,
  },
  {
    id: 3,
    title: "Scholar",
    desc: "Read 10 books",
    icon: Crown,
    unlocked: true,
  },
  {
    id: 4,
    title: "Multi-Path",
    desc: "Read from 3 categories",
    icon: Star,
    unlocked: true,
  },
  {
    id: 5,
    title: "30-Day Streak",
    desc: "Read 30 days in a row",
    icon: Award,
    unlocked: false,
  },
  {
    id: 6,
    title: "Philosopher",
    desc: "Read 5 philosophy books",
    icon: Feather,
    unlocked: false,
  },
];

const READING_HISTORY = [
  { title: "The Holy Quran", progress: 34, icon: Moon, category: "Islamic" },
  { title: "Meditations", progress: 65, icon: Feather, category: "Philosophy" },
  {
    title: "Fiqr Eske Mekabir",
    progress: 100,
    icon: BookOpen,
    category: "Fiction",
  },
  {
    title: "The Holy Bible",
    progress: 12,
    icon: Church,
    category: "Christianity",
  },
];

const SETTINGS_ITEMS = [
  { label: "Notifications", icon: Bell, desc: "Reading reminders & alerts" },
  { label: "Privacy", icon: Shield, desc: "Data & permissions" },
  { label: "Account Settings", icon: Settings, desc: "Profile & preferences" },
];

function StarField() {
  const stars = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    top: Math.random() * 160,
    left: Math.random() * 400,
    size: 2,
    opacity: 0.12 + Math.random() * 0.25,
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

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("Stats");
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient
        colors={["#12144A18", "#0B0C1A"]}
        style={StyleSheet.absoluteFill}
      />
      <StarField />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Menu Button */}
        <View
          style={{
            position: "absolute",
            top: insets.top + 10,
            left: SPACING.xl,
            zIndex: 10,
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
            <MenuIcon color={COLORS.gold} size={20} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Profile Hero */}
        <LinearGradient
          colors={["#1A1B4A", "#0B0C1A"]}
          style={{
            paddingTop: insets.top + 20,
            paddingBottom: 30,
            paddingHorizontal: 20,
            alignItems: "center",
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: COLORS.card,
              borderWidth: 2,
              borderColor: COLORS.gold,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <User color={COLORS.gold} size={40} strokeWidth={1.5} />
          </View>

          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 24,
              color: COLORS.white,
              marginBottom: 4,
            }}
          >
            ልዑል አንባቢ
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 14,
              color: COLORS.muted,
              marginBottom: 12,
            }}
          >
            Noble Reader • Member since 2026
          </Text>

          {/* Level badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.card,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.gold + "60",
              gap: 8,
            }}
          >
            <Crown color={COLORS.gold} size={16} />
            <Text
              style={{
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 14,
                color: COLORS.gold,
              }}
            >
              Level 3 — Scholar
            </Text>
          </View>

          {/* XP Bar */}
          <View style={{ width: "100%", marginTop: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  color: COLORS.muted,
                  fontSize: 11,
                  fontFamily: "CrimsonPro_400Regular",
                }}
              >
                Progress to Level 4
              </Text>
              <Text
                style={{
                  color: COLORS.gold,
                  fontSize: 11,
                  fontFamily: "CrimsonPro_700Bold",
                }}
              >
                720 / 1000 XP
              </Text>
            </View>
            <View
              style={{
                height: 6,
                backgroundColor: COLORS.accent,
                borderRadius: 3,
              }}
            >
              <View
                style={{
                  width: "72%",
                  height: "100%",
                  backgroundColor: COLORS.gold,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: -10,
            marginBottom: 20,
            flexDirection: "row",
            gap: 10,
          }}
        >
          {[
            { label: "Books\nRead", value: "12", icon: BookOpen },
            { label: "Reading\nStreak", value: "7d", icon: Flame },
            { label: "Hours\nRead", value: "48h", icon: Clock },
            { label: "Avg.\nRating", value: "4.8", icon: Star },
          ].map((stat, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                backgroundColor: COLORS.card,
                borderRadius: 14,
                padding: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
              }}
            >
              <stat.icon color={COLORS.gold} size={18} strokeWidth={1.5} />
              <Text
                style={{
                  fontFamily: "CrimsonPro_700Bold",
                  fontSize: 18,
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

        {/* Tab Switcher */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.card,
              borderRadius: 14,
              padding: 4,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
            }}
          >
            {["Stats", "Achievements", "Settings"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor:
                    activeTab === tab ? COLORS.gold : "transparent",
                  alignItems: "center",
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
          </View>
        </View>

        {/* Tab Content */}
        <View style={{ paddingHorizontal: 20 }}>
          {activeTab === "Stats" && (
            <>
              <Text
                style={{
                  fontFamily: "CrimsonPro_700Bold",
                  fontSize: 18,
                  color: COLORS.white,
                  marginBottom: 14,
                }}
              >
                Reading History
              </Text>
              {READING_HISTORY.map((book, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.8}
                  onPress={() => {
                    const bookId =
                      book.title === "The Holy Quran"
                        ? 1
                        : book.title === "Meditations"
                        ? 3
                        : book.title === "Fiqr Eske Mekabir"
                        ? 9
                        : 2;
                    router.push(`/book/${bookId}`);
                  }}
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
                      width: 44,
                      height: 60,
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <book.icon
                      color={COLORS.gold}
                      size={18}
                      strokeWidth={1.5}
                    />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "CrimsonPro_700Bold",
                        fontSize: 14,
                        color: COLORS.white,
                        marginBottom: 4,
                      }}
                    >
                      {book.title}
                    </Text>
                    <View
                      style={{
                        height: 4,
                        backgroundColor: COLORS.accent,
                        borderRadius: 2,
                        marginBottom: 4,
                      }}
                    >
                      <View
                        style={{
                          width: `${book.progress}%`,
                          height: "100%",
                          backgroundColor:
                            book.progress === 100 ? "#4A8C5C" : COLORS.gold,
                          borderRadius: 2,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "CrimsonPro_400Regular",
                          fontSize: 11,
                          color: COLORS.muted,
                        }}
                      >
                        {book.category}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "CrimsonPro_400Regular",
                          fontSize: 11,
                          color:
                            book.progress === 100 ? "#4A8C5C" : COLORS.gold,
                        }}
                      >
                        {book.progress === 100
                          ? "✓ Complete"
                          : `${book.progress}%`}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Category Breakdown */}
              <Text
                style={{
                  fontFamily: "CrimsonPro_700Bold",
                  fontSize: 18,
                  color: COLORS.white,
                  marginTop: 10,
                  marginBottom: 14,
                }}
              >
                Category Breakdown
              </Text>
              {[
                { label: "Islamic", count: 4, pct: 0.4, icon: Moon },
                { label: "Philosophy", count: 3, pct: 0.3, icon: Feather },
                { label: "Fiction", count: 2, pct: 0.2, icon: BookOpen },
                { label: "Christianity", count: 1, pct: 0.1, icon: Church },
              ].map((cat, i) => (
                <View key={i} style={{ marginBottom: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <cat.icon color={COLORS.gold} size={14} />
                      <Text
                        style={{
                          fontFamily: "CrimsonPro_400Regular",
                          fontSize: 14,
                          color: COLORS.mutedLight,
                        }}
                      >
                        {cat.label}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "CrimsonPro_700Bold",
                        fontSize: 13,
                        color: COLORS.gold,
                      }}
                    >
                      {cat.count} books
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 6,
                      backgroundColor: COLORS.accent,
                      borderRadius: 3,
                    }}
                  >
                    <View
                      style={{
                        width: `${cat.pct * 100}%`,
                        height: "100%",
                        backgroundColor: COLORS.gold,
                        borderRadius: 3,
                      }}
                    />
                  </View>
                </View>
              ))}
            </>
          )}

          {activeTab === "Achievements" && (
            <>
              <Text
                style={{
                  fontFamily: "CrimsonPro_400Regular",
                  fontSize: 13,
                  color: COLORS.muted,
                  marginBottom: 16,
                }}
              >
                {ACHIEVEMENTS.filter((a) => a.unlocked).length} of{" "}
                {ACHIEVEMENTS.length} unlocked
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                {ACHIEVEMENTS.map((ach) => (
                  <View
                    key={ach.id}
                    style={{
                      width: "47%",
                      backgroundColor: ach.unlocked ? "#1E1F4A" : COLORS.card,
                      borderRadius: 16,
                      padding: 16,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: ach.unlocked
                        ? COLORS.gold + "60"
                        : COLORS.cardBorder,
                      opacity: ach.unlocked ? 1 : 0.5,
                    }}
                  >
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        backgroundColor: ach.unlocked
                          ? COLORS.gold + "22"
                          : COLORS.accent,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: ach.unlocked
                          ? COLORS.gold + "60"
                          : COLORS.cardBorder,
                      }}
                    >
                      <ach.icon
                        color={ach.unlocked ? COLORS.gold : COLORS.muted}
                        size={22}
                        strokeWidth={1.5}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: "CrimsonPro_700Bold",
                        fontSize: 14,
                        color: ach.unlocked ? COLORS.white : COLORS.muted,
                        textAlign: "center",
                      }}
                    >
                      {ach.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "CrimsonPro_400Regular",
                        fontSize: 11,
                        color: COLORS.muted,
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      {ach.desc}
                    </Text>
                    {ach.unlocked && (
                      <View
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          backgroundColor: COLORS.gold,
                          borderRadius: 10,
                          width: 18,
                          height: 18,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Check color={COLORS.bg} size={10} />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {activeTab === "Settings" && (
            <>
              {SETTINGS_ITEMS.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.label === "Notifications") {
                      // Navigate to notifications
                    } else if (item.label === "Privacy") {
                      // Navigate to privacy
                    } else if (item.label === "Account Settings") {
                      // Navigate to account
                    }
                  }}
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
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: COLORS.accent,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 14,
                      borderWidth: 1,
                      borderColor: COLORS.cardBorder,
                    }}
                  >
                    <item.icon
                      color={COLORS.gold}
                      size={18}
                      strokeWidth={1.5}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "CrimsonPro_700Bold",
                        fontSize: 15,
                        color: COLORS.white,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "CrimsonPro_400Regular",
                        fontSize: 12,
                        color: COLORS.muted,
                      }}
                    >
                      {item.desc}
                    </Text>
                  </View>
                  <ChevronRight color={COLORS.muted} size={18} />
                </TouchableOpacity>
              ))}

              {/* Reading Goal */}
              <View
                style={{
                  backgroundColor: "#1A1B38",
                  borderRadius: 16,
                  padding: 18,
                  marginTop: 6,
                  borderWidth: 1,
                  borderColor: COLORS.gold + "50",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <TrendingUp color={COLORS.gold} size={16} />
                  <Text
                    style={{
                      fontFamily: "CrimsonPro_700Bold",
                      fontSize: 16,
                      color: COLORS.white,
                    }}
                  >
                    Reading Goal
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: "CrimsonPro_400Regular",
                    fontSize: 13,
                    color: COLORS.muted,
                    marginBottom: 10,
                  }}
                >
                  12 of 20 books this year
                </Text>
                <View
                  style={{
                    height: 8,
                    backgroundColor: COLORS.accent,
                    borderRadius: 4,
                  }}
                >
                  <View
                    style={{
                      width: "60%",
                      height: "100%",
                      backgroundColor: COLORS.gold,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: "CrimsonPro_400Regular",
                    fontSize: 11,
                    color: COLORS.gold,
                    marginTop: 6,
                  }}
                >
                  60% complete • 8 more books to go
                </Text>
              </View>

              {/* Sign out */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setMenuOpen(true);
                }}
                style={{
                  backgroundColor: COLORS.card,
                  borderRadius: 14,
                  padding: 16,
                  marginTop: 16,
                  borderWidth: 1,
                  borderColor: "#5A1A1A",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "CrimsonPro_700Bold",
                    fontSize: 15,
                    color: "#E05555",
                  }}
                >
                  Sign Out
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <HamburgerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
