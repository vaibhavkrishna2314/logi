require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const db = require("./db");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});


// ================= CUSTOMERS =================

app.post("/customers", (req, res) => {
  const { name, address, pan, gst_number, is_active } = req.body;

  db.query(
    "INSERT INTO customers (name, address, pan, gst_number, is_active) VALUES (?, ?, ?, ?, ?)",
    [name, address, pan, gst_number, is_active ? 1 : 0],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error adding customer");
      }
      res.send("Customer Added ✅");
    }
  );
});

app.get("/customers", (req, res) => {
  db.query("SELECT * FROM customers", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching customers");
    }
    res.json(result);
  });
});


// ================= ITEMS =================

app.post("/items", (req, res) => {
  const { name, price, is_active } = req.body;

  db.query(
    "INSERT INTO items (name, price, is_active) VALUES (?, ?, ?)",
    [name, price, is_active ? 1 : 0],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error adding item");
      }
      res.send("Item Added ✅");
    }
  );
});

app.get("/items", (req, res) => {
  db.query("SELECT * FROM items", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching items");
    }
    res.json(result);
  });
});


// ================= CREATE INVOICE =================

app.post("/invoice", (req, res) => {
  const { customer_id, items } = req.body;

  if (!customer_id || !items || items.length === 0) {
    return res.status(400).send("Invalid request data");
  }

  db.query(
    "SELECT is_active FROM customers WHERE id = ?",
    [customer_id],
    (err, customerResult) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server error");
      }

      if (customerResult.length === 0) {
        return res.status(404).send("Customer not found");
      }

      const is_active = customerResult[0].is_active;
      let total = 0;

      const itemIds = items.map((i) => i.item_id);

      db.query(
        "SELECT * FROM items WHERE id IN (?)",
        [itemIds],
        (err, itemResults) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Server error");
          }

          for (let item of items) {
            const itemData = itemResults.find(
              (i) => i.id == item.item_id
            );

            if (!itemData) {
              return res
                .status(400)
                .send(`Item not found with id ${item.item_id}`);
            }

            total += itemData.price * item.quantity;
          }

          if (!is_active) {
            total = total + total * 0.18;
          }

          // ✅ FIXED: invoice_code
          const invoice_code =
            "INVC" + Math.floor(100000 + Math.random() * 900000);

          db.query(
            "INSERT INTO invoices (invoice_code, customer_id, total_amount) VALUES (?, ?, ?)",
            [invoice_code, customer_id, total],
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).send("Server error");
              }

              const invoiceDbId = result.insertId;

              for (let item of items) {
                const itemData = itemResults.find(
                  (i) => i.id == item.item_id
                );

                db.query(
                  "INSERT INTO invoice_items (invoice_id, item_id, quantity, price) VALUES (?, ?, ?, ?)",
                  [
                    invoiceDbId,
                    item.item_id,
                    item.quantity,
                    itemData.price,
                  ]
                );
              }

              res.json({
                message: "Invoice Created ✅",
                invoice_code,
                total,
              });
            }
          );
        }
      );
    }
  );
});


// ================= DASHBOARD API =================

app.get("/invoices", (req, res) => {
  const query = `
    SELECT 
      invoices.id,
      invoices.invoice_code,
      invoices.total_amount,
      customers.name AS customer_name,
      GROUP_CONCAT(items.name) AS items
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    JOIN invoice_items ON invoices.id = invoice_items.invoice_id
    JOIN items ON items.id = invoice_items.item_id
    GROUP BY invoices.id
    ORDER BY invoices.id DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching invoices");
    }
    res.json(result);
  });
});


// ================= EXTRA APIs =================

app.get("/invoices/customer/:id", (req, res) => {
  const customerId = req.params.id;

  db.query(
    "SELECT * FROM invoices WHERE customer_id = ?",
    [customerId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server error");
      }
      res.json(result);
    }
  );
});

app.get("/invoice/:id", (req, res) => {
  const invoiceCode = req.params.id;

  const query = `
    SELECT 
      invoices.invoice_code,
      invoices.total_amount,
      customers.name AS customer_name,
      customers.address,
      customers.pan,
      customers.gst_number,
      items.name AS item_name,
      invoice_items.quantity,
      invoice_items.price
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    JOIN invoice_items ON invoices.id = invoice_items.invoice_id
    JOIN items ON items.id = invoice_items.item_id
    WHERE invoices.invoice_code = ?
  `;

  db.query(query, [invoiceCode], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server error");
    }

    if (result.length === 0) {
      return res.status(404).send("Invoice not found");
    }

    const invoice = {
      invoice_code: result[0].invoice_code,
      total_amount: result[0].total_amount,
      customer_name: result[0].customer_name,
      address: result[0].address,
      pan: result[0].pan,
      gst_number: result[0].gst_number,
      items: result.map(r => ({
        name: r.item_name,
        quantity: r.quantity,
        price: r.price
      }))
    };

    res.json(invoice);
  });
});


// ================= SERVER =================

const PORT = Number.parseInt(process.env.PORT, 10) || 5001;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server started on http://${HOST}:${PORT}`);
});