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
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const API_BASE_URL = 'http://localhost:3001/api';

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'appearance'>('general');
  const { darkMode, setDarkMode, fontSize, setFontSize } = useTheme();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

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

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      setPasswordLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 1;

      const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      alert("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error('Error updating password:', err);
      alert(err instanceof Error ? err.message : "Failed to update password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
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
                  className={`flex items-center gap-3 px-4 py-3.5 text-left rounded-xl transition-all ${activeTab === tab.id
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

                <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaGlobe className="text-blue-600" /> Language
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

                <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50">
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

                <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50">
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
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg text-white font-bold" icon={<FaSave />}>
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <FaShieldAlt className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                  <p className="text-gray-600">Keep your account secure</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaLock className="text-blue-600" /> Change Password
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">Update your password regularly to keep your account secure</p>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Update Password
                  </Button>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50">
                  <h3 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-600 text-sm mb-4">Add an extra layer of security to your account</p>
                  <Button variant="success" size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
                    Enable 2FA
                  </Button>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50">
                  <h3 className="font-semibold text-gray-900 mb-2">Active Sessions</h3>
                  <p className="text-gray-600 text-sm mb-4">Manage devices that have access to your account</p>
                  <Button variant="secondary" size="sm" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
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
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${value ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300'
                        }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${value ? 'translate-x-7' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                ))}

                <div className="pt-4">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg text-white font-bold" icon={<FaSave />}>
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
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
                      className={`p-6 rounded-xl border-2 transition-all ${!darkMode
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                      <FaSun className="text-4xl text-yellow-500 mb-2 mx-auto" />
                      <p className="font-semibold text-gray-900">Light</p>
                    </button>
                    <button
                      onClick={() => setDarkMode(true)}
                      className={`p-6 rounded-xl border-2 transition-all ${darkMode
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
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${fontSize === size
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
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg text-white font-bold" icon={<FaSave />}>
                    Save Appearance
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FaLock className="text-xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                <p className="text-gray-600 text-sm">Update your account password</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors pr-12"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default Settings;
