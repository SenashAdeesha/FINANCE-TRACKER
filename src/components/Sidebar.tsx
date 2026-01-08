// components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaMoneyBillWave, FaWallet, FaUser, FaSignInAlt, FaCog } from "react-icons/fa";

function Sidebar({ isOpen }: { isOpen: boolean }) {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: <FaHome />, label: "Dashboard" },
    { path: "/income", icon: <FaMoneyBillWave />, label: "Income" },
    { path: "/expenses", icon: <FaWallet />, label: "Expenses" },
    { path: "/profile", icon: <FaUser />, label: "Profile" },
    { path: "/settings", icon: <FaCog />, label: "Settings" },
    { path: "/login", icon: <FaSignInAlt />, label: "Login" },
  ];

  return (
    <aside className={`bg-white shadow-lg transition-all ${isOpen ? "w-64" : "w-20"}`}>
      <div className="p-4">
        <h2 className={`font-bold text-xl ${isOpen ? "" : "text-center"}`}>
          {isOpen ? "Finance Tracker" : "FT"}
        </h2>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors ${
              location.pathname === item.path ? "bg-primary text-white hover:bg-primary" : ""
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;