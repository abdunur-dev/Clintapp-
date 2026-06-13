import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const UPLOADS = import.meta.env.VITE_UPLOADS_URL || "http://localhost:4000";

const theme = {
  bg: "#0B0C1A",
  surface: "#13142A",
  surfaceHover: "#1A1B3A",
  border: "#252650",
  gold: "#C9A84C",
  goldDim: "#C9A84C55",
  text: "#FFFFFF",
  muted: "#7878A0",
  mutedLight: "#A0A0C0",
  success: "#4A8C5C",
  danger: "#E05555",
};

function Icon({ name, size = 16, color = theme.muted }) {
  const paths = {
    receipts: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    books: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    database: "M4 7v10a4 4 0 004 4h8a4 4 0 004-4V7M4 7a4 4 0 014-4h8a4 4 0 014 4M4 7a4 4 0 014 4m0-4v4m8-4v4m-8 4a4 4 0 004 4h8",
    upload: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
    check: "M5 13l4 4L19 7",
    x: "M6 18L18 6M6 6l12 12",
    edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    menu: "M4 6h16M4 12h16M4 18h16",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] || paths.search} />
    </svg>
  );
}

/* ─── MEDIA QUERY HOOK ─── */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

/* ─── MAIN APP ─── */
function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("receipts");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") setLoggedIn(true);
    else alert("Wrong password");
  };

  if (!loggedIn) {
    return (
      <div style={s.loginWrap}>
        <div style={s.loginCard}>
          <div style={s.loginIcon}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 style={s.loginTitle}>ንባብ ቤት</h1>
          <p style={s.loginSub}>Admin Panel</p>
          <form onSubmit={handleLogin}>
            <div style={s.inputWrap}>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={s.loginInput} autoFocus />
            </div>
            <button type="submit" style={s.loginBtn}>Sign in</button>
          </form>
          <p style={{ color: theme.muted, fontSize: 11, marginTop: 16 }}>
            Hint: admin123
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "receipts", label: "Receipts", icon: "receipts" },
    { id: "books", label: "Books", icon: "books" },
    { id: "database", label: "Database", icon: "database" },
  ];

  const closeMobile = () => { if (isMobile) setSidebarOpen(false); };

  return (
    <div style={s.layout}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div style={s.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside style={{
        ...s.sidebar,
        transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        position: isMobile ? "fixed" : "relative",
        zIndex: isMobile ? 100 : "auto",
      }}>
        <div style={s.sidebarHeader}>
          <div style={s.sidebarBrand}>
            <h2 style={s.sidebarTitle}>ንባብ ቤት</h2>
            <p style={s.sidebarSub}>Admin</p>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={s.sidebarClose}>
              <Icon name="x" size={18} color={theme.muted} />
            </button>
          )}
        </div>
        <nav style={s.sidebarNav}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); closeMobile(); }}
              style={{
                ...s.navItem,
                backgroundColor: tab === t.id ? theme.bg : "transparent",
                color: tab === t.id ? theme.gold : theme.muted,
                borderLeft: tab === t.id ? `3px solid ${theme.gold}` : "3px solid transparent",
              }}
            >
              <Icon name={t.icon} size={16} color={tab === t.id ? theme.gold : theme.muted} />
              <span>{t.label}</span>
              {tab === t.id && <span style={s.navDot} />}
            </button>
          ))}
        </nav>
        <div style={s.sidebarFooter}>
          <button onClick={() => setLoggedIn(false)} style={s.logoutBtn}>
            <Icon name="x" size={14} color={theme.muted} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={s.mainWrap}>
        {/* Top bar */}
        <header style={s.topbar}>
          <div style={s.topbarLeft}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={s.hamburger}>
                <Icon name="menu" size={20} color={theme.text} />
              </button>
            )}
            <div>
              <h2 style={s.pageTitle}>{tabs.find((t) => t.id === tab)?.label || ""}</h2>
              <p style={s.pageSub}>Manage your book store</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={s.statusDot} />
            <span style={s.statusText}>Live</span>
          </div>
        </header>

        <div style={s.content}>
          {tab === "receipts" && <ReceiptsPanel />}
          {tab === "books" && <BooksPanel />}
          {tab === "database" && <DatabasePanel />}
        </div>
      </div>
    </div>
  );
}

/* ─── RECEIPTS ─── */
function ReceiptsPanel() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReceipts();
    const interval = setInterval(fetchReceipts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchReceipts = async () => {
    try {
      const res = await fetch(`${API}/receipts`);
      setReceipts(await res.json());
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const handleReview = async (id, status) => {
    try {
      await fetch(`${API}/receipts/${id}/review`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      fetchReceipts();
    } catch { alert("Failed"); }
  };

  const counts = [
    { key: "all", label: "Total", value: receipts.length, color: theme.gold },
    { key: "pending", label: "Pending", value: receipts.filter((r) => r.status === "pending").length, color: "#C9A84C" },
    { key: "approved", label: "Approved", value: receipts.filter((r) => r.status === "approved").length, color: theme.success },
    { key: "rejected", label: "Rejected", value: receipts.filter((r) => r.status === "rejected").length, color: theme.danger },
  ];

  const filtered = filter === "all" ? receipts : receipts.filter((r) => r.status === filter);

  return (
    <div>
      <div style={s.statsRow}>
        {counts.map((c) => (
          <div
            key={c.key}
            onClick={() => setFilter(c.key)}
            style={{
              ...s.statCard,
              borderColor: c.key === filter ? (c.color || theme.gold) : theme.border,
              "--glow": c.key === filter ? `${c.color}22` : "transparent",
              opacity: c.key === filter ? 1 : 0.55,
              cursor: "pointer",
            }}
          >
            <p style={{ ...s.statNum, color: c.color }}>{c.value}</p>
            <p style={s.statLabel}>{c.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={s.loadingState}>
          <div style={s.spinner} />
          <p>Loading receipts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>
          <Icon name="receipts" size={40} color={theme.muted} />
          <p>No receipts {filter !== "all" ? `with status "${filter}"` : "yet"}</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((receipt) => (
            <div key={receipt._id} style={s.card}>
              <div style={s.receiptImgWrap} onClick={() => setSelectedImage(`${UPLOADS}${receipt.imagePath}`)}>
                <img src={`${UPLOADS}${receipt.imagePath}`} alt="Receipt" style={s.receiptImg} />
                <div style={s.receiptOverlay}>
                  <Icon name="search" size={20} color={theme.text} />
                </div>
              </div>
              <div style={s.cardBody}>
                <div style={s.badgeRow}>
                  <span style={{ ...s.badge, backgroundColor: receipt.status === "approved" ? `${theme.success}22` : receipt.status === "rejected" ? `${theme.danger}22` : `${theme.gold}22`, color: receipt.status === "approved" ? theme.success : receipt.status === "rejected" ? theme.danger : theme.gold, borderColor: receipt.status === "approved" ? theme.success : receipt.status === "rejected" ? theme.danger : theme.gold }}>
                    {receipt.status}
                  </span>
                  <span style={s.date}>{new Date(receipt.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>Order</span>
                  <span style={s.cardValue}>#{receipt.orderId?._id?.slice(-8) || "—"}</span>
                </div>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>Items</span>
                  <span style={s.cardValue}>{receipt.orderId?.items?.map((i) => i.title).join(", ") || "—"}</span>
                </div>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>Total</span>
                  <span style={{ ...s.cardValue, color: theme.gold, fontWeight: 700 }}>
                    ETB {receipt.orderId?.total?.toLocaleString() || "—"}
                  </span>
                </div>
                {receipt.status === "pending" && (
                  <div style={s.actions}>
                    <button onClick={() => handleReview(receipt._id, "approved")} style={s.approveBtn}>
                      <Icon name="check" size={12} color={theme.text} /> Approve
                    </button>
                    <button onClick={() => handleReview(receipt._id, "rejected")} style={s.rejectBtn}>
                      <Icon name="x" size={12} color={theme.text} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div style={s.lightbox} onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full receipt" style={s.lightboxImg} />
        </div>
      )}
    </div>
  );
}

/* ─── BOOKS ─── */
function BooksPanel() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jsonText, setJsonText] = useState("");
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [search, setSearch] = useState("");
  const [showImport, setShowImport] = useState(false);

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API}/books`);
      setBooks(await res.json());
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const handleImport = async () => {
    let parsed;
    try { parsed = JSON.parse(jsonText); } catch { setMessage({ type: "error", text: "Invalid JSON format" }); return; }
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    setImporting(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/books/bulk`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ books: arr }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: `${data.count} book(s) imported successfully` });
      setJsonText("");
      setShowImport(false);
      fetchBooks();
    } catch (err) { setMessage({ type: "error", text: err.message }); } finally { setImporting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;
    try { await fetch(`${API}/books/${id}`, { method: "DELETE" }); fetchBooks(); } catch { alert("Failed"); }
  };

  const handleUpdate = async () => {
    if (!editBook) return;
    try {
      await fetch(`${API}/books/${editBook._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editBook) });
      setEditBook(null);
      fetchBooks();
    } catch { alert("Failed"); }
  };

  const filtered = books.filter(
    (b) => !search || b.title?.toLowerCase().includes(search.toLowerCase()) || b.author?.toLowerCase().includes(search.toLowerCase()) || b.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Toolbar */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <Icon name="search" size={14} color={theme.muted} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..." style={s.searchInput} />
          {search && <button onClick={() => setSearch("")} style={s.clearBtn}><Icon name="x" size={12} color={theme.muted} /></button>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowImport(!showImport)} style={showImport ? s.primaryBtn : s.secondaryBtn}>
            <Icon name="upload" size={12} color={showImport ? theme.bg : theme.gold} /> Import
          </button>
          <button onClick={fetchBooks} style={s.secondaryBtn}>
            <Icon name="refresh" size={12} color={theme.muted} />
          </button>
        </div>
      </div>

      {/* Import section */}
      {showImport && (
        <div style={s.importSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={s.sectionTitle}>Import Books JSON</h3>
            <button onClick={() => setShowImport(false)} style={s.iconBtnPlain}><Icon name="x" size={14} color={theme.muted} /></button>
          </div>
          <textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)} placeholder={`[\n  {\n    "title": "My Book",\n    "author": "Author",\n    "category": "Fiction",\n    "price": 199\n  }\n]`} style={s.jsonInput} rows={6} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            {message && <span style={{ color: message.type === "success" ? theme.success : theme.danger, fontSize: 13 }}>{message.text}</span>}
            <button onClick={handleImport} disabled={!jsonText.trim() || importing} style={{ ...s.primaryBtn, opacity: !jsonText.trim() || importing ? 0.5 : 1 }}>
              {importing ? "Importing..." : "Import Books"}
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={s.collectionStats}>
        <span style={s.collectionStat}>
          <strong>{books.length}</strong> total books
        </span>
        {[...new Set(books.map((b) => b.category))].filter(Boolean).map((cat) => (
          <span key={cat} style={s.collectionTag}>{cat}</span>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={s.loadingState}>
          <div style={s.spinner} />
          <p>Loading books...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>
          <Icon name="books" size={40} color={theme.muted} />
          <p>{search ? "No books match your search" : "No books yet. Import some above."}</p>
        </div>
      ) : (
        <div style={s.bookGrid}>
          {filtered.map((book) => (
            <div key={book._id} style={s.bookCard}>
              <div style={{ ...s.bookColor, backgroundColor: book.color || theme.border }}>
                <span style={s.bookInitial}>{book.title?.charAt(0) || "?"}</span>
              </div>
              <div style={s.bookInfo}>
                <p style={s.bookTitle}>{book.title}</p>
                <p style={s.bookAuthor}>{book.author}</p>
                <p style={s.bookMeta}>{book.category} · ETB {book.price?.toLocaleString()}</p>
              </div>
              <div style={s.bookActions}>
                <button onClick={() => setEditBook({ ...book })} style={s.smallBtn} title="Edit">
                  <Icon name="edit" size={11} color={theme.gold} />
                </button>
                <button onClick={() => handleDelete(book._id)} style={{ ...s.smallBtn, borderColor: `${theme.danger}33` }} title="Delete">
                  <Icon name="trash" size={11} color={theme.danger} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editBook && (
        <div style={s.modalOverlay} onClick={() => setEditBook(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ ...s.sectionTitle, margin: 0 }}>Edit Book</h3>
              <button onClick={() => setEditBook(null)} style={s.iconBtnPlain}><Icon name="x" size={16} color={theme.muted} /></button>
            </div>
            <div style={s.modalGrid}>
              {["title", "titleAm", "author", "category", "description", "sample", "color", "iconName", "price", "pages", "chapters", "rating"].map((field) => (
                <div key={field} style={field === "description" || field === "sample" ? { gridColumn: "1 / -1" } : {}}>
                  <label style={s.modalLabel}>{field}</label>
                  {field === "description" || field === "sample" ? (
                    <textarea value={editBook[field] || ""} onChange={(e) => setEditBook({ ...editBook, [field]: e.target.value })} style={s.modalInput} rows={3} />
                  ) : (
                    <input value={editBook[field] || ""} onChange={(e) => setEditBook({ ...editBook, [field]: e.target.value })} style={s.modalInput} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button onClick={() => setEditBook(null)} style={s.secondaryBtn}>Cancel</button>
              <button onClick={handleUpdate} style={s.primaryBtn}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── DATABASE ─── */
function DatabasePanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCol, setSelectedCol] = useState(null);
  const [error, setError] = useState(null);

  const fetchDb = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/db`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDb(); }, []);

  const collections = data ? Object.keys(data) : [];

  return (
    <div>
      <div style={s.toolbar}>
        <h3 style={{ ...s.sectionTitle, margin: 0 }}>Database · clintapp</h3>
        <button onClick={fetchDb} style={s.secondaryBtn}>
          <Icon name="refresh" size={12} color={theme.muted} /> Refresh
        </button>
      </div>

      {error && (
        <div style={s.errorBox}>
          <Icon name="x" size={14} color={theme.danger} />
          <span>Connection failed: {error}</span>
        </div>
      )}

      {loading ? (
        <div style={s.loadingState}>
          <div style={s.spinner} />
          <p>Loading database...</p>
        </div>
      ) : collections.length === 0 ? (
        <div style={s.emptyState}>
          <Icon name="database" size={40} color={theme.muted} />
          <p>No collections found</p>
        </div>
      ) : (
        <div style={s.dbLayout}>
          <div style={s.collectionList}>
            <p style={s.collectionListTitle}>Collections</p>
            {collections.map((name) => (
              <div
                key={name}
                onClick={() => setSelectedCol(name)}
                style={{
                  ...s.collectionItem,
                  backgroundColor: selectedCol === name ? theme.surface : "transparent",
                  color: selectedCol === name ? theme.gold : theme.text,
                  borderLeft: selectedCol === name ? `3px solid ${theme.gold}` : "3px solid transparent",
                }}
              >
                <span>{name}</span>
                <span style={s.collectionCount}>{data[name].length}</span>
              </div>
            ))}
          </div>

          <div style={s.dbContent}>
            {!selectedCol ? (
              <div style={s.emptyState}>
                <Icon name="database" size={32} color={theme.muted} />
                <p>Select a collection from the sidebar</p>
              </div>
            ) : (
              <div>
                <div style={s.collectionHeader}>
                  <h4 style={{ color: theme.gold, fontSize: 14, margin: 0 }}>
                    {selectedCol}
                  </h4>
                  <span style={s.collectionDocCount}>{data[selectedCol].length} document(s)</span>
                </div>
                {data[selectedCol].length === 0 ? (
                  <p style={{ color: theme.muted, fontSize: 13, marginTop: 16 }}>Empty collection</p>
                ) : (
                  <div style={s.tableWrap}>
                    <table style={s.table}>
                      <thead>
                        <tr>
                          {Object.keys(data[selectedCol][0]).slice(0, 7).map((key) => (
                            <th key={key} style={s.th}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data[selectedCol].map((doc, i) => (
                          <tr key={doc._id?.toString() || i}>
                            {Object.keys(data[selectedCol][0]).slice(0, 7).map((key) => (
                              <td key={key} style={s.td}>{formatCell(doc[key])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatCell(val) {
  if (val === null || val === undefined) return <span style={{ color: theme.muted }}>—</span>;
  if (typeof val === "object") {
    if (Array.isArray(val)) return `[${val.length} items]`;
    if (val._id) return val._id.toString().slice(-8) + "…";
    return JSON.stringify(val).slice(0, 40);
  }
  if (typeof val === "boolean") return val ? "✓" : "✗";
  if (typeof val === "number" && val > 999) return val.toLocaleString();
  return String(val);
}

/* ─── STYLES ─── */
const s = {
  /* ─── Layout ─── */
  layout: { display: "flex", minHeight: "100vh", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, -apple-system, sans-serif" },

  /* ─── Sidebar ─── */
  sidebar: { width: 240, backgroundColor: theme.surface, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", flexShrink: 0, transition: "transform 0.25s ease" },
  sidebarHeader: { padding: "24px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
  sidebarBrand: {},
  sidebarTitle: { fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, color: theme.gold, margin: 0, letterSpacing: 0.5 },
  sidebarSub: { fontSize: 10, color: theme.muted, margin: "2px 0 0", letterSpacing: 3, textTransform: "uppercase" },
  sidebarClose: { background: "none", border: "none", cursor: "pointer", padding: 4 },
  sidebarNav: { flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 },
  navItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", width: "100%", textAlign: "left", position: "relative" },
  navDot: { width: 6, height: 6, borderRadius: "50%", backgroundColor: theme.gold, marginLeft: "auto" },
  sidebarFooter: { padding: "12px 8px", borderTop: `1px solid ${theme.border}` },
  logoutBtn: { display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, border: "none", backgroundColor: "transparent", color: theme.muted, fontSize: 12, cursor: "pointer", width: "100%" },

  /* ─── Main ─── */
  mainWrap: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, width: "100%" },
  topbar: { padding: "20px 28px", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.surface, display: "flex", justifyContent: "space-between", alignItems: "center" },
  topbarLeft: { display: "flex", alignItems: "center", gap: 12 },
  hamburger: { background: "none", border: "none", cursor: "pointer", padding: 4 },
  pageTitle: { fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, color: theme.text, margin: 0 },
  pageSub: { fontSize: 11, color: theme.muted, margin: "2px 0 0" },
  statusDot: { width: 8, height: 8, borderRadius: "50%", backgroundColor: theme.success },
  statusText: { fontSize: 11, color: theme.mutedLight, textTransform: "uppercase", letterSpacing: 1 },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 99 },

  /* ─── Content ─── */
  content: { flex: 1, padding: "28px", overflow: "auto", maxWidth: 1400, width: "100%", margin: "0 auto" },

  /* ─── Login ─── */
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.bg, padding: 20 },
  loginCard: { backgroundColor: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}`, padding: "48px 40px", textAlign: "center", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" },
  loginIcon: { marginBottom: 16 },
  loginTitle: { fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 30, color: theme.gold, margin: 0, letterSpacing: 0.5 },
  loginSub: { fontSize: 11, color: theme.muted, letterSpacing: 3, marginTop: 2, marginBottom: 32, textTransform: "uppercase" },
  inputWrap: { marginBottom: 12 },
  loginInput: { width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  loginBtn: { width: "100%", padding: "12px", borderRadius: 10, border: "none", backgroundColor: theme.gold, color: theme.bg, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s" },

  /* ─── Stats ─── */
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 },
  statCard: { backgroundColor: theme.surface, borderRadius: 12, padding: "18px 16px", textAlign: "center", border: "1px solid", transition: "all 0.2s", boxShadow: "0 0 0 0 var(--glow, transparent)" },
  statNum: { fontSize: 28, fontWeight: 700, margin: 0 },
  statLabel: { fontSize: 11, color: theme.muted, margin: "2px 0 0", textTransform: "uppercase", letterSpacing: 1 },

  /* ─── Cards ─── */
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  card: { backgroundColor: theme.surface, borderRadius: 12, border: `1px solid ${theme.border}`, overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s" },
  receiptImgWrap: { height: 180, overflow: "hidden", cursor: "pointer", backgroundColor: theme.bg, position: "relative" },
  receiptImg: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" },
  receiptOverlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" },
  cardBody: { padding: 16, display: "flex", flexDirection: "column", gap: 8 },
  badgeRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  badge: { padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, border: "1px solid", textTransform: "capitalize" },
  date: { fontSize: 11, color: theme.muted },
  cardRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { fontSize: 12, color: theme.muted },
  cardValue: { fontSize: 12, color: theme.text, fontWeight: 600, maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" },
  actions: { display: "flex", gap: 8, marginTop: 8 },
  approveBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 8, border: "none", backgroundColor: theme.success, color: theme.text, fontWeight: 600, fontSize: 12, cursor: "pointer" },
  rejectBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 8, border: "none", backgroundColor: theme.danger, color: theme.text, fontWeight: 600, fontSize: 12, cursor: "pointer" },
  lightbox: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "pointer", padding: 20 },
  lightboxImg: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8 },

  /* ─── Toolbar ─── */
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 },
  searchWrap: { display: "flex", alignItems: "center", gap: 8, backgroundColor: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, padding: "0 12px", flex: "1 1 260px", maxWidth: 400 },
  searchInput: { padding: "8px 0", border: "none", backgroundColor: "transparent", color: theme.text, fontSize: 13, outline: "none", width: "100%" },
  clearBtn: { background: "none", border: "none", cursor: "pointer", padding: 2 },
  primaryBtn: { display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "none", backgroundColor: theme.gold, color: theme.bg, fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" },
  secondaryBtn: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px solid ${theme.border}`, backgroundColor: "transparent", color: theme.muted, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" },
  iconBtnPlain: { background: "none", border: "none", cursor: "pointer", padding: 4 },

  /* ─── Import ─── */
  importSection: { backgroundColor: theme.surface, borderRadius: 12, border: `1px solid ${theme.border}`, padding: 20, marginBottom: 16 },
  sectionTitle: { fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 15, color: theme.gold, margin: 0 },
  jsonInput: { width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: 12, fontFamily: "ui-monospace, monospace", outline: "none", resize: "vertical", boxSizing: "border-box" },

  /* ─── Collection stats ─── */
  collectionStats: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  collectionStat: { fontSize: 12, color: theme.mutedLight },
  collectionTag: { fontSize: 11, padding: "3px 10px", borderRadius: 999, backgroundColor: `${theme.gold}15`, color: theme.gold, border: `1px solid ${theme.gold}33` },

  /* ─── Book grid ─── */
  bookGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 },
  bookCard: { display: "flex", alignItems: "center", gap: 12, backgroundColor: theme.surface, borderRadius: 10, border: `1px solid ${theme.border}`, padding: "10px 12px", transition: "border-color 0.2s" },
  bookColor: { width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  bookInitial: { color: theme.text, fontWeight: 700, fontSize: 14 },
  bookInfo: { flex: 1, minWidth: 0 },
  bookTitle: { fontSize: 13, fontWeight: 600, color: theme.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  bookAuthor: { fontSize: 11, color: theme.muted, margin: "1px 0 0" },
  bookMeta: { fontSize: 10, color: theme.gold, margin: "1px 0 0" },
  bookActions: { display: "flex", gap: 4, alignItems: "center" },
  smallBtn: { padding: "4px 7px", borderRadius: 6, border: `1px solid ${theme.border}`, backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center" },

  /* ─── Modal ─── */
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { backgroundColor: theme.surface, borderRadius: 14, border: `1px solid ${theme.border}`, padding: 24, width: "100%", maxWidth: 600, maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  modalGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 },
  modalLabel: { fontSize: 10, color: theme.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  modalInput: { width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" },

  /* ─── Database ─── */
  dbLayout: { display: "flex", gap: 20, flexDirection: "row" },
  collectionList: { width: 200, flexShrink: 0 },
  collectionListTitle: { fontSize: 11, color: theme.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  collectionItem: { padding: "8px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", marginBottom: 2, transition: "all 0.15s" },
  collectionCount: { color: theme.muted, fontSize: 11 },
  dbContent: { flex: 1, minWidth: 0 },
  collectionHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  collectionDocCount: { fontSize: 12, color: theme.muted },
  tableWrap: { overflowX: "auto", border: `1px solid ${theme.border}`, borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th: { textAlign: "left", padding: "8px 10px", borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontWeight: 600, whiteSpace: "nowrap", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  td: { padding: "6px 10px", color: theme.text, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", borderBottom: `1px solid ${theme.border}22`, fontSize: 11 },

  /* ─── States ─── */
  errorBox: { display: "flex", alignItems: "center", gap: 8, backgroundColor: `${theme.danger}12`, border: `1px solid ${theme.danger}33`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: theme.danger, fontSize: 13 },
  loadingState: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "60px 0", color: theme.muted, fontSize: 13 },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "60px 0", color: theme.muted, fontSize: 13 },
  spinner: { width: 24, height: 24, border: `2px solid ${theme.border}`, borderTopColor: theme.gold, borderRadius: "50%", animation: "spin 0.8s linear infinite" },
};

export default App;
