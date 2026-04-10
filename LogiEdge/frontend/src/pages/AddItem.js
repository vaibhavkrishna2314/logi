import { useState } from "react";
import API from "../services/api";

export default function AddItem({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/items", {
        name: form.name,
        price: form.price,
        is_active: form.status === "Active",
      });

      setPage("items");
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Add New Item</h2>

      {/* FORM GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          maxWidth: "600px",
        }}
      >
        {/* Item Name */}
        <div>
          <label>Item Name</label>
          <input
            name="name"
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Price */}
        <div>
          <label>Customer Selling Price</label>
          <input
            name="price"
            type="number"
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Status */}
        <div>
          <label>Customer Status</label>
          <select
            name="status"
            onChange={handleChange}
            style={inputStyle}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* BUTTONS */}
      <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setPage("items")}
          style={{
            padding: "8px 16px",
            border: "1px solid red",
            color: "red",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          style={{
            padding: "8px 16px",
            background: "#2e2b7f",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};