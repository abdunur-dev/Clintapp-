import { useState, useEffect } from "react";

const API = "http://localhost:4000/api";
const UPLOADS = "http://localhost:4000";

function App() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!loggedIn) return;
    fetchReceipts();
    const interval = setInterval(fetchReceipts, 10000);
    return () => clearInterval(interval);
  }, [loggedIn]);

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
    } catch (err) {
      alert("Failed to update receipt");
    }
  };

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
    <div style={styles.wrap}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>ንባብ ቤት — Admin</h1>
          <p style={styles.headerSub}>Receipt Verification Dashboard</p>
        </div>
        <button onClick={() => setLoggedIn(false)} style={styles.logoutBtn}>Logout</button>
      </header>

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
                    backgroundColor:
                      receipt.status === "approved" ? "#4A8C5C22" :
                      receipt.status === "rejected" ? "#E0555522" : "#C9A84C22",
                    color:
                      receipt.status === "approved" ? "#4A8C5C" :
                      receipt.status === "rejected" ? "#E05555" : "#C9A84C",
                    borderColor:
                      receipt.status === "approved" ? "#4A8C5C" :
                      receipt.status === "rejected" ? "#E05555" : "#C9A84C",
                  }}>
                    {receipt.status}
                  </span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>Date</span>
                  <span style={styles.cardValue}>
                    {new Date(receipt.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {receipt.status === "pending" && (
                  <div style={styles.actions}>
                    <button
                      onClick={() => handleReview(receipt._id, "approved")}
                      style={styles.approveBtn}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(receipt._id, "rejected")}
                      style={styles.rejectBtn}
                    >
                      Reject
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

const styles = {
  wrap: {
    minHeight: "100vh",
    backgroundColor: "#0B0C1A",
    color: "#FFFFFF",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  loginWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B0C1A",
  },
  loginBox: {
    backgroundColor: "#13142A",
    padding: "48px 40px",
    borderRadius: 16,
    border: "1px solid #252650",
    textAlign: "center",
    width: "100%",
    maxWidth: 360,
  },
  logo: {
    fontFamily: "Georgia, serif",
    fontSize: 32,
    color: "#C9A84C",
    margin: 0,
    letterSpacing: 2,
  },
  logoSub: {
    fontSize: 11,
    color: "#7878A0",
    letterSpacing: 4,
    marginTop: 4,
    marginBottom: 32,
  },
  loginForm: { display: "flex", flexDirection: "column", gap: 12 },
  loginInput: {
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid #252650",
    backgroundColor: "#0B0C1A",
    color: "#FFFFFF",
    fontSize: 14,
    outline: "none",
  },
  loginBtn: {
    padding: "14px",
    borderRadius: 12,
    border: "none",
    backgroundColor: "#C9A84C",
    color: "#0B0C1A",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    borderBottom: "1px solid #252650",
  },
  headerTitle: {
    fontFamily: "Georgia, serif",
    fontSize: 24,
    color: "#C9A84C",
    margin: 0,
  },
  headerSub: {
    fontSize: 12,
    color: "#7878A0",
    margin: "4px 0 0",
    letterSpacing: 1,
  },
  logoutBtn: {
    padding: "8px 20px",
    borderRadius: 8,
    border: "1px solid #252650",
    backgroundColor: "#13142A",
    color: "#7878A0",
    cursor: "pointer",
    fontSize: 13,
  },
  statsRow: {
    display: "flex",
    gap: 16,
    padding: "20px 32px",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#13142A",
    borderRadius: 12,
    padding: "20px",
    textAlign: "center",
    border: "2px solid #252650",
  },
  statNum: {
    fontSize: 28,
    fontWeight: 700,
    color: "#FFFFFF",
    margin: 0,
  },
  statLabel: {
    fontSize: 12,
    color: "#7878A0",
    margin: "4px 0 0",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  loading: {
    textAlign: "center",
    color: "#7878A0",
    padding: 48,
    fontSize: 14,
  },
  empty: {
    textAlign: "center",
    color: "#7878A0",
    padding: 48,
    fontSize: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 20,
    padding: "0 32px 32px",
  },
  card: {
    backgroundColor: "#13142A",
    borderRadius: 16,
    border: "1px solid #252650",
    overflow: "hidden",
  },
  receiptImgWrap: {
    height: 200,
    overflow: "hidden",
    cursor: "pointer",
    backgroundColor: "#0B0C1A",
  },
  receiptImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardBody: { padding: 20, display: "flex", flexDirection: "column", gap: 8 },
  cardRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { fontSize: 12, color: "#7878A0" },
  cardValue: { fontSize: 13, color: "#FFFFFF", fontWeight: 600 },
  badge: {
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    border: "1px solid",
    textTransform: "capitalize",
  },
  actions: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  },
  approveBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#4A8C5C",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  rejectBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#E05555",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  lightbox: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    cursor: "pointer",
  },
  lightboxImg: {
    maxWidth: "90%",
    maxHeight: "90%",
    objectFit: "contain",
    borderRadius: 8,
  },
};

export default App;
