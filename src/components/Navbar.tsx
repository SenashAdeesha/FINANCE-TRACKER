import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBell, FaSearch } from "react-icons/fa";

type Props = {
  onMenuClick?: () => void;
  pageTitle?: string;
  titleColor?: string;
  navbarGradient?: string;
  underlineColor?: string;
  onNotificationClick?: () => void;
};

function Navbar({ onMenuClick, pageTitle, titleColor, navbarGradient, underlineColor, onNotificationClick }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const hasGradient = !!navbarGradient;
  const textColor = hasGradient ? 'text-white' : 'text-gray-800';
  const iconColor = hasGradient ? 'text-white' : 'text-gray-600';
  const hoverBg = hasGradient ? 'hover:bg-white/20' : 'hover:bg-white';

  return (
    <header className={`h-20 shadow-xl border-b flex items-center justify-between px-6 relative z-20 backdrop-blur-3xl ${
      navbarGradient || 'bg-white/70 border-gray-200'
    }`}>
      {/* Decorative overlay */}
      {!hasGradient && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none backdrop-blur-sm"></div>
      )}
      
      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={onMenuClick} 
          className={`lg:hidden p-3 rounded-xl transition-all hover:scale-110 ${iconColor} ${hoverBg} shadow-lg`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {pageTitle && (
          <div>
            <h1 className={`text-3xl md:text-4xl font-extrabold ${
              titleColor || (hasGradient ? 'text-white drop-shadow-lg' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent')
            }`}>
              {pageTitle}
            </h1>
            {!hasGradient && (
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-1"></div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 relative z-10">
        {onNotificationClick && (
          <button 
            onClick={onNotificationClick}
            className={`relative p-3 rounded-xl transition-all hover:scale-110 shadow-lg ${iconColor} ${hoverBg}`}
            title="View Financial Insights"
          >
            <FaBell className="text-xl" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg"></span>
          </button>
        )}
        
        <button 
          onClick={() => navigate("/profile")}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all hover:scale-105 shadow-lg ${hoverBg}`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shadow-xl ${
            hasGradient ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white'
          }`}>
            S
          </div>
          <span className={`hidden md:block font-bold ${textColor}`}>Sena</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all hover:scale-105 font-bold shadow-xl bg-red-600 text-white hover:shadow-2xl hover:bg-red-700"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
      
      {/* Colored underline */}
      {underlineColor && (
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${underlineColor}`}></div>
      )}
    </header>
  );
}

export default Navbar;
