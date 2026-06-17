import { Tabs } from "expo-router";
import { Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Home,
  Book,
  Search,
  PenTool,
  ShoppingCart,
} from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmall = SCREEN_WIDTH < 360;
const isTablet = SCREEN_WIDTH >= 768;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0B0C1A",
          borderTopWidth: 1,
          borderColor: "#252650",
          paddingTop: isSmall ? 4 : 6,
          paddingBottom: Platform.OS === "android"
            ? Math.max(insets.bottom, 48)
            : Math.max(insets.bottom, 6),
        },
        tabBarActiveTintColor: "#C9A84C",
        tabBarInactiveTintColor: "#7878A0",
        tabBarLabelStyle: {
          fontSize: isSmall ? 8 : isTablet ? 12 : 10,
          fontWeight: "600",
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingHorizontal: 0,
          paddingVertical: 0,
        },
        tabBarIconStyle: {
          marginBottom: isSmall ? -2 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Home color={color} size={isSmall ? 18 : isTablet ? 24 : 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <Book color={color} size={isSmall ? 18 : isTablet ? 24 : 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Search color={color} size={isSmall ? 18 : isTablet ? 24 : 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ color }) => (
            <PenTool color={color} size={isSmall ? 18 : isTablet ? 24 : 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <ShoppingCart color={color} size={isSmall ? 18 : isTablet ? 24 : 22} />
          ),
        }}
      />
    </Tabs>
  );
}
