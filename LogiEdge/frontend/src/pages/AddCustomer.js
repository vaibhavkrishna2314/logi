import { useState } from "react";
import API from "../services/api";

export default function AddCustomer({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    pan: "",
    gst: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await API.post("/customers", {
      name: form.name,
      address: form.address,
      pan: form.pan,
      gst_number: form.gst,
      is_active: form.status === "Active",
    });

    setPage("customers");
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Add New Customer</h2>

      {/* FORM GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          maxWidth: "600px",
        }}
      >
        <div>
          <label>Customer Name</label>
          <input
            name="name"
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Customer Address</label>
          <input
            name="address"
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Customer Pan Card Number</label>
          <input
            name="pan"
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Customer GST Number</label>
          <input
            name="gst"
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

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
          onClick={() => setPage("customers")}
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