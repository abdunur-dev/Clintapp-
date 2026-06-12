const API_BASE = __DEV__
  ? 'http://localhost:4000/api'
  : 'https://your-production-api.com/api';

export interface Book {
  _id: string;
  title: string;
  titleAm?: string;
  author: string;
  category: string;
  pages: number;
  chapters: number;
  rating: number;
  price: number;
  color: string;
  iconName: string;
  description: string;
  sample?: string;
  progress?: number;
  coverUrl?: string;
  isSacred?: boolean;
  sacredType?: string | null;
}

export interface CartItemData {
  _id?: string;
  bookId: string;
  title: string;
  titleAm?: string;
  author?: string;
  price: number;
  quantity: number;
  coverColor?: string;
  iconName?: string;
  category?: string;
}

export interface NoteData {
  _id?: string;
  title: string;
  content: string;
  type: 'note' | 'quote' | 'highlight';
  tag: string;
  bookId?: string | null;
  verseRef?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderData {
  _id?: string;
  items: { bookId: string; title: string; price: number; quantity: number }[];
  total: number;
  status: string;
  createdAt?: string;
}

export interface BookmarkData {
  _id?: string;
  bookId: string;
  verseNumber: number;
  chapterNumber: number;
  label?: string;
}

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },

  // Books
  getBooks: (category?: string) =>
    api.get<Book[]>(`/books${category ? `?category=${category}` : ''}`),
  getBook: (id: string) => api.get<Book>(`/books/${id}`),
  getSacredBooks: () => api.get<Book[]>('/books/sacred'),

  // Cart
  getCart: () => api.get<{ items: CartItemData[]; count: number; total: number }>('/cart'),
  addToCart: (item: Omit<CartItemData, '_id' | 'quantity'>) =>
    api.post<CartItemData>('/cart', item),
  updateCartItem: (bookId: string, quantity: number) =>
    api.patch<CartItemData>(`/cart/${bookId}`, { quantity }),
  removeFromCart: (bookId: string) => api.delete(`/cart/${bookId}`),
  clearCart: () => api.delete('/cart'),

  // Orders
  getOrders: () => api.get<OrderData[]>('/orders'),
  createOrder: () => api.post<OrderData>('/orders', {}),

  // Notes
  getNotes: (params?: { tag?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.tag && params.tag !== 'All') q.set('tag', params.tag);
    if (params?.search) q.set('search', params.search);
    const qs = q.toString();
    return api.get<NoteData[]>(`/notes${qs ? `?${qs}` : ''}`);
  },
  createNote: (note: Omit<NoteData, '_id'>) => api.post<NoteData>('/notes', note),
  updateNote: (id: string, note: Partial<NoteData>) => api.put<NoteData>(`/notes/${id}`, note),
  deleteNote: (id: string) => api.delete(`/notes/${id}`),

  // Bookmarks
  getBookmarks: (bookId: string) => api.get<BookmarkData[]>(`/bookmarks/${bookId}`),
  toggleBookmark: (bm: Omit<BookmarkData, '_id'>) => api.post<BookmarkData>('/bookmarks', bm),
  removeBookmark: (id: string) => api.delete(`/bookmarks/${id}`),
};
