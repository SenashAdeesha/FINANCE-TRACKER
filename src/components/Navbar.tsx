import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

type Props = {
  onToggleSidebar?: () => void;
  pageTitle?: string;
};

function Navbar({ onToggleSidebar, pageTitle }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="md:hidden text-gray-600 p-2 rounded hover:bg-gray-100">☰</button>
        {pageTitle && <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 px-2 py-1 rounded hover:bg-gray-100">🔔</button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">S</div>
          <span className="text-gray-700 font-medium">Sena</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
