import { useEffect, useState } from "react";
import API from "../services/api";

export default function Customers({ setPage }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ letterSpacing: "1px" }}>CUSTOMERS</h2>

        {/* ADD BUTTON */}
        <button
          onClick={() => setPage("addCustomer")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#2e2b7f",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          + ADD
        </button>
      </div>

      {/* Customer Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {customers.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "16px",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* Name */}
            <h4 style={{ marginBottom: "8px" }}>{c.name}</h4>

            {/* Address (optional display) */}
            {c.address && (
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
                {c.address}
              </p>
            )}

            {/* GST (optional display) */}
            {c.gst_number && (
              <p style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>
                GST: {c.gst_number}
              </p>
            )}

            {/* Status */}
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "500",
                background: c.is_active ? "#d4edda" : "#f8d7da",
                color: c.is_active ? "green" : "red",
              }}
            >
              {c.is_active ? "Active" : "In-Active"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}