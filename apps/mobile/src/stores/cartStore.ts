import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export interface CartItem {
  bookId: string;
  title: string;
  titleAm?: string;
  author: string;
  price: number;
  coverColor: string;
  iconName: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loaded: boolean;
  loadFromApi: () => Promise<void>;
  addItem: (book: Omit<CartItem, 'quantity'>) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
  getItem: (bookId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loaded: false,

      loadFromApi: async () => {
        try {
          const data = await api.getCart();
          set({
            items: data.items.map((i) => ({
              bookId: i.bookId,
              title: i.title,
              titleAm: i.titleAm || '',
              author: i.author || '',
              price: i.price,
              coverColor: i.coverColor || '',
              iconName: i.iconName || 'BookOpen',
              category: i.category || '',
              quantity: i.quantity,
            })),
            loaded: true,
          });
        } catch {
          // API not available, keep local state
          set({ loaded: true });
        }
      },

      addItem: (book) => {
        const state = get();
        const existing = state.items.find((i) => i.bookId === book.bookId);
        let newItems: CartItem[];
        if (existing) {
          newItems = state.items.map((i) =>
            i.bookId === book.bookId ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...state.items, { ...book, quantity: 1 }];
        }
        set({ items: newItems });
        api.addToCart(book).catch(() => {});
      },

      removeItem: (bookId) => {
        set((state) => ({
          items: state.items.filter((i) => i.bookId !== bookId),
        }));
        api.removeFromCart(bookId).catch(() => {});
      },

      updateQuantity: (bookId, qty) => {
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.bookId !== bookId)
              : state.items.map((i) =>
                  i.bookId === bookId ? { ...i, quantity: qty } : i
                ),
        }));
        api.updateCartItem(bookId, qty).catch(() => {});
      },

      clearCart: () => {
        set({ items: [] });
        api.clearCart().catch(() => {});
      },

      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getItem: (bookId) => get().items.find((i) => i.bookId === bookId),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
