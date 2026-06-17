import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Linking,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  BookOpen,
  ChevronRight,
  Search,
  Mail,
  Info,
  X,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";
import { CartButton } from "../../components/CartButton";
import { FadeInView, SlideUpView } from "../../components/animations";
import { api, getImageUrl } from "../../services/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 12;
const HERO_HEIGHT = 180;
const AUTO_SLIDE_INTERVAL = 4000;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [books, setBooks] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [aboutVisible, setAboutVisible] = useState(false);
  const heroScrollRef = useRef(null);
  const timerRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    api.getBooks().then(setBooks).catch(() => {});
  }, []);

  const filteredBooks = useMemo(() => books, [books]);

  const heroBooks = useMemo(() =>
    books.filter(b => b.coverUrl).slice(0, 3),
  [books]);

  const categorySections = useMemo(() => {
    const cats = [...new Set(books.map(b => b.category).filter(Boolean))];
    return cats.slice(0, 4).map(cat => ({
      title: cat,
      books: books.filter(b => b.category === cat).slice(0, 6),
    }));
  }, [books]);

  const fontFamily = fontsLoaded ? "CrimsonPro_400Regular" : undefined;
  const fontBold = fontsLoaded ? "CrimsonPro_700Bold" : undefined;
  const gridCardWidth = (SCREEN_WIDTH - SPACING.xl * 2 - CARD_GAP) / 2;

  // Auto slide hero carousel
  const startAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setHeroIndex(prev => {
        const next = prev + 1;
        if (next >= heroBooks.length) return 0;
        return next;
      });
    }, AUTO_SLIDE_INTERVAL);
  }, [heroBooks.length]);

  const stopAutoSlide = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (heroBooks.length > 1) {
      startAutoSlide();
      return () => stopAutoSlide();
    }
  }, [heroBooks.length, startAutoSlide, stopAutoSlide]);

  useEffect(() => {
    if (heroScrollRef.current && heroBooks.length > 0) {
const PEEK = 8;
      const visibleWidth = SCREEN_WIDTH - SPACING.xl * 2;
      const cardWidth = visibleWidth - PEEK;
      const snapInterval = cardWidth + CARD_GAP;
      heroScrollRef.current.scrollTo({ x: heroIndex * snapInterval, animated: true });
    }
  }, [heroIndex]);

  const handleHeroScroll = useCallback((e) => {
    const PEEK = 8;
    const visibleWidth = SCREEN_WIDTH - SPACING.xl * 2;
    const cardWidth = visibleWidth - PEEK;
    const snapInterval = cardWidth + CARD_GAP;
    const offsetX = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / snapInterval);
    if (idx !== heroIndex) setHeroIndex(idx);
  }, [heroIndex]);

  const renderCover = (book, width, height, iconSize = 32, showText = false) => {
    const coverSrc = getImageUrl(book.coverUrl);
    if (coverSrc) {
      return (
        <Image
          source={{ uri: coverSrc }}
          style={{ width, height }}
          resizeMode="cover"
        />
      );
    }
    return (
      <LinearGradient
        colors={[book.color || "#2A2B5A", "#1A1B3A"]}
        style={{ width, height, justifyContent: "center", alignItems: "center" }}
      >
        <BookOpen color={COLORS.gold} size={iconSize} strokeWidth={1.2} />
        {showText && (
          <View style={{ alignItems: "center", marginTop: 12, paddingHorizontal: 16 }}>
            <Text style={{ fontFamily: fontBold, fontSize: 16, color: COLORS.white, textAlign: "center" }} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={{ fontFamily: fontFamily, fontSize: 12, color: COLORS.gold, textAlign: "center", marginTop: 4 }} numberOfLines={1}>
              {book.author}
            </Text>
          </View>
        )}
      </LinearGradient>
    );
  };

  const renderCoverWithOverlay = (book, w, h) => (
    <TouchableOpacity
      onPress={() => router.push(`/book/${book._id}`)}
      activeOpacity={0.85}
      style={{ width: w, height: h, borderRadius: RADIUS.lg, overflow: "hidden", borderWidth: 1, borderColor: COLORS.gold + "40" }}
    >
      {renderCover(book, w, h, 64, true)}
      {getImageUrl(book.coverUrl) && (
        <View style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}>
          <Text style={{ fontFamily: fontBold, fontSize: 16, color: COLORS.white }} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={{ fontFamily: fontFamily, fontSize: 12, color: COLORS.gold }} numberOfLines={1}>
            {book.author}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const HeroSection = () => {
    if (heroBooks.length === 0) return null;
    const PEEK = 8;
    const visibleWidth = SCREEN_WIDTH - SPACING.xl * 2;
    const cardWidth = visibleWidth - PEEK;
    const snapInterval = cardWidth + CARD_GAP;
    const centerPad = (SCREEN_WIDTH - cardWidth) / 2;

    return (
      <View style={{ marginBottom: SPACING.lg }}>
        <ScrollView
          ref={heroScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={snapInterval}
          decelerationRate="fast"
          snapToAlignment="center"
          onMomentumScrollEnd={handleHeroScroll}
          onScrollBeginDrag={stopAutoSlide}
          onScrollEndDrag={startAutoSlide}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: centerPad }}
        >
          {heroBooks.map((book, i) => {
            const inputRange = [
              (i - 1) * snapInterval,
              i * snapInterval,
              (i + 1) * snapInterval,
            ];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.85, 1, 0.85],
              extrapolate: "clamp",
            });

            return (
              <Animated.View key={book._id} style={{ width: cardWidth, marginRight: i < heroBooks.length - 1 ? CARD_GAP : 0, opacity }}>
                {renderCoverWithOverlay(book, cardWidth, HERO_HEIGHT)}
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Dots */}
        {heroBooks.length > 1 && (
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 }}>
            {heroBooks.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  stopAutoSlide();
                  setHeroIndex(i);
                  startAutoSlide();
                }}
                style={{
                  width: heroIndex === i ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: heroIndex === i ? COLORS.gold : COLORS.gold + "50",
                }}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const SmallSquaresRow = () => {
    const items = filteredBooks.slice(0, 10);
    if (items.length === 0) return null;
    return (
      <View style={{ marginBottom: SPACING.lg }}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: SPACING.xl,
          marginBottom: SPACING.sm,
        }}>
          <Text style={{ fontFamily: fontBold, fontSize: 16, color: COLORS.white }}>Quick Browse</Text>
          <TouchableOpacity onPress={() => router.push("/library")}>
            <ChevronRight color={COLORS.gold} size={16} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: CARD_GAP }}
        >
          {items.map(book => (
            <TouchableOpacity
              key={book._id}
              onPress={() => router.push(`/book/${book._id}`)}
              activeOpacity={0.8}
              style={{ width: 80, gap: 6 }}
            >
              <View style={{
                width: 80, height: 110,
                borderRadius: RADIUS.md,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
              }}>
                {renderCover(book, 80, 110, 24)}
              </View>
              <Text style={{ fontFamily: fontFamily, fontSize: 10, color: COLORS.muted, textAlign: "center" }} numberOfLines={2}>
                {book.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const TwoColumnGrid = ({ section }) => {
    if (!section || section.books.length === 0) return null;
    return (
      <View style={{ marginBottom: SPACING.lg, paddingHorizontal: SPACING.xl }}>
        <Text style={{ fontFamily: fontBold, fontSize: 16, color: COLORS.white, marginBottom: SPACING.sm }}>
          {section.title}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: CARD_GAP }}>
          {section.books.map(book => (
            <TouchableOpacity
              key={book._id}
              onPress={() => router.push(`/book/${book._id}`)}
              activeOpacity={0.8}
              style={{ width: gridCardWidth, marginBottom: 4 }}
            >
              <View style={{
                width: gridCardWidth,
                height: gridCardWidth * 1.3,
                borderRadius: RADIUS.md,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                marginBottom: 8,
              }}>
                {renderCover(book, gridCardWidth, gridCardWidth * 1.3)}
              </View>
              <Text style={{ fontFamily: fontBold, fontSize: 13, color: COLORS.white }} numberOfLines={1}>
                {book.title}
              </Text>
              <Text style={{ fontFamily: fontFamily, fontSize: 10, color: COLORS.muted }} numberOfLines={1}>
                {book.author}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const MediumRow = ({ section }) => {
    if (!section || section.books.length === 0) return null;
    const cardWidth = 160;
    return (
      <View style={{ marginBottom: SPACING.lg }}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: SPACING.xl,
          marginBottom: SPACING.sm,
        }}>
          <Text style={{ fontFamily: fontBold, fontSize: 16, color: COLORS.white }}>{section.title}</Text>
          <TouchableOpacity onPress={() => router.push(`/library?section=${encodeURIComponent(section.title)}`)}>
            <ChevronRight color={COLORS.gold} size={16} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: CARD_GAP }}
        >
          {section.books.map(book => (
            <TouchableOpacity
              key={book._id}
              onPress={() => router.push(`/book/${book._id}`)}
              activeOpacity={0.8}
              style={{ width: cardWidth }}
            >
              <View style={{
                width: cardWidth,
                height: cardWidth * 1.2,
                borderRadius: RADIUS.md,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                marginBottom: 8,
              }}>
                {renderCover(book, cardWidth, cardWidth * 1.2)}
              </View>
              <Text style={{ fontFamily: fontBold, fontSize: 13, color: COLORS.white }} numberOfLines={1}>
                {book.title}
              </Text>
              <Text style={{ fontFamily: fontFamily, fontSize: 10, color: COLORS.muted }} numberOfLines={1}>
                {book.author}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient
        colors={["#12144A22", "#0B0C1A", "#0B0C1A"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Fixed Header */}
      <View style={{
        paddingTop: insets.top + 10,
        paddingHorizontal: SPACING.xl,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: SPACING.sm,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Image
            source={require("../../../assets/images/Logo.png")}
            style={{ width: 40, height: 40, borderRadius: 8 }}
            resizeMode="contain"
          />
          <View>
            <Text style={{ fontFamily: fontBold, fontSize: 20, color: COLORS.gold, letterSpacing: 1 }}>
              ንባብ ቤት
            </Text>
            <Text style={{ fontFamily: fontFamily, fontSize: 8, color: COLORS.muted, letterSpacing: 2 }}>
              NBAB-BET
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            onPress={() => setAboutVisible(true)}
            activeOpacity={0.7}
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
            <Info color={COLORS.gold} size={16} strokeWidth={2} />
          </TouchableOpacity>
          <CartButton onPress={() => router.push("/(tabs)/cart")} />
        </View>
      </View>

      {/* Fixed Search Bar */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/search")}
        activeOpacity={0.7}
        style={{
          marginHorizontal: SPACING.xl,
          marginBottom: SPACING.sm,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.card,
          borderRadius: RADIUS.md,
          paddingHorizontal: 16,
          height: 44,
          borderWidth: 1,
          borderColor: COLORS.cardBorder,
        }}
      >
        <Search color={COLORS.muted} size={16} />
        <Text
          style={{ marginLeft: 10, color: COLORS.muted, fontFamily: fontFamily, fontSize: 14, flex: 1 }}
          numberOfLines={1}
        >
          Search books, authors, or topics
        </Text>
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView delay={200} duration={500}>
        {/* Hero Carousel */}
        <HeroSection />

        {/* Small Square Cards Row */}
        <SmallSquaresRow />

        {/* Category Sections */}
        {categorySections.map((section, i) => {
          if (i % 2 === 0) {
            return <TwoColumnGrid key={section.title} section={section} />;
          }
          return <MediumRow key={section.title} section={section} />;
        })}

        </FadeInView>
      </ScrollView>

      {/* About Us Modal */}
      <Modal visible={aboutVisible} transparent animationType="fade" onRequestClose={() => setAboutVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: SPACING.xl }}>
          <View style={{
            backgroundColor: COLORS.bgElevated,
            borderRadius: RADIUS.lg,
            padding: SPACING.xl,
            borderWidth: 1,
            borderColor: COLORS.gold + "40",
          }}>
            {/* Close button */}
            <TouchableOpacity
              onPress={() => setAboutVisible(false)}
              style={{ alignSelf: "flex-end", width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.card, justifyContent: "center", alignItems: "center" }}
            >
              <X color={COLORS.muted} size={16} />
            </TouchableOpacity>

            {/* Logo + Title */}
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Image
                source={require("../../../assets/images/Logo.png")}
                style={{ width: 60, height: 60, borderRadius: 12, marginBottom: 10 }}
                resizeMode="contain"
              />
              <Text style={{ fontFamily: fontBold, fontSize: 20, color: COLORS.gold, letterSpacing: 1 }}>ንባብ ቤት</Text>
              <Text style={{ fontFamily: fontFamily, fontSize: 10, color: COLORS.muted, letterSpacing: 3 }}>NBAB-BET</Text>
            </View>

            {/* Version */}
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontFamily: fontBold, fontSize: 12, color: COLORS.muted, letterSpacing: 1 }}>VERSION 1.0.0</Text>
            </View>

            {/* Description */}
            <Text style={{ fontFamily: fontFamily, fontSize: 13, color: COLORS.mutedLight, textAlign: "center", lineHeight: 20, marginBottom: 20 }}>
              Nbab-Bet is a digital library for sacred texts, hadith collections, scholarly works, and philosophical writings. Built with passion for readers worldwide.
            </Text>

            {/* Concept */}
            <View style={{ backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: 20, borderWidth: 1, borderColor: COLORS.cardBorder }}>
              <Text style={{ fontFamily: fontBold, fontSize: 12, color: COLORS.gold, marginBottom: 4, textAlign: "center", letterSpacing: 1 }}>MAIN CONCEPT</Text>
              <Text style={{ fontFamily: fontFamily, fontSize: 12, color: COLORS.muted, textAlign: "center", lineHeight: 18 }}>
                Access sacred and scholarly texts in multiple languages with an immersive reading experience. Features include manuscript-style reading, translation panels, bookmarks, and a seamless purchase flow.
              </Text>
            </View>

            {/* Email */}
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => Linking.openURL("mailto:abdurhamannur894@gmail.com")}
                activeOpacity={0.7}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: COLORS.card,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.gold + "50",
                }}
              >
                <Mail color={COLORS.gold} size={20} />
              </TouchableOpacity>
              <Text style={{ fontFamily: fontFamily, fontSize: 10, color: COLORS.muted, marginTop: 6 }}>Contact us</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
