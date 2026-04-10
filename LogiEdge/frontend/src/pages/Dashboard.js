import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard({ setPage, setInvoiceId }) {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await API.get("/invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices", err);
    }
  };

  // ✅ FIXED (invoice_code + safety)
  const filtered = invoices.filter(inv =>
    (inv.invoice_code || "")
      .toLowerCase()
      .includes((search || "").toLowerCase())
  );

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

      {/* SEARCH */}
      <input
        placeholder="Search by Invoice ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />

      {/* TABLE */}
      <div style={tableBox}>
        
        {/* HEADER */}
        <div style={tableHeader}>
          <span>Invoice ID</span>
          <span>Customer name</span>
          <span>Item name (s)</span>
          <span>Amount</span>
          <span></span>
        </div>

        {/* ROWS */}
        {filtered.map((inv) => (
          <div key={inv.id} style={tableRow}>
            <span>{inv.invoice_code}</span> {/* ✅ FIXED */}
            <span>{inv.customer_name}</span>
            <span>{inv.items}</span>
            <span>{inv.total_amount}</span>

            <button
              style={viewBtn}
              onClick={() => {
                setInvoiceId(inv.invoice_code); // ✅ FIXED
                setPage("invoiceDetails");
              }}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const tableBox = {
  border: "1px solid #ddd",
  borderRadius: "6px",
  overflow: "hidden",
};

const tableHeader = {
  display: "grid",
  gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr 0.5fr",
  background: "#2e2b7f",
  color: "#fff",
  padding: "12px",
  fontWeight: "500",
};

const tableRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr 0.5fr",
  padding: "12px",
  borderTop: "1px solid #eee",
  alignItems: "center",
};

const viewBtn = {
  background: "#2e2b7f",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};