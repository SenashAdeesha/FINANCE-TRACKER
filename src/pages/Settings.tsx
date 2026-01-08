// pages/Settings.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  FaBell, 
  FaLock, 
  FaGlobe, 
  FaPalette, 
  FaDatabase, 
  FaShieldAlt,
  FaMoon,
  FaSun,
  FaCheckCircle
} from "react-icons/fa";

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: false,
  });
  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("LKR");
  const [language, setLanguage] = useState("en");
  const [saved, setSaved] = useState(false);

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
            {saved && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <FaCheckCircle />
                <span>Settings saved successfully!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notifications Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaBell className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <p className="text-sm text-gray-600">Manage your notification preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <label htmlFor={key} className="text-gray-700 cursor-pointer">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id={key}
                        checked={value}
                        onChange={() => handleNotificationToggle(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaPalette className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Appearance</h2>
                  <p className="text-sm text-gray-600">Customize your app appearance</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        theme === "light" 
                          ? "border-blue-600 bg-blue-50 text-blue-600" 
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <FaSun />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        theme === "dark" 
                          ? "border-blue-600 bg-blue-50 text-blue-600" 
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <FaMoon />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaGlobe className="text-green-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Regional Settings</h2>
                  <p className="text-sm text-gray-600">Set your language and currency</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LKR">Sri Lankan Rupee (Rs.)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="INR">Indian Rupee (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="si">Sinhala</option>
                    <option value="ta">Tamil</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaShieldAlt className="text-red-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Security</h2>
                  <p className="text-sm text-gray-600">Manage your account security</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FaLock className="text-gray-600" />
                    <span className="text-gray-700">Change Password</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-gray-600" />
                    <span className="text-gray-700">Two-Factor Authentication</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FaDatabase className="text-gray-600" />
                    <span className="text-gray-700">Privacy Settings</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FaDatabase className="text-orange-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Data Management</h2>
                  <p className="text-sm text-gray-600">Manage your financial data</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📥</div>
                    <div className="font-medium text-gray-700">Export Data</div>
                    <div className="text-xs text-gray-500 mt-1">Download your data</div>
                  </div>
                </button>

                <button className="p-4 rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📤</div>
                    <div className="font-medium text-gray-700">Import Data</div>
                    <div className="text-xs text-gray-500 mt-1">Upload CSV file</div>
                  </div>
                </button>

                <button className="p-4 rounded-lg border-2 border-red-300 hover:border-red-600 hover:bg-red-50 transition-all">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🗑️</div>
                    <div className="font-medium text-red-600">Delete Account</div>
                    <div className="text-xs text-gray-500 mt-1">Permanently delete</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Settings
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
