export default function Master({ setPage }) {
  return (
    <div>
      {/* TITLE */}
      <h2 style={{ marginBottom: "20px" }}>Master</h2>

      {/* CARDS */}
      <div style={{ display: "flex", gap: "20px" }}>
        
        {/* CUSTOMER CARD */}
        <div
          onClick={() => setPage("customers")}
          style={card}
        >
          <h4>Customer</h4>
          <p style={subText}>Read or Create customer data</p>
        </div>

        {/* ITEMS CARD */}
        <div
          onClick={() => setPage("items")}
          style={card}
        >
          <h4>Items</h4>
          <p style={subText}>Read or Create items data</p>
        </div>

      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const card = {
  border: "1px solid #ddd",
  padding: "20px",
  width: "220px",
  borderRadius: "6px",
  background: "#fff",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const subText = {
  fontSize: "12px",
  color: "#666",
};