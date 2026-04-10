import { useEffect, useState } from "react";
import API from "../services/api";

export default function Items({ setPage }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
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
        <h2 style={{ letterSpacing: "1px" }}>ITEMS</h2>

        {/* ADD BUTTON */}
        <button
          onClick={() => setPage("addItem")}
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

      {/* Item Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "16px",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* Name */}
            <h4 style={{ marginBottom: "10px" }}>{item.name}</h4>

            {/* Price (optional but useful) */}
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>
              ₹ {item.price}
            </p>

            {/* Status */}
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "500",
                background: item.is_active ? "#d4edda" : "#f8d7da",
                color: item.is_active ? "green" : "red",
              }}
            >
              {item.is_active ? "Active" : "In-Active"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

