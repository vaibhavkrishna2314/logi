import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";

export default function Sidebar({ setPage, active }) {
  const itemStyle = (key) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: active === key ? "600" : "400",
  });

  return (
    <div
      style={{
        width: "200px",
        borderRight: "1px solid #eee",
        padding: "20px",
      }}
    >
      <div onClick={() => setPage("dashboard")} style={itemStyle("dashboard")}>
        <DashboardIcon fontSize="small" />
        Dashboard
      </div>

      <div onClick={() => setPage("master")} style={itemStyle("dashboard")}>
        <CategoryIcon fontSize="small" />
        Master
      </div>

      <div onClick={() => setPage("billing")} style={itemStyle("billing")}>
        <ReceiptIcon fontSize="small" />
        Billing
      </div>
    </div>
  );
}