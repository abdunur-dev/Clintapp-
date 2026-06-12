import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  User,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING } from "../../theme/theme";

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
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient
        colors={["#12144A18", "#0B0C1A"]}
        style={StyleSheet.absoluteFill}
      />
      <StarField />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: SPACING.xl,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
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
            marginBottom: 16,
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
          Profile
        </Text>

        <Text
          style={{
            fontFamily: "CrimsonPro_400Regular",
            fontSize: 14,
            color: COLORS.muted,
            textAlign: "center",
          }}
        >
          Coming soon
        </Text>
      </View>
    </View>
  );
}
