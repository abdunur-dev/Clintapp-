import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

export default function LanguageSelector({ languages, selected, onSelect, label }) {
  const [open, setOpen] = useState(false);
  const current = languages.find(l => l.id === selected);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        style={styles.selector}
      >
        <View style={styles.selectorContent}>
          <Text style={styles.selectorLang}>{current?.label || selected}</Text>
          <Text style={styles.selectorEn}>{current?.labelEn || ''}</Text>
        </View>
        <ChevronDown color={COLORS.gold} size={12} strokeWidth={2.5} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select Language'}</Text>
            </View>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const active = item.id === selected;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item.id);
                      setOpen(false);
                    }}
                    activeOpacity={0.7}
                    style={[styles.langItem, active && styles.langItemActive]}
                  >
                    <View>
                      <Text style={[styles.langLabel, active && styles.langLabelActive]}>
                        {item.label}
                      </Text>
                      <Text style={styles.langEn}>{item.labelEn}</Text>
                    </View>
                    {active && (
                      <Check color={COLORS.gold} size={18} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.manuscriptBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder + '80',
    gap: 6,
    minWidth: 80,
  },
  selectorContent: {
    flexDirection: 'column',
  },
  selectorLang: {
    fontSize: 12,
    color: COLORS.gold,
    fontFamily: 'CrimsonPro_700Bold',
    letterSpacing: 0.5,
  },
  selectorEn: {
    fontSize: 8,
    color: COLORS.goldDim,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 12, 26, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '75%',
    maxHeight: '60%',
    backgroundColor: COLORS.manuscriptBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gold + '60',
    overflow: 'hidden',
    ...SHADOWS.gold,
  },
  modalHeader: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.goldDim + '40',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    color: COLORS.gold,
    fontFamily: 'CrimsonPro_700Bold',
    letterSpacing: 1,
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.goldDim + '20',
  },
  langItemActive: {
    backgroundColor: COLORS.gold + '10',
  },
  langLabel: {
    fontSize: 16,
    color: COLORS.parchment,
    fontFamily: 'CrimsonPro_400Regular',
    marginBottom: 2,
  },
  langLabelActive: {
    color: COLORS.goldLight,
    fontFamily: 'CrimsonPro_700Bold',
  },
  langEn: {
    fontSize: 10,
    color: COLORS.goldDim,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});