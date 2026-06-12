import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export interface Verse {
  number: number;
  text: string;
  translation?: string;
}

export interface Chapter {
  number: number;
  title?: string;
  verses: Verse[];
}

export interface LanguagePair {
  left: string;
  right: string;
}

export interface Bookmark {
  verseNumber: number;
  chapterNumber: number;
  bookId: string;
  label?: string;
  createdAt: number;
}

interface ReaderState {
  leftLang: string;
  rightLang: string;
  selectedVerse: number | null;
  panelOpen: boolean;
  panelLang: string;
  bookmarks: Bookmark[];
  fontSize: number;
  showTranslationPanel: boolean;

  setLeftLang: (lang: string) => void;
  setRightLang: (lang: string) => void;
  setSelectedVerse: (verse: number | null) => void;
  setPanelOpen: (open: boolean) => void;
  setPanelLang: (lang: string) => void;
  toggleBookmark: (bookmark: Omit<Bookmark, 'createdAt'>) => void;
  isBookmarked: (verseNumber: number, chapterNumber: number, bookId: string) => boolean;
  setFontSize: (size: number) => void;
  setShowTranslationPanel: (show: boolean) => void;
  getBookmarksForBook: (bookId: string) => Bookmark[];
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      leftLang: 'arabic',
      rightLang: 'geez',
      selectedVerse: null,
      panelOpen: false,
      panelLang: 'amharic',
      bookmarks: [],
      fontSize: 16,
      showTranslationPanel: false,

      setLeftLang: (lang) => set({ leftLang: lang, selectedVerse: null }),
      setRightLang: (lang) => set({ rightLang: lang, selectedVerse: null }),
      setSelectedVerse: (verse) => set({ selectedVerse: verse }),
      setPanelOpen: (open) => set({ panelOpen: open }),
      setPanelLang: (lang) => set({ panelLang: lang }),
      setFontSize: (size) => set({ fontSize: Math.min(Math.max(size, 12), 24) }),
      setShowTranslationPanel: (show) => set({ showTranslationPanel: show }),

      toggleBookmark: (bookmark) => {
        const { bookmarks } = get();
        const exists = bookmarks.find(
          (b) =>
            b.verseNumber === bookmark.verseNumber &&
            b.chapterNumber === bookmark.chapterNumber &&
            b.bookId === bookmark.bookId
        );
        if (exists) {
          set({ bookmarks: bookmarks.filter((b) => b !== exists) });
        } else {
          set({ bookmarks: [...bookmarks, { ...bookmark, createdAt: Date.now() }] });
        }
        api.toggleBookmark({
          bookId: bookmark.bookId,
          verseNumber: bookmark.verseNumber,
          chapterNumber: bookmark.chapterNumber,
          label: bookmark.label,
        }).catch(() => {});
      },

      isBookmarked: (verseNumber, chapterNumber, bookId) => {
        return get().bookmarks.some(
          (b) =>
            b.verseNumber === verseNumber &&
            b.chapterNumber === chapterNumber &&
            b.bookId === bookId
        );
      },

      getBookmarksForBook: (bookId) => {
        return get().bookmarks.filter((b) => b.bookId === bookId);
      },
    }),
    {
      name: 'reader-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
