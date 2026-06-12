import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PenTool,
  Plus,
  Trash2,
  X,
  Check,
  Quote,
  Tag,
  Search,
  BookOpen,
  StickyNote,
  Clock,
  Filter,
} from 'lucide-react-native';
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_700Bold,
} from '@expo-google-fonts/crimson-pro';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../theme/theme';
import { FadeInView, ScaleInView, ScaleButton } from '../../components/animations';
import { api } from '../../services/api';

const STORAGE_KEY = '@app_notes';
const TAGS = ['Personal', 'Quote', 'Book Highlight', 'Study'];
const TAG_COLORS = {
  Personal: '#4A8C5C',
  Quote: '#C9A84C',
  'Book Highlight': '#5C6A9A',
  Study: '#8C6A3A',
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
            position: 'absolute',
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

function NoteCard({ note, onDelete, index, onPress }) {
  return (
    <FadeInView delay={index * 80} duration={350}>
      <ScaleInView delay={index * 80}>
        <TouchableOpacity onPress={() => onPress?.(note)} activeOpacity={0.85}>
          <View style={[styles.noteCard, note.isQuote && styles.noteCardQuote]}>
            <View style={styles.noteHeader}>
              <View style={styles.noteHeaderLeft}>
                <View style={[styles.noteIcon, { backgroundColor: (TAG_COLORS[note.tag] || COLORS.gold) + '22' }]}>
                  {note.isQuote ? (
                    <Quote color={TAG_COLORS[note.tag] || COLORS.gold} size={14} strokeWidth={1.5} />
                  ) : note.tag === 'Book Highlight' ? (
                    <BookOpen color={TAG_COLORS[note.tag] || COLORS.gold} size={14} strokeWidth={1.5} />
                  ) : (
                    <StickyNote color={TAG_COLORS[note.tag] || COLORS.gold} size={14} strokeWidth={1.5} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text>
                  <View style={styles.noteMeta}>
                    <Tag color={TAG_COLORS[note.tag] || COLORS.muted} size={10} />
                    <Text style={[styles.noteTag, { color: TAG_COLORS[note.tag] || COLORS.muted }]}>
                      {note.tag}
                    </Text>
                    <Text style={styles.noteDot}>·</Text>
                    <Clock color={COLORS.muted} size={10} />
                    <Text style={styles.noteDate}>{note.date}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => onDelete(note.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Trash2 color={COLORS.danger} size={16} strokeWidth={1.8} />
              </TouchableOpacity>
            </View>

            {note.isQuote ? (
              <View style={styles.quoteBlock}>
                <Text style={styles.quoteText}>"{note.note}"</Text>
              </View>
            ) : (
              <Text style={styles.noteBody} numberOfLines={3}>{note.note}</Text>
            )}

            {note.bookRef && (
              <View style={styles.bookRef}>
                <BookOpen color={COLORS.gold} size={10} />
                <Text style={styles.bookRefText}>From: {note.bookRef}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </ScaleInView>
    </FadeInView>
  );
}

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ CrimsonPro_400Regular, CrimsonPro_700Bold });
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('Personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0) saveNotes(notes);
  }, [notes]);

  const loadNotes = async () => {
    try {
      const data = await api.getNotes();
      if (data.length > 0) {
        setNotes(data);
        return;
      }
    } catch {}
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
  };

  const saveNotes = async (data) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  };

  const formatDate = () => {
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const addNote = () => {
    if (!newTitle.trim() || !newNote.trim()) return;
    const note = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      note: newNote.trim(),
      tag: newTag,
      isQuote: newTag === 'Quote',
      date: formatDate(),
      bookRef: null,
    };
    setNotes([note, ...notes]);
    api.createNote({
      title: note.title,
      content: note.note,
      type: note.isQuote ? 'quote' : 'note',
      tag: note.tag,
    }).catch(() => {});
    resetForm();
  };

  const updateNote = () => {
    if (!newTitle.trim() || !newNote.trim() || !editingNote) return;
    const updated = notes.map(n =>
      n.id === editingNote.id
        ? { ...n, title: newTitle.trim(), note: newNote.trim(), tag: newTag, isQuote: newTag === 'Quote' }
        : n
    );
    setNotes(updated);
    api.updateNote(editingNote.id, {
      title: newTitle.trim(),
      content: newNote.trim(),
      tag: newTag,
      type: newTag === 'Quote' ? 'quote' : 'note',
    }).catch(() => {});
    resetForm();
  };

  const deleteNote = (id) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setNotes(notes.filter(n => n.id !== id));
          api.deleteNote(id).catch(() => {});
        },
      },
    ]);
  };

  const resetForm = () => {
    setNewTitle('');
    setNewNote('');
    setNewTag('Personal');
    setShowModal(false);
    setEditingNote(null);
  };

  const openEditNote = (note) => {
    setEditingNote(note);
    setNewTitle(note.title);
    setNewNote(note.note);
    setNewTag(note.tag);
    setShowModal(true);
  };

  const filtered = notes.filter(n => {
    if (activeFilter !== 'All' && n.tag !== activeFilter) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.note.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#12144A18', '#0B0C1A']} style={StyleSheet.absoluteFill} />
      <StarField />

      {/* Header */}
      <FadeInView>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View>
            <Text style={styles.headerLabel}>ANNOTATIONS</Text>
            <Text style={styles.headerTitle}>Notes</Text>
            <Text style={styles.headerSub}>ማስታወሻዎች</Text>
          </View>
          <ScaleButton onPress={() => setShowModal(true)}>
            <View style={styles.addBtn}>
              <Plus color={COLORS.bg} size={22} strokeWidth={2.5} />
            </View>
          </ScaleButton>
        </View>
      </FadeInView>

      {/* Search */}
      <FadeInView delay={100}>
        <View style={styles.searchBar}>
          <Search color={COLORS.muted} size={16} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notes..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color={COLORS.muted} size={16} />
            </TouchableOpacity>
          ) : null}
        </View>
      </FadeInView>

      {/* Filter Tabs */}
      <FadeInView delay={150}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterStrip} contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: 8 }}>
          {['All', ...TAGS].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </FadeInView>

      {/* Notes List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <FadeInView delay={200}>
            <View style={styles.emptyState}>
              <PenTool color={COLORS.muted} size={48} strokeWidth={1} />
              <Text style={styles.emptyTitle}>
                {notes.length === 0 ? 'No notes yet' : 'No matching notes'}
              </Text>
              <Text style={styles.emptySub}>
                {notes.length === 0 ? 'Tap + to add your first note or highlight' : 'Try a different search or filter'}
              </Text>
            </View>
          </FadeInView>
        ) : (
          filtered.map((note, i) => (
            <NoteCard key={note.id} note={note} index={i} onDelete={deleteNote} onPress={openEditNote} />
          ))
        )}
      </ScrollView>

      {/* Add/Edit Note Modal */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={resetForm}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.modalHandle}>
              <View style={styles.handleBar} />
            </View>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingNote ? 'Edit Note' : 'New Note'}</Text>
              <TouchableOpacity onPress={resetForm}>
                <X color={COLORS.muted} size={22} />
              </TouchableOpacity>
            </View>

            {/* Tag selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
              {TAGS.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setNewTag(t)}
                  style={[styles.tagChip, newTag === t && { backgroundColor: (TAG_COLORS[t] || COLORS.gold) + '25', borderColor: TAG_COLORS[t] || COLORS.gold }]}
                >
                  <Text style={[styles.tagChipText, newTag === t && { color: TAG_COLORS[t] || COLORS.gold }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Title (book name or topic)"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />
            <TextInput
              value={newNote}
              onChangeText={setNewNote}
              placeholder={newTag === 'Quote' ? 'Paste a quote...' : newTag === 'Book Highlight' ? 'Highlighted passage...' : 'Write your note...'}
              placeholderTextColor={COLORS.muted}
              multiline
              style={[styles.input, styles.inputMultiline]}
            />

            <TouchableOpacity
              onPress={editingNote ? updateNote : addNote}
              activeOpacity={0.8}
              style={styles.saveBtn}
            >
              <Check color={COLORS.bg} size={18} />
              <Text style={styles.saveText}>{editingNote ? 'Update Note' : 'Save Note'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerLabel: { fontSize: 11, color: COLORS.muted, letterSpacing: 3, fontFamily: 'CrimsonPro_400Regular' },
  headerTitle: { fontSize: 28, color: COLORS.white, marginTop: 4, fontFamily: 'CrimsonPro_700Bold' },
  headerSub: { fontSize: 14, color: COLORS.gold, fontFamily: 'CrimsonPro_400Regular' },
  addBtn: {
    backgroundColor: COLORS.gold,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.gold,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 8,
  },
  searchInput: { flex: 1, color: COLORS.white, fontSize: 14, fontFamily: 'CrimsonPro_400Regular' },
  filterStrip: { flexGrow: 0, marginBottom: SPACING.lg },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterChipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  filterText: { fontFamily: 'CrimsonPro_700Bold', fontSize: 12, color: COLORS.muted },
  filterTextActive: { color: COLORS.bg },
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 120 },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontFamily: 'CrimsonPro_700Bold', fontSize: 20, color: COLORS.mutedLight, marginTop: 16 },
  emptySub: { fontFamily: 'CrimsonPro_400Regular', fontSize: 14, color: COLORS.muted, marginTop: 6, textAlign: 'center' },
  noteCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  noteCardQuote: { borderColor: COLORS.gold + '40' },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  noteHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  noteIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  noteTitle: { fontFamily: 'CrimsonPro_700Bold', fontSize: 15, color: COLORS.white },
  noteMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  noteTag: { fontSize: 10, fontFamily: 'CrimsonPro_700Bold', letterSpacing: 0.5 },
  noteDot: { fontSize: 10, color: COLORS.muted, marginHorizontal: 2 },
  noteDate: { fontSize: 10, color: COLORS.muted, fontFamily: 'CrimsonPro_400Regular' },
  quoteBlock: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.gold,
    paddingLeft: 12,
    marginBottom: 6,
  },
  quoteText: {
    fontFamily: 'CrimsonPro_400Regular',
    fontSize: 14,
    color: COLORS.mutedLight,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  noteBody: {
    fontFamily: 'CrimsonPro_400Regular',
    fontSize: 14,
    color: COLORS.mutedLight,
    lineHeight: 22,
    marginBottom: 6,
  },
  bookRef: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.cardBorder,
  },
  bookRefText: { fontSize: 10, color: COLORS.gold, fontFamily: 'CrimsonPro_400Regular' },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#0B0C1Aee',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalHandle: { alignItems: 'center', marginBottom: 16 },
  handleBar: { width: 40, height: 3, borderRadius: 1.5, backgroundColor: COLORS.goldDim, opacity: 0.5 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontFamily: 'CrimsonPro_700Bold', fontSize: 20, color: COLORS.white },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginRight: 8,
  },
  tagChipText: { fontSize: 12, color: COLORS.muted, fontFamily: 'CrimsonPro_700Bold' },
  input: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 14,
    color: COLORS.white,
    fontFamily: 'CrimsonPro_400Regular',
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  inputMultiline: { height: 120, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.gold,
  },
  saveText: { fontFamily: 'CrimsonPro_700Bold', fontSize: 16, color: COLORS.bg },
});