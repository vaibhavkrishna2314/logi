import { useEffect, useRef, useState } from "react";
import API from "../services/api";

export default function Billing() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);

  const [invoice, setInvoice] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const createLockRef = useRef(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const cust = await API.get("/customers");
    const itm = await API.get("/items");

    setCustomers(cust.data);
    setItems(itm.data);
  };

  const addItem = (item) => {
    const exists = selectedItems.find(i => i.id === item.id);

    if (exists) {
      setSelectedItems(selectedItems.map(i =>
        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, change) => {
    setSelectedItems(selectedItems.map(i =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + change) } : i
    ));
  };

  const total = selectedItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const handleCreate = async () => {
    if (createLockRef.current || isCreating || !selectedCustomer || selectedItems.length === 0) return;

    try {
      createLockRef.current = true;
      setIsCreating(true);

      const res = await API.post("/invoice", {
        customer_id: selectedCustomer.id,
        items: selectedItems.map(i => ({
          item_id: i.id,
          quantity: i.qty
        }))
      });

      setInvoice(res.data);
    } catch (err) {
      console.error("Error creating invoice", err);
    } finally {
      setIsCreating(false);
      createLockRef.current = false;
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Billing</h2>

      {/* ================= FINAL INVOICE ================= */}
      {invoice ? (
        <div style={box}>
          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={sectionTitle}>Customer Details</p>
            <p><b>Invoice ID: {invoice.invoice_code}</b></p>
          </div>

          <hr />

          {/* CUSTOMER */}
          <div style={{ marginBottom: "20px" }}>
            <p><b>Name:</b> {selectedCustomer.name}</p>
            <p><b>Address:</b> {selectedCustomer.address}</p>
            <p><b>PAN:</b> {selectedCustomer.pan}</p>
            <p><b>GST:</b> {selectedCustomer.gst_number}</p>
          </div>

          {/* ITEMS */}
          <p style={sectionTitle}>Items</p>
          <hr />

          <div style={rowHeader}>
            <span>Name</span>
            <span>Amount</span>
            <span>Amount</span>
          </div>

          {selectedItems.map(i => (
            <div key={i.id} style={row}>
              <span>{i.name}</span>
              <span>{i.qty}</span>
              <span>₹ {i.price * i.qty}</span>
            </div>
          ))}

          <hr />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <b>Total</b>
            <b>₹ {invoice.total}</b>
          </div>
        </div>
      ) : (
        <>
          {/* ================= CUSTOMER ================= */}
          <div style={box}>
            <p style={sectionTitle}>Customer Details</p>
            <hr />

            {selectedCustomer ? (
              <div>
                <p><b>Name:</b> {selectedCustomer.name}</p>
                <p><b>Address:</b> {selectedCustomer.address}</p>
                <p><b>PAN:</b> {selectedCustomer.pan}</p>
                <p><b>GST:</b> {selectedCustomer.gst_number}</p>
              </div>
            ) : (
              <center>
                <button style={addBtn} onClick={() => setShowCustomerModal(true)}>
                  + ADD
                </button>
              </center>
            )}
          </div>

          {/* ================= ITEMS ================= */}
          {selectedCustomer && (
            <div style={box}>
              <p style={sectionTitle}>Items</p>
              <hr />

              {selectedItems.length === 0 ? (
                <center>
                  <button style={addBtn} onClick={() => setShowItemsModal(true)}>
                    + ADD
                  </button>
                </center>
              ) : (
                <>
                  <div style={rowHeader}>
                    <span>Name</span>
                    <span>Amount</span>
                    <span>Amount</span>
                  </div>

                  {selectedItems.map(i => (
                    <div key={i.id} style={row}>
                      <span>{i.name}</span>

                      <div>
                        <button onClick={() => updateQty(i.id, -1)}>-</button>
                        <span style={{ margin: "0 10px" }}>{i.qty}</span>
                        <button onClick={() => updateQty(i.id, 1)}>+</button>
                      </div>

                      <span>₹ {i.price * i.qty}</span>
                    </div>
                  ))}

                  <hr />

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <b>Total</b>
                    <b>₹ {total}</b>
                  </div>

                  <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                    <button style={cancelBtn}>Cancel</button>
                    <button
                      style={createBtn(isCreating)}
                      onClick={handleCreate}
                      disabled={isCreating}
                    >
                      {isCreating ? "Creating..." : "Create"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= MODALS ================= */}
      {showCustomerModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Select Customer</h3>

            <div style={grid}>
              {customers.map(c => (
                <div
                  key={c.id}
                  style={card}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setShowCustomerModal(false);
                  }}
                >
                  <h4>{c.name}</h4>
                  <span style={status(c.is_active)}>
                    {c.is_active ? "Active" : "In-Active"}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => setShowCustomerModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showItemsModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Select Items</h3>

            <div style={grid}>
              {items.map(i => (
                <div key={i.id} style={card}>
                  <h4>{i.name}</h4>

                  {i.is_active ? (
                    <button onClick={() => addItem(i)}>ADD</button>
                  ) : (
                    <span style={{ color: "red" }}>In-Active</span>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => setShowItemsModal(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const box = {
  border: "1px solid #ddd",
  padding: "20px",
  marginBottom: "20px",
  background: "#fafafa",
  borderRadius: "6px",
};

const sectionTitle = { fontWeight: "600" };

const addBtn = {
  padding: "8px 16px",
  borderRadius: "20px",
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

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

const cancelBtn = {
  border: "1px solid red",
  color: "red",
  background: "#fff",
  padding: "6px 12px",
};

const createBtn = (disabled) => ({
  background: "#2e2b7f",
  color: "#fff",
  padding: "6px 12px",
  border: "none",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.7 : 1,
});

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
};

const modal = {
  background: "#fff",
  padding: "20px",
  width: "40%",
  margin: "100px auto",
  borderRadius: "6px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  margin: "20px 0",
};

const card = {
  border: "1px solid #ddd",
  padding: "10px",
  cursor: "pointer",
};

const status = (active) => ({
  color: active ? "green" : "red",
});