import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { useCartStore } from '../stores/cartStore';

export function CartButton({ onPress }: { onPress: () => void }) {
  const count = useCartStore((s) => s.getCount());

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View style={styles.iconWrapper}>
        <ShoppingCart color={COLORS.gold} size={20} strokeWidth={2} />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {count > 99 ? '99+' : count}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  iconWrapper: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  badgeText: {
    color: COLORS.bg,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'CrimsonPro_700Bold',
  },
});