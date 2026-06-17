import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  Moon,
  Church,
  Feather,
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Bookmark,
  Type,
  Sun,
  Moon as MoonIcon,
  Highlighter,
  MessageCircle,
  Plus,
  Check,
  Clock,
  Lock,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";
import { CartButton } from "../../components/CartButton";
import { useCartStore } from "../../stores/cartStore";
import { useReaderStore } from "../../stores/readerStore";
import ManuscriptReader from "../../components/ManuscriptReader";
import { FadeInView, ScaleInView, ScaleButton } from "../../components/animations";
import { api, getImageUrl } from "../../services/api";


const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmall = SCREEN_WIDTH < 360;

const ICON_MAP = {
  Moon,
  Church,
  Feather,
  BookOpen,
};

export default function BookDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [saved, setSaved] = useState(false);
  const [fontLevel, setFontLevel] = useState(1);
  const [theme, setTheme] = useState(0);
  const [highlighted, setHighlighted] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const { addItem, getItem } = useCartStore();
  const { bookmarks, toggleBookmark } = useReaderStore();
  const isBookmarked = bookmarks.some((b) => b.bookId === String(id));

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [underReviewBooks, setUnderReviewBooks] = useState([]);
  const [rejectedBooks, setRejectedBooks] = useState([]);
  const isPurchased = purchasedBooks.includes(String(id));
  const isUnderReview = underReviewBooks.includes(String(id));
  const isRejected = rejectedBooks.includes(String(id));

  useEffect(() => {
    Promise.all([
      api.getBook(id),
      api.getOrders().catch(() => []),
      api.getReceipts().catch(() => []),
    ]).then(([bookData, orders, receipts]) => {
      setBook(bookData);
      const purchased = [];
      const pending = [];
      const rejected = [];
      const orderMap = {};
      orders.forEach((o) => {
        orderMap[String(o._id)] = o;
        o.items?.forEach((item) => {
          const bid = String(item.bookId?._id || item.bookId);
          if (o.status === "confirmed") purchased.push(bid);
        });
      });
      receipts.forEach((r) => {
        const oid = String(r.orderId?._id || r.orderId);
        const order = orderMap[oid];
        if (r.status === "rejected") {
          order?.items?.forEach((item) => {
            const bid = String(item.bookId?._id || item.bookId);
            if (!purchased.includes(bid)) rejected.push(bid);
          });
        } else if (r.status === "pending") {
          order?.items?.forEach((item) => {
            const bid = String(item.bookId?._id || item.bookId);
            if (!purchased.includes(bid) && !rejected.includes(bid)) pending.push(bid);
          });
        }
      });
      setPurchasedBooks(purchased);
      setUnderReviewBooks(pending);
      setRejectedBooks(rejected);
    }).catch((err) => {
      console.error('Book fetch error:', err);
    }).finally(() => setLoading(false));
  }, [id]);

  const fontSizes = [13, 15, 18];
  const fontSize = fontSizes[fontLevel];

  const handleBuy = useCallback(() => {
    if (!book) return;
    addItem({
      bookId: book._id || String(id),
      title: book.title,
      titleAm: book.titleAm,
      author: book.author,
      price: book.price,
      coverColor: book.color,
      iconName: book.iconName || 'BookOpen',
      category: book.category,
      coverUrl: book.coverUrl || '',
    });
    Alert.alert("Added to Cart", "Go to cart to complete your purchase", [
      { text: "Stay", style: "cancel" },
      { text: "View Cart", onPress: () => router.push("/(tabs)/cart") },
    ]);
  }, [book, id, addItem, router]);

  const handleShare = useCallback(() => {
    if (!book) return;
    Share.share({
      message: `${book.title} — ${book.titleAm}\n\n${book.description}\n\nRead more on ንባብ ቤት`,
      title: book.title,
    });
  }, [book]);

  const handleToggleFont = useCallback(() => {
    setFontLevel((prev) => (prev + 1) % 3);
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev + 1) % 3);
  }, []);

  const handleToggleHighlight = useCallback(() => {
    setHighlighted((prev) => !prev);
  }, []);

  const handleToggleBookmark = useCallback(() => {
    if (!book) return;
    toggleBookmark({
      bookId: book._id || String(id),
      verseNumber: Math.round(book.pages * (book.progress || 0)),
      chapterNumber: 1,
      label: book.title,
    });
    Alert.alert(isBookmarked ? "Removed" : "Bookmarked", isBookmarked ? "Bookmark removed" : "Added to your bookmarks");
  }, [book, id, isBookmarked, toggleBookmark]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: COLORS.muted, fontFamily: "CrimsonPro_400Regular", fontSize: 16 }}>Book not found</Text>
      </View>
    );
  }

  const isInCart = getItem(String(id));
  const Icon = ICON_MAP[book.iconName] || BookOpen;
  const themes = [
    { bg: COLORS.bg, text: COLORS.white, label: "Dark" },
    { bg: "#F5E6C8", text: "#2A1A0A", label: "Sepia" },
    { bg: "#FFFFFF", text: "#1A1A1A", label: "Light" },
  ];
  const currentTheme = themes[theme];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient
        colors={["#12144A22", "#0B0C1A"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Hero Header */}
      <FadeInView>
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: SPACING.xl,
          paddingBottom: SPACING.lg,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ScaleButton onPress={() => router.back()}>
          <View
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
            <ArrowLeft color={COLORS.gold} size={20} strokeWidth={2} />
          </View>
        </ScaleButton>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <ScaleButton onPress={handleShare}>
          <View
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
            <Share2 color={COLORS.mutedLight} size={18} />
          </View>
          </ScaleButton>
          <ScaleButton onPress={() => setSaved(!saved)}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: saved ? COLORS.gold + "22" : COLORS.card,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: saved ? COLORS.gold : COLORS.cardBorder,
            }}
          >
            <Heart
              color={saved ? COLORS.gold : COLORS.mutedLight}
              size={18}
              fill={saved ? COLORS.gold : "none"}
              strokeWidth={2}
            />
          </View>
          </ScaleButton>
          <CartButton onPress={() => router.push("/(tabs)/cart")} />
        </View>
      </View>
      </FadeInView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Book Cover */}
        <ScaleInView delay={100}>
        <View
          style={{
            alignItems: "center",
            paddingVertical: SPACING.xl,
          }}
        >
          {(() => {
            const coverSrc = getImageUrl(book.coverUrl);
            if (coverSrc) return <Image source={{ uri: coverSrc }} style={{ width: 180, height: 260, borderRadius: RADIUS.md, borderWidth: 2, borderColor: COLORS.gold + "60" }} resizeMode="cover" />;
            return (
            <LinearGradient
              colors={[book.color, "#1A1B3A"]}
              style={{
                width: 180,
                height: 260,
                borderRadius: RADIUS.md,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: COLORS.gold + "60",
                ...SHADOWS.gold,
              }}
            >
              <Icon color={COLORS.gold} size={64} strokeWidth={1.2} />
              <View
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 16,
                  right: 16,
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: "CrimsonPro_700Bold",
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 4,
                  }}
                >
                  {book.titleAm}
                </Text>
                <Text
                  style={{
                    color: COLORS.gold,
                    fontFamily: "CrimsonPro_400Regular",
                    fontSize: 11,
                    textAlign: "center",
                    letterSpacing: 1,
                  }}
                >
                  {book.author.toUpperCase()}
                </Text>
              </View>
            </LinearGradient>
            );
          })()}
        </View>
        </ScaleInView>

        {/* Book Info */}
        <FadeInView delay={200}>
        <View
          style={{
            paddingHorizontal: SPACING.xl,
            alignItems: "center",
            marginBottom: SPACING.xl,
          }}
        >
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 26,
              color: COLORS.white,
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            {book.title}
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 16,
              color: COLORS.gold,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            {book.titleAm} · {book.author}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: COLORS.card,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: RADIUS.pill,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
            }}
          >
            <Text
              style={{
                color: COLORS.muted,
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 12,
              }}
            >
              {book.pages} pages · {book.chapters} chapters
            </Text>
          </View>
        </View>
        </FadeInView>

        {/* Description */}
        <FadeInView delay={400}>
        <View
          style={{
            marginHorizontal: SPACING.xl,
            marginBottom: SPACING.lg,
          }}
        >
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 18,
              color: COLORS.white,
              marginBottom: 8,
            }}
          >
            About this book
          </Text>
          <Text
            style={{
              color: COLORS.mutedLight,
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            {book.description}
          </Text>
        </View>
        </FadeInView>




      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: SPACING.xl,
          paddingTop: SPACING.md,
          paddingBottom: insets.bottom + SPACING.lg,
          backgroundColor: COLORS.bgElevated,
          borderTopWidth: 1,
          borderTopColor: COLORS.cardBorder,
          gap: SPACING.sm,
        }}
      >
        {isPurchased ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setReaderOpen(true)}
            style={{
              width: "100%",
              height: 54,
              borderRadius: RADIUS.md,
              backgroundColor: COLORS.gold,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              ...SHADOWS.gold,
            }}
          >
            <BookOpen color={COLORS.bg} size={18} strokeWidth={2} />
            <Text
              style={{
                color: COLORS.bg,
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 17,
                letterSpacing: 0.5,
              }}
            >
              Reading Now
            </Text>
          </TouchableOpacity>
        ) : isUnderReview ? (
          <TouchableOpacity
            activeOpacity={1}
            disabled
            style={{
              width: "100%",
              height: 54,
              borderRadius: RADIUS.md,
              backgroundColor: COLORS.card,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              borderWidth: 1,
              borderColor: COLORS.gold + "50",
            }}
          >
            <Clock color={COLORS.gold} size={18} strokeWidth={2} />
            <Text
              style={{
                color: COLORS.gold,
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 17,
                letterSpacing: 0.5,
              }}
            >
              Under Review
            </Text>
          </TouchableOpacity>
        ) : isRejected ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleBuy}
            style={{
              width: "100%",
              height: 54,
              borderRadius: RADIUS.md,
              backgroundColor: COLORS.card,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              borderWidth: 1,
              borderColor: "#ff4444" + "60",
            }}
          >
            <ShoppingCart color="#ff4444" size={18} strokeWidth={2} />
            <Text
              style={{
                color: "#ff4444",
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 17,
                letterSpacing: 0.5,
              }}
            >
              Rejected — Buy Again
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleBuy}
            style={{
              width: "100%",
              height: 54,
              borderRadius: RADIUS.md,
              backgroundColor: COLORS.gold,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              ...SHADOWS.gold,
            }}
          >
            <ShoppingCart color={COLORS.bg} size={18} strokeWidth={2} />
            <Text
              style={{
                color: COLORS.bg,
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 17,
                letterSpacing: 0.5,
              }}
            >
              Buy
            </Text>
          </TouchableOpacity>
        )}
      </View>


      {readerOpen && book && (
        <View style={StyleSheet.absoluteFill}>
          <ManuscriptReader
            bookId={book.sacredType || String(book._id)}
            hadithSlug={book.bookSlug || undefined}
            hadithTitle={book.bookSlug ? book.title : undefined}
            onBack={() => setReaderOpen(false)}
          />
        </View>
      )}
    </View>
  );
}
