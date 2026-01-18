// components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaMoneyBillWave, FaWallet, FaPiggyBank, FaUser, FaCog, FaChartLine } from "react-icons/fa";

function Sidebar({ isOpen }: { isOpen: boolean }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: <FaHome />, label: "Dashboard", color: "from-blue-500 to-purple-600" },
    { path: "/income", icon: <FaMoneyBillWave />, label: "Income", color: "from-green-500 to-emerald-600" },
    { path: "/expenses", icon: <FaWallet />, label: "Expenses", color: "from-red-500 to-pink-600" },
    { path: "/savings", icon: <FaPiggyBank />, label: "Savings", color: "from-cyan-500 to-blue-600" },
    { path: "/profile", icon: <FaUser />, label: "Profile", color: "from-blue-500 to-purple-600" },
    { path: "/settings", icon: <FaCog />, label: "Settings", color: "from-blue-500 to-purple-600" },
    { path: "/recycle-bin", icon: <FaChartLine />, label: "Recycle Bin", color: "from-blue-500 to-purple-600" },
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

        <nav className="mt-6 px-3 space-y-6">
          {/* Main Activity Section - Distinct Box */}
          <div className="space-y-4">
            {isOpen && <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Activity</p>}
            <div className={`p-2 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-inner flex flex-col gap-1`}>
              {/* Dashboard Link */}
              {menuItems.filter(item => item.label === "Dashboard").map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative
                      ${isActive
                        ? `bg-white/90 text-blue-600 shadow-md border border-blue-100`
                        : "text-gray-600 hover:bg-white/50 hover:text-blue-600"
                      }
                    `}
                  >
                    <span className="text-lg relative z-10">{item.icon}</span>
                    {isOpen && <span className="font-semibold relative z-10">{item.label}</span>}
                    {isActive && isOpen && <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                  </Link>
                );
              })}

              {/* Separator inside box */}
              <div className="mx-4 my-1 border-t border-gray-200/30"></div>

              {/* Core Financial Section */}
              {menuItems.filter(item => ["Income", "Expenses", "Savings"].includes(item.label)).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group flex items-center gap-4 px-4 py-3.5 rounded-[1.75rem] transition-all duration-500 relative overflow-hidden
                      ${isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-xl scale-[1.02]`
                        : "text-gray-700 hover:bg-white/80 hover:shadow-md hover:scale-[1.02]"
                      }
                    `}
                  >
                    <span className={`text-xl relative z-10 ${isActive ? 'drop-shadow-lg' : ''}`}>{item.icon}</span>
                    {isOpen && (
                      <span className={`font-bold relative z-10 ${isActive ? 'drop-shadow-md' : ''}`}>
                        {item.label}
                      </span>
                    )}
                    {isActive && isOpen && (
                      <span className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Secondary Section */}
          <div className="space-y-4">
            {isOpen && <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Preferences</p>}
            <div className="space-y-2">
              {menuItems.filter(item => ["Profile", "Settings", "Recycle Bin"].includes(item.label)).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative
                      ${isActive
                        ? `bg-white/90 text-blue-600 shadow-md border border-blue-100`
                        : "text-gray-600 hover:bg-white/50 hover:text-blue-600"
                      }
                    `}
                  >
                    <span className="text-lg relative z-10">{item.icon}</span>
                    {isOpen && <span className="font-semibold relative z-10">{item.label}</span>}
                    {isActive && isOpen && <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;