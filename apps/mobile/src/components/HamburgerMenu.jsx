import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  X,
  Home,
  BookOpen,
  Search,
  PenTool,
  User,
  Settings,
  Bell,
  Shield,
  Crown,
  Download,
  Heart,
  LogOut,
  ChevronRight,
  Moon,
} from "lucide-react-native";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../theme/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 340);

const MENU_SECTIONS = [
  {
    title: "BROWSE",
    items: [
      { id: "home", label: "Home", subtitle: "መነሻ", icon: Home, route: "/" },
      {
        id: "library",
        label: "My Library",
        subtitle: "ቤተ መጻሕፍት",
        icon: BookOpen,
        route: "/library",
        badge: "12",
      },
      {
        id: "search",
        label: "Discover",
        subtitle: "ፈልግ",
        icon: Search,
        route: "/search",
      },
      {
        id: "notes",
        label: "Notes",
        subtitle: "ማስታወሻዎች",
        icon: PenTool,
        route: "/notes",
        badge: "4",
      },
      {
        id: "profile",
        label: "Profile",
        subtitle: "መገለጫ",
        icon: User,
        route: "/profile",
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        id: "premium",
        label: "Go Premium",
        subtitle: "Unlock all books & features",
        icon: Crown,
        accent: true,
      },
      {
        id: "downloads",
        label: "Downloads",
        subtitle: "Manage offline books",
        icon: Download,
      },
      {
        id: "favorites",
        label: "Favorites",
        subtitle: "Your saved books",
        icon: Heart,
      },
    ],
  },
  {
    title: "PREFERENCES",
    items: [
      {
        id: "notifications",
        label: "Notifications",
        subtitle: "Reading reminders",
        icon: Bell,
      },
      { id: "privacy", label: "Privacy", subtitle: "Data & permissions", icon: Shield },
      { id: "settings", label: "Settings", subtitle: "App preferences", icon: Settings },
    ],
  },
];

export default function HamburgerMenu({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleNav = (route) => {
    onClose();
    setTimeout(() => {
      if (route) router.push(route);
    }, 220);
  };

  const isActive = (route) => {
    if (!route) return false;
    if (route === "/") return pathname === "/" || pathname === "";
    return pathname?.startsWith(route);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#000",
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={{
            width: DRAWER_WIDTH,
            backgroundColor: COLORS.bg,
            transform: [{ translateX: slideAnim }],
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            borderRightWidth: 1,
            borderRightColor: COLORS.cardBorder,
            ...SHADOWS.card,
          }}
        >
          <LinearGradient
            colors={["#1A1B4A", "#0B0C1A"]}
            style={{
              paddingTop: insets.top + SPACING.lg,
              paddingBottom: SPACING.xl,
              paddingHorizontal: SPACING.xl,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.cardBorder,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: SPACING.lg,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: COLORS.gold,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: COLORS.goldLight,
                }}
              >
                <Text
                  style={{
                    color: COLORS.bg,
                    fontSize: 22,
                    fontWeight: "800",
                  }}
                >
                  ን
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: COLORS.card,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.cardBorder,
                }}
              >
                <X color={COLORS.mutedLight} size={18} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: COLORS.gold,
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 2,
              }}
            >
              ልዑል አንባቢ
            </Text>
            <Text
              style={{
                color: COLORS.muted,
                fontSize: 13,
                marginBottom: SPACING.md,
              }}
            >
              Noble Reader
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.card,
                paddingHorizontal: SPACING.md,
                paddingVertical: 8,
                borderRadius: RADIUS.pill,
                alignSelf: "flex-start",
                borderWidth: 1,
                borderColor: COLORS.gold + "60",
                gap: 6,
              }}
            >
              <Crown color={COLORS.gold} size={14} />
              <Text
                style={{
                  color: COLORS.gold,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                Level 3 — Scholar
              </Text>
            </View>
          </LinearGradient>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: SPACING.lg,
              paddingBottom: SPACING.xl,
            }}
            showsVerticalScrollIndicator={false}
          >
            {MENU_SECTIONS.map((section, sIdx) => (
              <View key={sIdx} style={{ marginBottom: SPACING.lg }}>
                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 11,
                    fontWeight: "700",
                    letterSpacing: 2,
                    paddingHorizontal: SPACING.xl,
                    marginBottom: SPACING.sm,
                  }}
                >
                  {section.title}
                </Text>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.route);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleNav(item.route)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: SPACING.md,
                        paddingHorizontal: SPACING.xl,
                        backgroundColor: active
                          ? COLORS.card
                          : "transparent",
                        borderLeftWidth: 3,
                        borderLeftColor: active
                          ? COLORS.gold
                          : "transparent",
                      }}
                    >
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: item.accent
                            ? COLORS.gold
                            : active
                            ? COLORS.gold + "22"
                            : COLORS.card,
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: SPACING.md,
                          borderWidth: 1,
                          borderColor: item.accent
                            ? COLORS.goldLight
                            : active
                            ? COLORS.gold + "60"
                            : COLORS.cardBorder,
                        }}
                      >
                        <Icon
                          color={
                            item.accent
                              ? COLORS.bg
                              : active
                              ? COLORS.gold
                              : COLORS.mutedLight
                          }
                          size={18}
                          strokeWidth={1.8}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: item.accent
                              ? COLORS.gold
                              : active
                              ? COLORS.gold
                              : COLORS.white,
                            fontSize: 15,
                            fontWeight: active ? "700" : "600",
                            marginBottom: 1,
                          }}
                        >
                          {item.label}
                        </Text>
                        <Text
                          style={{
                            color: COLORS.muted,
                            fontSize: 11,
                          }}
                        >
                          {item.subtitle}
                        </Text>
                      </View>
                      {item.badge && (
                        <View
                          style={{
                            backgroundColor: COLORS.gold,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 10,
                            marginRight: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.bg,
                              fontSize: 10,
                              fontWeight: "800",
                            }}
                          >
                            {item.badge}
                          </Text>
                        </View>
                      )}
                      <ChevronRight
                        color={COLORS.muted}
                        size={16}
                        strokeWidth={1.5}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: SPACING.md,
                paddingHorizontal: SPACING.xl,
                marginTop: SPACING.sm,
                marginHorizontal: SPACING.lg,
                backgroundColor: COLORS.card,
                borderRadius: RADIUS.md,
                borderWidth: 1,
                borderColor: "#5A1A1A",
              }}
            >
              <LogOut color={COLORS.danger} size={18} strokeWidth={1.8} />
              <Text
                style={{
                  color: COLORS.danger,
                  fontSize: 14,
                  fontWeight: "700",
                  marginLeft: SPACING.md,
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: COLORS.muted,
                fontSize: 11,
                textAlign: "center",
                marginTop: SPACING.xl,
                paddingHorizontal: SPACING.xl,
              }}
            >
              ንባብ ቤት v1.0.0
            </Text>
            <Text
              style={{
                color: COLORS.muted,
                fontSize: 10,
                textAlign: "center",
                marginTop: 2,
                paddingHorizontal: SPACING.xl,
              }}
            >
              House of Reading
            </Text>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
