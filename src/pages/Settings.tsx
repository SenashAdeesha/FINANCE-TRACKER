// pages/Settings.tsx - Modern Version
import { useState } from "react";
import PageLayout from "../components/PageLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { useTheme } from "../context/ThemeContext";
import { 
  FaBell, 
  FaLock, 
  FaPalette, 
  FaUser, 
  FaShieldAlt,
  FaGlobe,
  FaMoon,
  FaSun,
  FaSave
} from "react-icons/fa";

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'appearance'>('general');
  const { darkMode, setDarkMode, fontSize, setFontSize } = useTheme();
  
  const [formData, setFormData] = useState({
    currency: "LKR",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    timezone: "Asia/Colombo"
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: false,
    transactionAlerts: true
  });

  const handleNotificationChange = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const tabs = [
    { id: 'general' as const, label: 'General', icon: <FaUser /> },
    { id: 'security' as const, label: 'Security', icon: <FaShieldAlt /> },
    { id: 'notifications' as const, label: 'Notifications', icon: <FaBell /> },
    { id: 'appearance' as const, label: 'Appearance', icon: <FaPalette /> },
  ];

  return (
    <PageLayout 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
      title="Settings"
      subtitle="Manage your account settings and preferences"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-2">
            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 text-left rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeTab === 'general' && (
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <FaUser className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
                  <p className="text-gray-600">Manage your basic preferences</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Currency</h3>
                  <p className="text-gray-600 text-sm mb-4">Set your preferred currency for transactions</p>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="LKR">Sri Lankan Rupee (LKR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaGlobe /> Language
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">Choose your preferred language</p>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>

                <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Date Format</h3>
                  <p className="text-gray-600 text-sm mb-4">Select how dates should be displayed</p>
                  <select
                    name="dateFormat"
                    value={formData.dateFormat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Timezone</h3>
                  <p className="text-gray-600 text-sm mb-4">Set your local timezone</p>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="Asia/Colombo">Asia/Colombo (UTC+5:30)</option>
                    <option value="America/New_York">America/New_York (UTC-5)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Button icon={<FaSave />}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <FaShieldAlt className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                  <p className="text-gray-600">Keep your account secure</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaLock /> Change Password
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">Update your password regularly to keep your account secure</p>
                  <Button variant="primary" size="sm">
                    Update Password
                  </Button>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-600 text-sm mb-4">Add an extra layer of security to your account</p>
                  <Button variant="success" size="sm">
                    Enable 2FA
                  </Button>
                </div>

                <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Active Sessions</h3>
                  <p className="text-gray-600 text-sm mb-4">Manage devices that have access to your account</p>
                  <Button variant="secondary" size="sm">
                    View Sessions
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <FaBell className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
                  <p className="text-gray-600">Manage how you receive notifications</p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-600">
                        {key === 'emailNotifications' && 'Receive updates via email'}
                        {key === 'pushNotifications' && 'Get push notifications on your device'}
                        {key === 'budgetAlerts' && 'Alerts when you exceed budget limits'}
                        {key === 'goalReminders' && 'Reminders about your savings goals'}
                        {key === 'weeklyReports' && 'Weekly financial summary reports'}
                        {key === 'transactionAlerts' && 'Alerts for each transaction'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        value ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                          value ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}

                <div className="pt-4">
                  <Button icon={<FaSave />}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <FaPalette className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Appearance Settings</h2>
                  <p className="text-gray-600">Customize how Finance Tracker looks</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setDarkMode(false)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        !darkMode 
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <FaSun className="text-4xl text-yellow-500 mb-2 mx-auto" />
                      <p className="font-semibold text-gray-900">Light</p>
                    </button>
                    <button
                      onClick={() => setDarkMode(true)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        darkMode 
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <FaMoon className="text-4xl text-purple-600 mb-2 mx-auto" />
                      <p className="font-semibold text-gray-900">Dark</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Font Size
                  </label>
                  <div className="flex gap-3">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size as 'small' | 'medium' | 'large')}
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                          fontSize === size
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button icon={<FaSave />}>
                    Save Appearance
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default Settings;
