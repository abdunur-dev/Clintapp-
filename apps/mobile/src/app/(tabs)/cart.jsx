import React from "react";
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
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Star,
  Moon,
  Church,
  Feather,
  BookOpen,
  CreditCard,
  ChevronRight,
} from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/theme";
import { useCartStore } from "../../stores/cartStore";
import { FadeInView, ScaleInView } from "../../components/animations";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmall = SCREEN_WIDTH < 380;
const isTablet = SCREEN_WIDTH >= 768;

const ICON_MAP = {
  Moon: Moon,
  Church: Church,
  Feather: Feather,
  BookOpen: BookOpen,
};

function StarField() {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    top: Math.random() * 300,
    left: Math.random() * 400,
    size: Math.random() > 0.8 ? 3 : 2,
    opacity: 0.15 + Math.random() * 0.4,
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

function EmptyCart({ onShop }: { onShop: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <StarField />
      <View style={styles.emptyIconWrap}>
        <ShoppingBag color={COLORS.gold} size={48} strokeWidth={1.2} />
      </View>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven't added any{'\n'}books to your cart yet.
      </Text>
      <TouchableOpacity
        onPress={onShop}
        activeOpacity={0.8}
        style={styles.emptyBtn}
      >
        <BookOpen color={COLORS.bg} size={16} strokeWidth={2} />
        <Text style={styles.emptyBtnText}>Browse Books</Text>
      </TouchableOpacity>
    </View>
  );
}

function CartItemRow({
  item,
  onRemove,
  onIncrement,
  onDecrement,
}: {
  item: any;
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const IconComp = ICON_MAP[item.iconName] || BookOpen;

  return (
    <View style={styles.cartItem}>
      <LinearGradient
        colors={[item.coverColor || "#2A2B5A", "#1A1B3A"]}
        style={styles.itemCover}
      >
        <IconComp color={COLORS.gold} size={isSmall ? 22 : 28} strokeWidth={1.5} />
      </LinearGradient>

      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={styles.itemPrice}>ETB {item.price?.toFixed(2)}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            onPress={onDecrement}
            activeOpacity={0.7}
            style={styles.qtyBtn}
          >
            <Minus color={COLORS.gold} size={14} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.qtyValue}>
            <Text style={styles.qtyText}>{item.quantity}</Text>
          </View>
          <TouchableOpacity
            onPress={onIncrement}
            activeOpacity={0.7}
            style={styles.qtyBtn}
          >
            <Plus color={COLORS.gold} size={14} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemRight}>
        <Text style={styles.itemTotal}>
          ETB {(item.price * item.quantity)?.toFixed(2)}
        </Text>
        <TouchableOpacity
          onPress={onRemove}
          activeOpacity={0.7}
          style={styles.removeBtn}
        >
          <Trash2 color={COLORS.danger} size={16} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const { items, removeItem, updateQuantity, clearCart, getTotal, getCount } =
    useCartStore();

  if (!fontsLoaded) return null;

  const total = getTotal();
  const count = getCount();
  const delivery = total >= 500 ? 0 : 50;
  const grandTotal = total + delivery;

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#12144A22", "#0B0C1A", "#0B0C1A"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 10, paddingBottom: SPACING.lg },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.headerBtn}
        >
          <ArrowLeft color={COLORS.gold} size={20} strokeWidth={2} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>
            {count} {count === 1 ? "item" : "items"}
          </Text>
        </View>

        {count > 0 && (
          <TouchableOpacity
            onPress={() => clearCart()}
            activeOpacity={0.7}
            style={styles.headerBtn}
          >
            <Trash2 color={COLORS.danger} size={18} strokeWidth={1.8} />
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyCart onShop={() => router.push("/search")} />
      ) : (
        <>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: SPACING.xl,
              paddingBottom: 280,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Cart Items */}
            <View style={{ gap: SPACING.md }}>
              {items.map((item, i) => (
                <ScaleInView key={item.bookId} delay={i * 80}>
                <CartItemRow
                  item={item}
                  onRemove={() => removeItem(item.bookId)}
                  onIncrement={() => updateQuantity(item.bookId, item.quantity + 1)}
                  onDecrement={() => updateQuantity(item.bookId, item.quantity - 1)}
                />
                </ScaleInView>
              ))}
            </View>

            {/* Promo Hint */}
            {delivery > 0 && (
              <View style={styles.promoHint}>
                <Star color={COLORS.gold} size={14} fill={COLORS.gold} />
                <Text style={styles.promoText}>
                  Add ETB {(500 - total).toFixed(0)} more for free delivery
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Bottom Summary */}
          <View
            style={[
              styles.summaryBar,
              { paddingBottom: insets.bottom + SPACING.lg },
            ]}
          >
            <View style={styles.summaryInner}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>ETB {total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>
                  {delivery === 0 ? "FREE" : `ETB ${delivery.toFixed(2)}`}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ETB {grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.checkoutBtn}
            >
              <CreditCard color={COLORS.bg} size={18} strokeWidth={2} />
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <ChevronRight color={COLORS.bg} size={18} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  headerTitle: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 20,
    color: COLORS.white,
  },
  headerSubtitle: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xxxl,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.gold + "60",
    marginBottom: SPACING.xxl,
    ...SHADOWS.gold,
  },
  emptyTitle: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 24,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.xxl,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill,
    ...SHADOWS.gold,
  },
  emptyBtnText: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 14,
    color: COLORS.bg,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  itemCover: {
    width: SCREEN_WIDTH < 380 ? 48 : 56,
    height: SCREEN_WIDTH < 380 ? 68 : 78,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gold + "30",
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: "center",
  },
  itemTitle: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: isSmall ? 13 : 15,
    color: COLORS.white,
    marginBottom: 2,
  },
  itemAuthor: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 11,
    color: COLORS.gold,
    marginBottom: 4,
  },
  itemPrice: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 13,
    color: COLORS.goldLight,
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  qtyValue: {
    minWidth: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  qtyText: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 13,
    color: COLORS.white,
  },
  itemRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: SPACING.sm,
  },
  itemTotal: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: isSmall ? 12 : 14,
    color: COLORS.gold,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.danger + "18",
    justifyContent: "center",
    alignItems: "center",
  },
  promoHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.gold + "12",
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gold + "40",
    borderStyle: "dashed",
  },
  promoText: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 12,
    color: COLORS.gold,
    flex: 1,
  },
  summaryBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  summaryInner: {
    gap: 8,
    marginBottom: SPACING.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 13,
    color: COLORS.muted,
  },
  summaryValue: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 13,
    color: COLORS.mutedLight,
  },
  totalRow: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  totalLabel: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 16,
    color: COLORS.white,
  },
  totalValue: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 18,
    color: COLORS.gold,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.gold,
    ...SHADOWS.gold,
  },
  checkoutText: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 15,
    color: COLORS.bg,
    letterSpacing: 0.5,
  },
});