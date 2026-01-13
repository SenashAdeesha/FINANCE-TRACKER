// components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaMoneyBillWave, FaWallet, FaPiggyBank, FaUser, FaSignInAlt, FaCog, FaChartLine } from "react-icons/fa";

function Sidebar({ isOpen }: { isOpen: boolean }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: <FaHome />, label: "Dashboard", color: "from-blue-500 to-purple-600" },
    { path: "/income", icon: <FaMoneyBillWave />, label: "Income", color: "from-green-500 to-emerald-600" },
    { path: "/expenses", icon: <FaWallet />, label: "Expenses", color: "from-red-500 to-pink-600" },
    { path: "/savings", icon: <FaPiggyBank />, label: "Savings", color: "from-purple-500 to-indigo-600" },
    { path: "/profile", icon: <FaUser />, label: "Profile", color: "from-orange-500 to-pink-600" },
    { path: "/settings", icon: <FaCog />, label: "Settings", color: "from-gray-600 to-gray-800" },
  ];

  return (
    <aside className={`bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-3xl shadow-2xl border-r border-white/30 transition-all duration-300 ${isOpen ? "w-64" : "w-20"} relative z-20 overflow-hidden`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        <div className="p-6 border-b border-gray-200/50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
              <FaChartLine className="text-white text-xl" />
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Finance Tracker
                </span>
                <p className="text-xs text-gray-500 mt-0.5">Manage Your Money</p>
              </div>
            )}
          </Link>
        </div>
        
        <nav className="mt-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden
                  ${isActive 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color}/25 scale-105` 
                    : "text-gray-700 hover:bg-white/80 hover:shadow-md hover:scale-105"
                  }
                `}
              >
                {/* Hover glow effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 rounded-2xl"></div>
                )}
                
                <span className={`text-xl relative z-10 ${isActive ? 'drop-shadow-lg' : ''}`}>{item.icon}</span>
                {isOpen && (
                  <span className={`font-semibold relative z-10 ${isActive ? 'drop-shadow-md' : ''}`}>
                    {item.label}
                  </span>
                )}
                
                {/* Active indicator dot */}
                {isActive && isOpen && (
                  <span className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;