import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  PenTool,
  Plus,
  Moon,
  Church,
  Feather,
  BookOpen,
  Trash2,
  X,
  Check,
  Quote,
  Tag,
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

const INITIAL_NOTES = [
  {
    id: 1,
    title: "Quran — Surah Al-Baqarah 2:286",
    note: "Allah does not burden a soul beyond that it can bear. This verse gives me peace whenever I face hardship.",
    tag: "Islamic",
    isQuote: true,
    date: "May 20, 2026",
    icon: Moon,
  },
  {
    id: 2,
    title: "Meditations — Book IV",
    note: "You have power over your mind, not outside events. Realize this, and you will find strength. Marcus Aurelius speaks directly to my soul.",
    tag: "Philosophy",
    isQuote: true,
    date: "May 19, 2026",
    icon: Feather,
  },
  {
    id: 3,
    title: "Personal Reflection",
    note: "Reading ፍቅር እስከ መቃብር — the theme of love transcending death resonates deeply with Ethiopian cultural values. The prose is gorgeous.",
    tag: "Fiction",
    isQuote: false,
    date: "May 18, 2026",
    icon: BookOpen,
  },
  {
    id: 4,
    title: "John 3:16 — The Bible",
    note: "For God so loved the world that He gave His only begotten Son. The foundation of Christian faith and eternal hope.",
    tag: "Christianity",
    isQuote: true,
    date: "May 15, 2026",
    icon: Church,
  },
];

const TAG_COLORS = {
  Islamic: "#4A8C5C",
  Christianity: "#5C6A9A",
  Philosophy: "#8C6A3A",
  Fiction: "#7A4A8C",
  Personal: "#3A7A8C",
};

function StarField() {
  const stars = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    top: Math.random() * 200,
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

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [menuOpen, setMenuOpen] = useState(false);

  if (!fontsLoaded) return null;

  const filtered =
    activeFilter === "All"
      ? notes
      : notes.filter((n) => n.tag === activeFilter);

  const addNote = () => {
    if (!newTitle.trim() || !newNote.trim()) return;
    setNotes([
      {
        id: Date.now(),
        title: newTitle,
        note: newNote,
        tag: "Personal",
        isQuote: false,
        date: "May 21, 2026",
        icon: PenTool,
      },
      ...notes,
    ]);
    setNewTitle("");
    setNewNote("");
    setShowModal(false);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const filters = [
    "All",
    "Islamic",
    "Christianity",
    "Philosophy",
    "Fiction",
    "Personal",
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient
        colors={["#12144A18", "#0B0C1A"]}
        style={StyleSheet.absoluteFill}
      />
      <StarField />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: SPACING.xl,
          paddingBottom: SPACING.lg,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
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
            marginRight: SPACING.md,
          }}
        >
          <MenuIcon color={COLORS.gold} size={20} strokeWidth={2} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 13,
              color: COLORS.muted,
              letterSpacing: 3,
            }}
          >
            ANNOTATIONS
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_700Bold",
              fontSize: 28,
              color: COLORS.white,
              marginTop: 4,
            }}
          >
            Notes
          </Text>
          <Text
            style={{
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 14,
              color: COLORS.gold,
            }}
          >
            ማስታወሻዎች
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          activeOpacity={0.8}
          style={{
            backgroundColor: COLORS.gold,
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
            ...SHADOWS.gold,
          }}
        >
          <Plus color={COLORS.bg} size={22} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 18,
              backgroundColor: activeFilter === f ? COLORS.gold : COLORS.card,
              borderWidth: 1,
              borderColor: activeFilter === f ? COLORS.gold : COLORS.cardBorder,
            }}
          >
            <Text
              style={{
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 12,
                color: activeFilter === f ? COLORS.bg : COLORS.muted,
              }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notes List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 80 }}>
            <PenTool color={COLORS.muted} size={48} strokeWidth={1} />
            <Text
              style={{
                fontFamily: "CrimsonPro_700Bold",
                fontSize: 20,
                color: COLORS.mutedLight,
                marginTop: 16,
              }}
            >
              No notes yet
            </Text>
            <Text
              style={{
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 14,
                color: COLORS.muted,
                marginTop: 6,
                textAlign: "center",
              }}
            >
              Tap + to add a note or highlight from a book
            </Text>
          </View>
        ) : (
          filtered.map((note) => (
            <View
              key={note.id}
              style={{
                backgroundColor: COLORS.card,
                borderRadius: 16,
                padding: 18,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: COLORS.accent,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: COLORS.cardBorder,
                    }}
                  >
                    {note.isQuote ? (
                      <Quote color={COLORS.gold} size={14} strokeWidth={1.5} />
                    ) : (
                      <PenTool
                        color={COLORS.gold}
                        size={14}
                        strokeWidth={1.5}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: "CrimsonPro_700Bold",
                      fontSize: 14,
                      color: COLORS.white,
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {note.title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteNote(note.id)}
                  style={{ marginLeft: 8 }}
                >
                  <Trash2 color={COLORS.muted} size={16} />
                </TouchableOpacity>
              </View>

              {note.isQuote && (
                <View
                  style={{
                    borderLeftWidth: 2,
                    borderLeftColor: COLORS.gold,
                    paddingLeft: 12,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "CrimsonPro_400Regular",
                      fontSize: 14,
                      color: COLORS.mutedLight,
                      lineHeight: 22,
                      fontStyle: "italic",
                    }}
                  >
                    "{note.note}"
                  </Text>
                </View>
              )}
              {!note.isQuote && (
                <Text
                  style={{
                    fontFamily: "CrimsonPro_400Regular",
                    fontSize: 14,
                    color: COLORS.mutedLight,
                    lineHeight: 22,
                    marginBottom: 10,
                  }}
                >
                  {note.note}
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Tag color={TAG_COLORS[note.tag] || COLORS.muted} size={12} />
                  <View
                    style={{
                      backgroundColor:
                        (TAG_COLORS[note.tag] || COLORS.muted) + "22",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "CrimsonPro_700Bold",
                        fontSize: 11,
                        color: TAG_COLORS[note.tag] || COLORS.muted,
                      }}
                    >
                      {note.tag}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontFamily: "CrimsonPro_400Regular",
                    fontSize: 11,
                    color: COLORS.muted,
                  }}
                >
                  {note.date}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Note Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "#0B0C1Aee",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
              paddingBottom: insets.bottom + 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "CrimsonPro_700Bold",
                  fontSize: 20,
                  color: COLORS.white,
                }}
              >
                New Note
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X color={COLORS.muted} size={22} />
              </TouchableOpacity>
            </View>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Title (e.g. book name or topic)"
              placeholderTextColor={COLORS.muted}
              style={{
                backgroundColor: COLORS.accent,
                borderRadius: 12,
                padding: 14,
                color: COLORS.white,
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 15,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
              }}
            />
            <TextInput
              value={newNote}
              onChangeText={setNewNote}
              placeholder="Write your note or paste a quote…"
              placeholderTextColor={COLORS.muted}
              multiline
              numberOfLines={5}
              style={{
                backgroundColor: COLORS.accent,
                borderRadius: 12,
                padding: 14,
                color: COLORS.white,
                fontFamily: "CrimsonPro_400Regular",
                fontSize: 15,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                height: 120,
                textAlignVertical: "top",
              }}
            />

            <TouchableOpacity
              onPress={addNote}
              style={{
                backgroundColor: COLORS.gold,
                borderRadius: 14,
                paddingVertical: 14,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Check color={COLORS.bg} size={18} />
              <Text
                style={{
                  fontFamily: "CrimsonPro_700Bold",
                  fontSize: 16,
                  color: COLORS.bg,
                }}
              >
                Save Note
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <HamburgerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
