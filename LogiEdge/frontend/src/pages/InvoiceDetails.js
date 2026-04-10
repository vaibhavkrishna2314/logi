import { useEffect, useState } from "react";
import API from "../services/api";

export default function InvoiceDetails({ invoiceId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    const res = await API.get(`/invoice/${invoiceId}`);
    setData(res.data);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Invoice Details</h2>

      <div style={box}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={sectionTitle}>Customer Details</p>
          <p><b>Invoice ID: {data.invoice_code}</b></p>
        </div>

        <hr />

        {/* CUSTOMER */}
        <div style={{ marginBottom: "20px" }}>
          <p><b>Name:</b> {data.customer_name}</p>
          <p><b>Address:</b> {data.address}</p>
          <p><b>PAN:</b> {data.pan}</p>
          <p><b>GST:</b> {data.gst_number}</p>
        </div>

        {/* ITEMS */}
        <p style={sectionTitle}>Items</p>
        <hr />

        <div style={rowHeader}>
          <span>Name</span>
          <span>Amount</span>
          <span>Amount</span>
        </div>

        {data.items.map((i, idx) => (
          <div key={idx} style={row}>
            <span>{i.name}</span>
            <span>{i.quantity}</span>
            <span>₹ {i.price * i.quantity}</span>
          </div>
        ))}

        <hr />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <b>Total</b>
          <b>₹ {data.total_amount}</b>
        </div>
      </div>
    </div>
  );
}

/* STYLES */
const box = {
  border: "1px solid #ddd",
  padding: "20px",
  background: "#fafafa",
  borderRadius: "6px",
};

const sectionTitle = { fontWeight: "600" };

const rowHeader = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: "600",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
};