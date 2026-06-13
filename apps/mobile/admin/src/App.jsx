import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const UPLOADS = import.meta.env.VITE_UPLOADS_URL || "http://localhost:4000";

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
        <div style={styles.loginBox}>
          <h1 style={styles.logo}>ንባብ ቤት</h1>
          <p style={styles.logoSub}>ADMIN PANEL</p>
          <form onSubmit={handleLogin} style={styles.loginForm}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.loginInput}
              autoFocus
            />
            <button type="submit" style={styles.loginBtn}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>ንባብ ቤት — Admin</h1>
          <p style={styles.headerSub}>Book Store Management</p>
        </div>
        <button onClick={() => setLoggedIn(false)} style={styles.logoutBtn}>Logout</button>
      </header>

      <div style={styles.tabBar}>
        <button
          onClick={() => setTab("receipts")}
          style={{ ...styles.tab, borderBottom: tab === "receipts" ? "2px solid #C9A84C" : "2px solid transparent" }}
        >Receipts</button>
        <button
          onClick={() => setTab("books")}
          style={{ ...styles.tab, borderBottom: tab === "books" ? "2px solid #C9A84C" : "2px solid transparent" }}
        >Books</button>
        <button
          onClick={() => setTab("database")}
          style={{ ...styles.tab, borderBottom: tab === "database" ? "2px solid #C9A84C" : "2px solid transparent" }}
        >Database</button>
      </div>

      {tab === "receipts" ? <ReceiptsPanel /> : tab === "books" ? <BooksPanel /> : <DatabasePanel />}
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
      const data = await res.json();
      setReceipts(data);
    } catch {
      console.error("Failed to fetch receipts");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    try {
      await fetch(`${API}/receipts/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchReceipts();
    } catch {
      alert("Failed to update receipt");
    }
  };

  const filtered = filter === "all"
    ? receipts
    : receipts.filter((r) => r.status === filter);

  const counts = {
    all: receipts.length,
    pending: receipts.filter((r) => r.status === "pending").length,
    approved: receipts.filter((r) => r.status === "approved").length,
    rejected: receipts.filter((r) => r.status === "rejected").length,
  };

  return (
    <div>
      <div style={styles.statsRow}>
        {Object.entries(counts).map(([key, val]) => (
          <div
            key={key}
            style={{
              ...styles.statCard,
              borderColor: key === "pending" ? "#C9A84C" : key === "approved" ? "#4A8C5C" : key === "rejected" ? "#E05555" : "#252650",
              cursor: "pointer",
              opacity: filter === key ? 1 : 0.6,
            }}
            onClick={() => setFilter(key)}
          >
            <p style={styles.statNum}>{val}</p>
            <p style={styles.statLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.empty}>No receipts found</p>
      ) : (
        <div style={styles.grid}>
          {filtered.map((receipt) => (
            <div key={receipt._id} style={styles.card}>
              <div
                style={styles.receiptImgWrap}
                onClick={() => setSelectedImage(`${UPLOADS}${receipt.imagePath}`)}
              >
                <img
                  src={`${UPLOADS}${receipt.imagePath}`}
                  alt="Receipt"
                  style={styles.receiptImg}
                />
              </div>
              <div style={styles.cardBody}>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Order</span>
                  <span style={styles.cardValue}>#{receipt.orderId?._id?.slice(-6) || "—"}</span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Items</span>
                  <span style={styles.cardValue}>
                    {receipt.orderId?.items?.map((i) => i.title).join(", ") || "—"}
                  </span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Total</span>
                  <span style={styles.cardValue}>
                    ETB {receipt.orderId?.total?.toLocaleString() || "—"}
                  </span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Status</span>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: receipt.status === "approved" ? "#4A8C5C22" : receipt.status === "rejected" ? "#E0555522" : "#C9A84C22",
                    color: receipt.status === "approved" ? "#4A8C5C" : receipt.status === "rejected" ? "#E05555" : "#C9A84C",
                    borderColor: receipt.status === "approved" ? "#4A8C5C" : receipt.status === "rejected" ? "#E05555" : "#C9A84C",
                  }}>
                    {receipt.status}
                  </span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Date</span>
                  <span style={styles.cardValue}>{new Date(receipt.createdAt).toLocaleDateString()}</span>
                </div>
                {receipt.status === "pending" && (
                  <div style={styles.actions}>
                    <button onClick={() => handleReview(receipt._id, "approved")} style={styles.approveBtn}>Approve</button>
                    <button onClick={() => handleReview(receipt._id, "rejected")} style={styles.rejectBtn}>Reject</button>
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

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API}/books`);
      const data = await res.json();
      setBooks(data);
    } catch {
      console.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setMessage({ type: "error", text: "Invalid JSON format" });
      return;
    }
    const booksArr = Array.isArray(parsed) ? parsed : [parsed];
    setImporting(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/books/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ books: booksArr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: `${data.count} books imported successfully!` });
      setJsonText("");
      fetchBooks();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;
    try {
      await fetch(`${API}/books/${id}`, { method: "DELETE" });
      fetchBooks();
    } catch {
      alert("Failed to delete");
    }
  };

  const handleUpdate = async () => {
    if (!editBook) return;
    try {
      await fetch(`${API}/books/${editBook._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editBook),
      });
      setEditBook(null);
      fetchBooks();
    } catch {
      alert("Failed to update");
    }
  };

  return (
    <div style={{ padding: "0 32px 32px" }}>
      <div style={styles.importSection}>
        <h3 style={styles.sectionTitle}>Import Books (JSON)</h3>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={`Paste JSON array of books:\n[\n  {\n    "title": "My Book",\n    "author": "Author",\n    "category": "Fiction",\n    "price": 199,\n    "pages": 200,\n    "chapters": 10,\n    "rating": 4.5,\n    "color": "#C9A84C",\n    "iconName": "BookOpen",\n    "description": "A great book..."\n  }\n]`}
          style={styles.jsonInput}
          rows={12}
        />
        <div style={styles.importActions}>
          <button onClick={handleImport} disabled={!jsonText.trim() || importing} style={styles.importBtn}>
            {importing ? "Importing..." : "Import Books"}
          </button>
        </div>
        {message && (
          <p style={{ color: message.type === "success" ? "#4A8C5C" : "#E05555", marginTop: 8, fontSize: 13 }}>
            {message.text}
          </p>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "24px 0 16px" }}>
        <h3 style={styles.sectionTitle}>All Books ({books.length})</h3>
        <button onClick={fetchBooks} style={styles.refreshBtn}>Refresh</button>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : books.length === 0 ? (
        <p style={styles.empty}>No books yet. Import some above.</p>
      ) : (
        <div style={styles.bookGrid}>
          {books.map((book) => (
            <div key={book._id} style={styles.bookCard}>
              <div style={{ ...styles.bookColor, backgroundColor: book.color || "#252650" }}>
                <span style={styles.bookInitial}>{book.title?.charAt(0) || "?"}</span>
              </div>
              <div style={styles.bookInfo}>
                <p style={styles.bookTitle}>{book.title}</p>
                <p style={styles.bookAuthor}>{book.author}</p>
                <p style={styles.bookMeta}>{book.category} · ETB {book.price?.toLocaleString()}</p>
              </div>
              <div style={styles.bookActions}>
                <button onClick={() => setEditBook({ ...book })} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(book._id)} style={styles.deleteBtn}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editBook && (
        <div style={styles.modalOverlay} onClick={() => setEditBook(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ ...styles.sectionTitle, marginTop: 0 }}>Edit Book</h3>
            {["title", "titleAm", "author", "category", "description", "sample", "color", "iconName"].map((field) => (
              <div key={field} style={{ marginBottom: 10 }}>
                <label style={styles.modalLabel}>{field}</label>
                <input
                  value={editBook[field] || ""}
                  onChange={(e) => setEditBook({ ...editBook, [field]: e.target.value })}
                  style={styles.modalInput}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={handleUpdate} style={styles.importBtn}>Save</button>
              <button onClick={() => setEditBook(null)} style={{ ...styles.importBtn, backgroundColor: "#252650", color: "#7878A0" }}>Cancel</button>
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDb(); }, []);

  const collections = data ? Object.keys(data) : [];

  return (
    <div style={{ padding: "0 32px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "24px 0 16px" }}>
        <h3 style={styles.sectionTitle}>MongoDB — clintapp</h3>
        <button onClick={fetchDb} style={styles.refreshBtn}>Refresh</button>
      </div>

      {error && (
        <div style={{ backgroundColor: "#E0555522", border: "1px solid #E05555", borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <p style={{ color: "#E05555", fontSize: 13, margin: 0 }}>Failed to connect: {error}. Is the backend running?</p>
        </div>
      )}

      {loading ? (
        <p style={styles.loading}>Loading database...</p>
      ) : collections.length === 0 ? (
        <p style={styles.empty}>No collections found</p>
      ) : (
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ width: 200, flexShrink: 0 }}>
            {collections.map((name) => (
              <div
                key={name}
                onClick={() => setSelectedCol(name)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  backgroundColor: selectedCol === name ? "#1E1F4A" : "transparent",
                  color: selectedCol === name ? "#C9A84C" : "#FFFFFF",
                  cursor: "pointer",
                  fontSize: 13,
                  borderLeft: selectedCol === name ? "3px solid #C9A84C" : "3px solid transparent",
                  marginBottom: 4,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{name}</span>
                <span style={{ color: "#7878A0" }}>{data[name].length}</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {!selectedCol ? (
              <p style={{ color: "#7878A0", fontSize: 13 }}>Select a collection on the left</p>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <h4 style={{ color: "#C9A84C", fontSize: 14, margin: 0 }}>
                    {selectedCol} <span style={{ color: "#7878A0", fontWeight: 400 }}>({data[selectedCol].length} documents)</span>
                  </h4>
                </div>
                {data[selectedCol].length === 0 ? (
                  <p style={{ color: "#7878A0", fontSize: 13 }}>Empty collection</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          {Object.keys(data[selectedCol][0]).slice(0, 8).map((key) => (
                            <th key={key} style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #252650", color: "#7878A0", fontWeight: 600, whiteSpace: "nowrap" }}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data[selectedCol].map((doc, i) => (
                          <tr key={doc._id?.toString() || i} style={{ borderBottom: "1px solid #1A1B3A" }}>
                            {Object.keys(data[selectedCol][0]).slice(0, 8).map((key) => (
                              <td key={key} style={{ padding: "6px 10px", color: "#FFFFFF", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {formatCell(doc[key])}
                              </td>
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
  if (val === null || val === undefined) return <span style={{ color: "#7878A0" }}>—</span>;
  if (typeof val === "object") {
    if (Array.isArray(val)) return `[${val.length} items]`;
    if (val._id) return val._id.toString().slice(-8) + "...";
    return JSON.stringify(val).slice(0, 40);
  }
  if (typeof val === "boolean") return val ? "✓" : "✗";
  return String(val);
}

const styles = {
  wrap: { minHeight: "100vh", backgroundColor: "#0B0C1A", color: "#FFFFFF", fontFamily: "system-ui, -apple-system, sans-serif" },
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0B0C1A" },
  loginBox: { backgroundColor: "#13142A", padding: "48px 40px", borderRadius: 16, border: "1px solid #252650", textAlign: "center", width: "100%", maxWidth: 360 },
  logo: { fontFamily: "Georgia, serif", fontSize: 32, color: "#C9A84C", margin: 0, letterSpacing: 2 },
  logoSub: { fontSize: 11, color: "#7878A0", letterSpacing: 4, marginTop: 4, marginBottom: 32 },
  loginForm: { display: "flex", flexDirection: "column", gap: 12 },
  loginInput: { padding: "14px 16px", borderRadius: 12, border: "1px solid #252650", backgroundColor: "#0B0C1A", color: "#FFFFFF", fontSize: 14, outline: "none" },
  loginBtn: { padding: "14px", borderRadius: 12, border: "none", backgroundColor: "#C9A84C", color: "#0B0C1A", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", borderBottom: "1px solid #252650" },
  headerTitle: { fontFamily: "Georgia, serif", fontSize: 24, color: "#C9A84C", margin: 0 },
  headerSub: { fontSize: 12, color: "#7878A0", margin: "4px 0 0", letterSpacing: 1 },
  logoutBtn: { padding: "8px 20px", borderRadius: 8, border: "1px solid #252650", backgroundColor: "#13142A", color: "#7878A0", cursor: "pointer", fontSize: 13 },
  tabBar: { display: "flex", gap: 0, padding: "0 32px", borderBottom: "1px solid #252650" },
  tab: { padding: "14px 24px", background: "none", border: "none", color: "#FFFFFF", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5 },
  statsRow: { display: "flex", gap: 16, padding: "20px 32px" },
  statCard: { flex: 1, backgroundColor: "#13142A", borderRadius: 12, padding: "20px", textAlign: "center", border: "2px solid #252650", transition: "opacity 0.2s" },
  statNum: { fontSize: 28, fontWeight: 700, color: "#FFFFFF", margin: 0 },
  statLabel: { fontSize: 12, color: "#7878A0", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: 1 },
  loading: { textAlign: "center", color: "#7878A0", padding: 48, fontSize: 14 },
  empty: { textAlign: "center", color: "#7878A0", padding: 48, fontSize: 14 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20, padding: "0 32px 32px" },
  card: { backgroundColor: "#13142A", borderRadius: 16, border: "1px solid #252650", overflow: "hidden" },
  receiptImgWrap: { height: 200, overflow: "hidden", cursor: "pointer", backgroundColor: "#0B0C1A" },
  receiptImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardBody: { padding: 20, display: "flex", flexDirection: "column", gap: 8 },
  cardRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { fontSize: 12, color: "#7878A0" },
  cardValue: { fontSize: 13, color: "#FFFFFF", fontWeight: 600 },
  badge: { padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, border: "1px solid", textTransform: "capitalize" },
  actions: { display: "flex", gap: 8, marginTop: 12 },
  approveBtn: { flex: 1, padding: "10px", borderRadius: 10, border: "none", backgroundColor: "#4A8C5C", color: "#FFFFFF", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  rejectBtn: { flex: 1, padding: "10px", borderRadius: 10, border: "none", backgroundColor: "#E05555", color: "#FFFFFF", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  lightbox: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "pointer" },
  lightboxImg: { maxWidth: "90%", maxHeight: "90%", objectFit: "contain", borderRadius: 8 },
  importSection: { backgroundColor: "#13142A", borderRadius: 16, border: "1px solid #252650", padding: 24, marginTop: 24 },
  sectionTitle: { fontFamily: "Georgia, serif", fontSize: 16, color: "#C9A84C", margin: "0 0 12px" },
  jsonInput: { width: "100%", padding: 12, borderRadius: 10, border: "1px solid #252650", backgroundColor: "#0B0C1A", color: "#FFFFFF", fontSize: 12, fontFamily: "monospace", outline: "none", resize: "vertical" },
  importActions: { marginTop: 12, display: "flex", justifyContent: "flex-end" },
  importBtn: { padding: "10px 24px", borderRadius: 10, border: "none", backgroundColor: "#C9A84C", color: "#0B0C1A", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  refreshBtn: { padding: "6px 16px", borderRadius: 8, border: "1px solid #252650", backgroundColor: "#13142A", color: "#7878A0", cursor: "pointer", fontSize: 12 },
  bookGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 },
  bookCard: { display: "flex", alignItems: "center", gap: 12, backgroundColor: "#13142A", borderRadius: 12, border: "1px solid #252650", padding: 12 },
  bookColor: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  bookInitial: { color: "#FFFFFF", fontWeight: 700, fontSize: 16 },
  bookInfo: { flex: 1, minWidth: 0 },
  bookTitle: { fontSize: 13, fontWeight: 600, color: "#FFFFFF", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  bookAuthor: { fontSize: 11, color: "#7878A0", margin: "2px 0 0" },
  bookMeta: { fontSize: 10, color: "#C9A84C", margin: "2px 0 0" },
  bookActions: { display: "flex", gap: 4 },
  editBtn: { padding: "4px 10px", borderRadius: 6, border: "1px solid #C9A84C", color: "#C9A84C", backgroundColor: "transparent", cursor: "pointer", fontSize: 11 },
  deleteBtn: { padding: "4px 10px", borderRadius: 6, border: "1px solid #E05555", color: "#E05555", backgroundColor: "transparent", cursor: "pointer", fontSize: 11 },
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { backgroundColor: "#13142A", borderRadius: 16, border: "1px solid #252650", padding: 24, width: "90%", maxWidth: 500, maxHeight: "80vh", overflow: "auto" },
  modalLabel: { fontSize: 11, color: "#7878A0", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
  modalInput: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #252650", backgroundColor: "#0B0C1A", color: "#FFFFFF", fontSize: 13, outline: "none" },
};

export default App;
