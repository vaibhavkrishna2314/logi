import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Billing from "./pages/Billing";
import AddCustomer from "./pages/AddCustomer"; 
import AddItem from "./pages/AddItem";
import Master from "./pages/Master";
import InvoiceDetails from "./pages/InvoiceDetails"; 

function App() {
  const [page, setPage] = useState("dashboard");
  const [invoiceId, setInvoiceId] = useState(null); 

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
          <Dashboard
            setPage={setPage}
            setInvoiceId={setInvoiceId} 
          />
        );

      case "master":
        return <Master setPage={setPage} />;

      case "customers":
        return <Customers setPage={setPage} />;

      case "items":
        return <Items setPage={setPage} />;

      case "billing":
        return <Billing />;

      case "addCustomer":
        return <AddCustomer setPage={setPage} />;

      case "addItem":
        return <AddItem setPage={setPage} />;

      case "invoiceDetails":
        return <InvoiceDetails invoiceId={invoiceId} />; // ✅ NEW

      default:
        return (
          <Dashboard
            setPage={setPage}
            setInvoiceId={setInvoiceId}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      
      {/* TOP BAR */}
      <div
        style={{
          height: "60px",
          background: "#2e2b7f",
          width: "100%",
        }}
      />

      {/* MAIN LAYOUT */}
      <div style={{ display: "flex" }}>
        <Sidebar setPage={setPage} active={page} />

        <div style={{ flex: 1, padding: "30px 40px" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;