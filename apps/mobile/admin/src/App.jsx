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
  radius: "12px",
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
  };
  const p = paths[name] || paths.search;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={p} />
    </svg>
  );
}

function App() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("receipts");

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setLoggedIn(true);
    } else {
      alert("Wrong password");
    }
  };

  if (!loggedIn) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.loginCard}>
          <div style={styles.loginIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 style={styles.loginTitle}>ንባብ ቤት</h1>
          <p style={styles.loginSub}>Admin Panel</p>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.loginInput} autoFocus />
            <button type="submit" style={styles.loginBtn}>Sign in</button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "receipts", label: "Receipts", icon: "receipts" },
    { id: "books", label: "Books", icon: "books" },
    { id: "database", label: "Database", icon: "database" },
  ];

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>ንባብ ቤት</h2>
          <p style={styles.sidebarSub}>Admin</p>
        </div>
        <nav style={styles.sidebarNav}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...styles.sidebarItem,
                backgroundColor: tab === t.id ? theme.bg : "transparent",
                borderLeft: tab === t.id ? `3px solid ${theme.gold}` : "3px solid transparent",
                color: tab === t.id ? theme.gold : theme.muted,
              }}
            >
              <Icon name={t.icon} size={16} color={tab === t.id ? theme.gold : theme.muted} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <button onClick={() => setLoggedIn(false)} style={styles.logoutBtn}>
            <Icon name="x" size={14} color={theme.muted} />
            Sign out
          </button>
        </div>
      </aside>
      <main style={styles.main}>
        <header style={styles.topbar}>
          <h2 style={styles.pageTitle}>
            {tabs.find((t) => t.id === tab)?.label || ""}
          </h2>
        </header>
        <div style={styles.content}>
          {tab === "receipts" && <ReceiptsPanel />}
          {tab === "books" && <BooksPanel />}
          {tab === "database" && <DatabasePanel />}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color, active, onClick, total }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.statCard,
        borderColor: active ? (color || theme.gold) : theme.border,
        cursor: "pointer",
        opacity: active ? 1 : 0.6,
        transition: "all 0.15s",
      }}
    >
      <p style={{ ...styles.statNum, color: color || theme.gold }}>{value}</p>
      <p style={styles.statLabel}>{label}</p>
    </div>
  );
}

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

  const filtered = filter === "all" ? receipts : receipts.filter((r) => r.status === filter);
  const counts = [
    { key: "all", label: "All", value: receipts.length, color: theme.gold },
    { key: "pending", label: "Pending", value: receipts.filter((r) => r.status === "pending").length, color: "#C9A84C" },
    { key: "approved", label: "Approved", value: receipts.filter((r) => r.status === "approved").length, color: theme.success },
    { key: "rejected", label: "Rejected", value: receipts.filter((r) => r.status === "rejected").length, color: theme.danger },
  ];

  return (
    <div>
      <div style={styles.statsRow}>
        {counts.map((c) => (
          <StatCard key={c.key} label={c.label} value={c.value} color={c.color} active={filter === c.key} onClick={() => setFilter(c.key)} />
        ))}
      </div>

      {loading ? (
        <p style={styles.emptyState}>Loading receipts...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.emptyState}>No receipts found</p>
      ) : (
        <div style={styles.cardGrid}>
          {filtered.map((receipt) => (
            <div key={receipt._id} style={styles.card}>
              <div style={styles.receiptImgWrap} onClick={() => setSelectedImage(`${UPLOADS}${receipt.imagePath}`)}>
                <img src={`${UPLOADS}${receipt.imagePath}`} alt="Receipt" style={styles.receiptImg} />
              </div>
              <div style={styles.cardBody}>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Order</span>
                  <span style={styles.cardValue}>#{receipt.orderId?._id?.slice(-6) || "—"}</span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Items</span>
                  <span style={styles.cardValue}>{receipt.orderId?.items?.map((i) => i.title).join(", ") || "—"}</span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Total</span>
                  <span style={styles.cardValue}>ETB {receipt.orderId?.total?.toLocaleString() || "—"}</span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Status</span>
                  <span style={{ ...styles.badge, backgroundColor: receipt.status === "approved" ? `${theme.success}22` : receipt.status === "rejected" ? `${theme.danger}22` : `${theme.gold}22`, color: receipt.status === "approved" ? theme.success : receipt.status === "rejected" ? theme.danger : theme.gold, borderColor: receipt.status === "approved" ? theme.success : receipt.status === "rejected" ? theme.danger : theme.gold }}>
                    {receipt.status}
                  </span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Date</span>
                  <span style={styles.cardValue}>{new Date(receipt.createdAt).toLocaleDateString()}</span>
                </div>
                {receipt.status === "pending" && (
                  <div style={styles.actions}>
                    <button onClick={() => handleReview(receipt._id, "approved")} style={styles.approveBtn}>
                      <Icon name="check" size={12} color={theme.text} /> Approve
                    </button>
                    <button onClick={() => handleReview(receipt._id, "rejected")} style={styles.rejectBtn}>
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
        <div style={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Receipt full" style={styles.lightboxImg} />
        </div>
      )}
    </div>
  );
}

function BooksPanel() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jsonText, setJsonText] = useState("");
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API}/books`);
      setBooks(await res.json());
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const handleImport = async () => {
    let parsed;
    try { parsed = JSON.parse(jsonText); } catch { setMessage({ type: "error", text: "Invalid JSON" }); return; }
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    setImporting(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/books/bulk`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ books: arr }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: `${data.count} books imported` });
      setJsonText("");
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
    (b) =>
      !search ||
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={styles.importSection}>
        <h3 style={styles.sectionTitle}>
          <Icon name="upload" size={14} color={theme.gold} /> Import Books
        </h3>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={`[\n  {\n    "title": "My Book",\n    "author": "Author",\n    "category": "Fiction",\n    "price": 199\n  }\n]`}
          style={styles.jsonInput}
          rows={8}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          {message && (
            <span style={{ color: message.type === "success" ? theme.success : theme.danger, fontSize: 13 }}>{message.text}</span>
          )}
          <button onClick={handleImport} disabled={!jsonText.trim() || importing} style={styles.primaryBtn}>
            {importing ? "Importing..." : `Import${jsonText.trim() ? ` (${(Array.isArray(JSON.parse(jsonText || "[]")) ? JSON.parse(jsonText).length : 1) || 0})` : ""}`}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "24px 0 16px" }}>
        <h3 style={{ ...styles.sectionTitle, margin: 0 }}>All Books ({books.length})</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: 8 }}>
              <Icon name="search" size={14} color={theme.muted} />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books..."
              style={{ ...styles.searchInput, paddingLeft: 32 }}
            />
          </div>
          <button onClick={fetchBooks} style={styles.iconBtn}>
            <Icon name="refresh" size={14} color={theme.muted} />
          </button>
        </div>
      </div>

      {loading ? (
        <p style={styles.emptyState}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.emptyState}>{search ? "No matching books" : "No books yet. Import some above."}</p>
      ) : (
        <div style={styles.bookGrid}>
          {filtered.map((book) => (
            <div key={book._id} style={styles.bookCard}>
              <div style={{ ...styles.bookColor, backgroundColor: book.color || theme.border }}>
                <span style={styles.bookInitial}>{book.title?.charAt(0) || "?"}</span>
              </div>
              <div style={styles.bookInfo}>
                <p style={styles.bookTitle}>{book.title}</p>
                <p style={styles.bookAuthor}>{book.author}</p>
                <p style={styles.bookMeta}>{book.category} · ETB {book.price?.toLocaleString()}</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => setEditBook({ ...book })} style={styles.smallBtn}>
                  <Icon name="edit" size={11} color={theme.gold} />
                </button>
                <button onClick={() => handleDelete(book._id)} style={{ ...styles.smallBtn, borderColor: theme.danger + "44", color: theme.danger }}>
                  <Icon name="trash" size={11} color={theme.danger} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editBook && (
        <div style={styles.modalOverlay} onClick={() => setEditBook(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ ...styles.sectionTitle, marginTop: 0, marginBottom: 16 }}>Edit Book</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {["title", "titleAm", "author", "category", "price", "pages", "chapters", "rating", "color", "iconName"].map((field) => (
                <div key={field}>
                  <label style={styles.modalLabel}>{field}</label>
                  {field === "description" || field === "sample" ? (
                    <textarea value={editBook[field] || ""} onChange={(e) => setEditBook({ ...editBook, [field]: e.target.value })} style={styles.modalInput} rows={3} />
                  ) : (
                    <input value={editBook[field] || ""} onChange={(e) => setEditBook({ ...editBook, [field]: e.target.value })} style={styles.modalInput} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
              <button onClick={() => setEditBook(null)} style={{ ...styles.primaryBtn, backgroundColor: theme.surface, color: theme.muted, border: `1px solid ${theme.border}` }}>Cancel</button>
              <button onClick={handleUpdate} style={styles.primaryBtn}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Database · clintapp</h3>
        <button onClick={fetchDb} style={styles.iconBtn}>
          <Icon name="refresh" size={14} color={theme.muted} /> Refresh
        </button>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <Icon name="x" size={14} color={theme.danger} />
          <span>Failed to connect: {error}</span>
        </div>
      )}

      {loading ? (
        <p style={styles.emptyState}>Loading database...</p>
      ) : collections.length === 0 ? (
        <p style={styles.emptyState}>No collections found</p>
      ) : (
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: 200, flexShrink: 0 }}>
            {collections.map((name) => (
              <div
                key={name}
                onClick={() => setSelectedCol(name)}
                style={{
                  ...styles.collectionItem,
                  backgroundColor: selectedCol === name ? theme.surface : "transparent",
                  color: selectedCol === name ? theme.gold : theme.text,
                  borderLeft: selectedCol === name ? `3px solid ${theme.gold}` : "3px solid transparent",
                }}
              >
                <span>{name}</span>
                <span style={styles.collectionCount}>{data[name].length}</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {!selectedCol ? (
              <p style={{ color: theme.muted, fontSize: 13 }}>Select a collection</p>
            ) : (
              <div>
                <h4 style={{ color: theme.gold, fontSize: 14, margin: "0 0 12px" }}>
                  {selectedCol} <span style={{ color: theme.muted, fontWeight: 400 }}>({data[selectedCol].length} docs)</span>
                </h4>
                {data[selectedCol].length === 0 ? (
                  <p style={{ color: theme.muted, fontSize: 13 }}>Empty collection</p>
                ) : (
                  <div style={styles.tableWrap}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          {Object.keys(data[selectedCol][0]).slice(0, 7).map((key) => (
                            <th key={key} style={styles.th}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data[selectedCol].map((doc, i) => (
                          <tr key={doc._id?.toString() || i}>
                            {Object.keys(data[selectedCol][0]).slice(0, 7).map((key) => (
                              <td key={key} style={styles.td}>{formatCell(doc[key])}</td>
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
    if (val._id) return val._id.toString().slice(-8) + "...";
    return JSON.stringify(val).slice(0, 40);
  }
  if (typeof val === "boolean") return val ? "✓" : "✗";
  return String(val);
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, -apple-system, sans-serif" },
  sidebar: { width: 220, backgroundColor: theme.surface, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", flexShrink: 0 },
  sidebarHeader: { padding: "24px 20px 20px", borderBottom: `1px solid ${theme.border}` },
  sidebarTitle: { fontFamily: "Georgia, serif", fontSize: 18, color: theme.gold, margin: 0, letterSpacing: 1 },
  sidebarSub: { fontSize: 10, color: theme.muted, margin: "2px 0 0", letterSpacing: 3, textTransform: "uppercase" },
  sidebarNav: { flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 },
  sidebarItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", width: "100%", textAlign: "left" },
  sidebarFooter: { padding: "12px 8px", borderTop: `1px solid ${theme.border}` },
  logoutBtn: { display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, border: "none", backgroundColor: "transparent", color: theme.muted, fontSize: 12, cursor: "pointer", width: "100%" },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: { padding: "20px 32px", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.surface },
  pageTitle: { fontFamily: "Georgia, serif", fontSize: 20, color: theme.text, margin: 0 },
  content: { flex: 1, padding: "24px 32px 32px", overflow: "auto" },
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.bg },
  loginCard: { backgroundColor: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}`, padding: "48px 40px", textAlign: "center", width: "100%", maxWidth: 360 },
  loginIcon: { marginBottom: 16 },
  loginTitle: { fontFamily: "Georgia, serif", fontSize: 28, color: theme.gold, margin: 0, letterSpacing: 1 },
  loginSub: { fontSize: 11, color: theme.muted, letterSpacing: 3, marginTop: 2, marginBottom: 28, textTransform: "uppercase" },
  loginInput: { width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: 14, outline: "none", marginBottom: 12 },
  loginBtn: { width: "100%", padding: "12px", borderRadius: 10, border: "none", backgroundColor: theme.gold, color: theme.bg, fontSize: 14, fontWeight: 700, cursor: "pointer" },
  statsRow: { display: "flex", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: theme.surface, borderRadius: 12, padding: "16px", textAlign: "center", border: "1px solid", transition: "all 0.15s" },
  statNum: { fontSize: 26, fontWeight: 700, margin: 0 },
  statLabel: { fontSize: 11, color: theme.muted, margin: "2px 0 0", textTransform: "uppercase", letterSpacing: 1 },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  card: { backgroundColor: theme.surface, borderRadius: 12, border: `1px solid ${theme.border}`, overflow: "hidden", transition: "box-shadow 0.2s" },
  receiptImgWrap: { height: 180, overflow: "hidden", cursor: "pointer", backgroundColor: theme.bg },
  receiptImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardBody: { padding: 16, display: "flex", flexDirection: "column", gap: 6 },
  cardRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { fontSize: 11, color: theme.muted },
  cardValue: { fontSize: 12, color: theme.text, fontWeight: 600 },
  badge: { padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, border: "1px solid", textTransform: "capitalize" },
  actions: { display: "flex", gap: 8, marginTop: 10 },
  approveBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px", borderRadius: 8, border: "none", backgroundColor: theme.success, color: theme.text, fontWeight: 600, fontSize: 12, cursor: "pointer" },
  rejectBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px", borderRadius: 8, border: "none", backgroundColor: theme.danger, color: theme.text, fontWeight: 600, fontSize: 12, cursor: "pointer" },
  lightbox: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "pointer" },
  lightboxImg: { maxWidth: "90%", maxHeight: "90%", objectFit: "contain", borderRadius: 8 },
  importSection: { backgroundColor: theme.surface, borderRadius: 12, border: `1px solid ${theme.border}`, padding: 20, marginBottom: 8 },
  sectionTitle: { fontFamily: "Georgia, serif", fontSize: 15, color: theme.gold, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 },
  jsonInput: { width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: 12, fontFamily: "monospace", outline: "none", resize: "vertical" },
  primaryBtn: { padding: "8px 20px", borderRadius: 8, border: "none", backgroundColor: theme.gold, color: theme.bg, fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
  searchInput: { padding: "8px 12px", borderRadius: 8, border: `1px solid ${theme.border}`, backgroundColor: theme.surface, color: theme.text, fontSize: 12, outline: "none", width: 200 },
  iconBtn: { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, backgroundColor: theme.surface, color: theme.muted, fontSize: 12, cursor: "pointer" },
  bookGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 },
  bookCard: { display: "flex", alignItems: "center", gap: 12, backgroundColor: theme.surface, borderRadius: 10, border: `1px solid ${theme.border}`, padding: 12 },
  bookColor: { width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  bookInitial: { color: theme.text, fontWeight: 700, fontSize: 14 },
  bookInfo: { flex: 1, minWidth: 0 },
  bookTitle: { fontSize: 13, fontWeight: 600, color: theme.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  bookAuthor: { fontSize: 11, color: theme.muted, margin: "2px 0 0" },
  bookMeta: { fontSize: 10, color: theme.gold, margin: "2px 0 0" },
  smallBtn: { padding: "4px 8px", borderRadius: 6, border: `1px solid ${theme.border}`, color: theme.muted, backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center" },
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { backgroundColor: theme.surface, borderRadius: 14, border: `1px solid ${theme.border}`, padding: 24, width: "90%", maxWidth: 560, maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  modalLabel: { fontSize: 10, color: theme.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
  modalInput: { width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: 12, outline: "none", fontFamily: "inherit" },
  errorBox: { display: "flex", alignItems: "center", gap: 8, backgroundColor: `${theme.danger}15`, border: `1px solid ${theme.danger}44`, borderRadius: 8, padding: 12, marginBottom: 16, color: theme.danger, fontSize: 13 },
  emptyState: { textAlign: "center", color: theme.muted, padding: "40px 0", fontSize: 13 },
  collectionItem: { padding: "8px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", marginBottom: 2, transition: "all 0.15s" },
  collectionCount: { color: theme.muted, fontSize: 11 },
  tableWrap: { overflowX: "auto", border: `1px solid ${theme.border}`, borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th: { textAlign: "left", padding: "8px 10px", borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontWeight: 600, whiteSpace: "nowrap", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  td: { padding: "6px 10px", color: theme.text, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", borderBottom: `1px solid ${theme.border}22` },
};

export default App;
