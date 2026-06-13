import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft, Upload, CheckCircle, CreditCard, Camera } from "lucide-react-native";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../theme/theme";
import { useCartStore } from "../stores/cartStore";
import { api } from "../services/api";

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [receiptUri, setReceiptUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = getTotal();

  const pickImage = async (useCamera) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Camera/gallery access is required");
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });

    if (!result.canceled && result.assets[0]) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const handleSubmitReceipt = async () => {
    if (!receiptUri) return;
    setUploading(true);
    try {
      const order = await api.createOrder();
      await api.uploadReceipt(order._id, receiptUri);
      clearCart();
      setSuccess(true);
    } catch (err) {
      Alert.alert("Upload failed", err.message || "Please try again");
    } finally {
      setUploading(false);
    }
  };

  if (!fontsLoaded) return null;

  if (success) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <LinearGradient colors={["#12144A22", "#0B0C1A"]} style={StyleSheet.absoluteFill} />
        <View style={styles.successContainer}>
          <CheckCircle color={COLORS.gold} size={72} strokeWidth={1.5} />
          <Text style={styles.successTitle}>Receipt Submitted!</Text>
          <Text style={styles.successSub}>
            Your payment receipt has been sent for review. We'll notify you once it's approved.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            style={styles.homeBtn}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <LinearGradient colors={["#12144A22", "#0B0C1A"]} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color={COLORS.gold} size={20} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.paymentInfo}>
          <CreditCard color={COLORS.gold} size={24} strokeWidth={1.5} />
          <Text style={styles.paymentTitle}>Payment Instructions</Text>
          <Text style={styles.paymentText}>
            Send the total amount of{" "}
            <Text style={styles.bold}>ETB {total.toLocaleString()}</Text> to the following
            account:
          </Text>
          <View style={styles.accountBox}>
            <Text style={styles.accountLabel}>Bank</Text>
            <Text style={styles.accountValue}>Commercial Bank of Ethiopia</Text>
            <Text style={styles.accountLabel}>Account Name</Text>
            <Text style={styles.accountValue}>Clintapp Books</Text>
            <Text style={styles.accountLabel}>Account Number</Text>
            <Text style={styles.accountValue}>1000123456789</Text>
          </View>
          <Text style={styles.paymentHint}>
            After sending, take a photo or upload a screenshot of the receipt below.
          </Text>
        </View>

        <View style={styles.receiptSection}>
          <Text style={styles.sectionTitle}>Upload Receipt</Text>

          {receiptUri ? (
            <View style={styles.receiptPreview}>
              <Image source={{ uri: receiptUri }} style={styles.receiptImage} />
              <TouchableOpacity onPress={() => setReceiptUri(null)} style={styles.removeBtn}>
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadOptions}>
              <TouchableOpacity onPress={() => pickImage(true)} style={styles.uploadBtn}>
                <Camera color={COLORS.gold} size={28} strokeWidth={1.5} />
                <Text style={styles.uploadBtnLabel}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage(false)} style={styles.uploadBtn}>
                <Upload color={COLORS.gold} size={28} strokeWidth={1.5} />
                <Text style={styles.uploadBtnLabel}>Pick from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.bookId} style={styles.orderItem}>
              <Text style={styles.orderItemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.orderItemQty}>x{item.quantity}</Text>
              <Text style={styles.orderItemPrice}>
                ETB {(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>ETB {total.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={handleSubmitReceipt}
          disabled={!receiptUri || uploading}
          style={[styles.submitBtn, (!receiptUri || uploading) && styles.submitBtnDisabled]}
        >
          {uploading ? (
            <ActivityIndicator color={COLORS.bg} size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Receipt</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  headerTitle: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 20,
    color: COLORS.white,
  },
  content: { paddingHorizontal: SPACING.xl, paddingBottom: 120 },
  paymentInfo: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
  },
  paymentTitle: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 18,
    color: COLORS.white,
    marginTop: 8,
    marginBottom: 8,
  },
  paymentText: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 13,
    color: COLORS.mutedLight,
    textAlign: "center",
    lineHeight: 20,
  },
  bold: { fontFamily: "CrimsonPro_700Bold", color: COLORS.gold },
  accountBox: {
    width: "100%",
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  accountLabel: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  accountValue: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 14,
    color: COLORS.gold,
    marginTop: 2,
  },
  paymentHint: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: SPACING.md,
    lineHeight: 18,
  },
  receiptSection: { marginBottom: SPACING.lg },
  sectionTitle: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 16,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  uploadOptions: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  uploadBtn: {
    flex: 1,
    height: 100,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderStyle: "dashed",
    gap: 8,
  },
  uploadBtnLabel: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 12,
    color: COLORS.muted,
  },
  receiptPreview: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  receiptImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
  removeBtn: {
    backgroundColor: COLORS.danger + "22",
    paddingVertical: 10,
    alignItems: "center",
  },
  removeBtnText: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 13,
    color: COLORS.danger,
  },
  orderSummary: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  orderItemTitle: {
    flex: 1,
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 13,
    color: COLORS.white,
  },
  orderItemQty: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 12,
    color: COLORS.muted,
    marginHorizontal: 12,
  },
  orderItemPrice: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 13,
    color: COLORS.gold,
    minWidth: 80,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.bgElevated,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  submitBtn: {
    width: "100%",
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.gold,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 16,
    color: COLORS.bg,
    letterSpacing: 0.5,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  successTitle: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 24,
    color: COLORS.white,
    marginTop: SPACING.lg,
    marginBottom: 8,
  },
  successSub: {
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  homeBtn: {
    height: 48,
    paddingHorizontal: 32,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.gold,
  },
  homeBtnText: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 15,
    color: COLORS.bg,
  },
});
