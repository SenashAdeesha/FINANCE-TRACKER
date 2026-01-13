// pages/Settings.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  FaBell, 
  FaLock, 
  FaPalette, 
  FaUser, 
  FaDatabase,
  FaShieldAlt,
  FaGlobe,
  FaClock,
  FaChevronRight,
  FaSave,
  FaUndo
} from "react-icons/fa";

function Settings() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as 'general' | 'security' | 'notifications' | 'preferences' | null;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'preferences'>(tabFromUrl || 'general');
  
  useEffect(() => {
    const tab = searchParams.get("tab") as 'general' | 'security' | 'notifications' | 'preferences' | null;
    if (tab && ['general', 'security', 'notifications', 'preferences'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+94 77 123 4567",
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
    { id: 'preferences' as const, label: 'Preferences', icon: <FaPalette /> },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} pageTitle="Settings" />

        <main className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <nav className="flex flex-col">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-6 py-4 text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                      {activeTab === tab.id && <FaChevronRight className="ml-auto text-sm" />}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaUser className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
                        <p className="text-sm text-gray-600">Update your personal information</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="pt-6 border-t">
                        <div className="flex items-center gap-3 mb-4">
                          <FaDatabase className="text-gray-400" />
                          <h3 className="font-semibold text-gray-900">Account Actions</h3>
                        </div>
                        <div className="space-y-3">
                          <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                            Export My Data
                          </button>
                          <button className="w-full text-left px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium">
                            Deactivate Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FaLock className="text-red-600 text-lg" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                        <p className="text-sm text-gray-600">Manage your account security</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Password</h3>
                            <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Change
                          </button>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Not Enabled
                            </span>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Enable
                          </button>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Active Sessions</h3>
                            <p className="text-sm text-gray-600">Manage devices where you're currently logged in</p>
                            <p className="text-sm text-gray-500 mt-2">3 active sessions</p>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                            Manage
                          </button>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Login History</h3>
                            <p className="text-sm text-gray-600">Review recent login activity on your account</p>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FaBell className="text-purple-600 text-lg" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                        <p className="text-sm text-gray-600">Choose what updates you want to receive</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates and alerts via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', description: 'Get notifications on your device' },
                        { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Alert when approaching budget limits' },
                        { key: 'goalReminders', label: 'Goal Reminders', description: 'Reminders about your financial goals' },
                        { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly financial summaries' },
                        { key: 'transactionAlerts', label: 'Transaction Alerts', description: 'Instant alerts for new transactions' },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.label}</div>
                            <div className="text-sm text-gray-600">{item.description}</div>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof typeof notifications]}
                              onChange={() => handleNotificationChange(item.key)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 transition-colors"></div>
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferences Settings */}
                {activeTab === 'preferences' && (
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FaPalette className="text-green-600 text-lg" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Application Preferences</h2>
                        <p className="text-sm text-gray-600">Customize your experience</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FaGlobe className="text-gray-400" />
                            Currency
                          </div>
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="LKR">LKR - Sri Lankan Rupee (Rs.)</option>
                            <option value="USD">USD - US Dollar ($)</option>
                            <option value="EUR">EUR - Euro (€)</option>
                            <option value="GBP">GBP - British Pound (£)</option>
                            <option value="INR">INR - Indian Rupee (₹)</option>
                            <option value="AUD">AUD - Australian Dollar (A$)</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FaGlobe className="text-gray-400" />
                            Language
                          </div>
                          <select
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="English">English</option>
                            <option value="Sinhala">සිංහල (Sinhala)</option>
                            <option value="Tamil">தமிழ் (Tamil)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FaClock className="text-gray-400" />
                            Date Format
                          </div>
                          <select
                            name="dateFormat"
                            value={formData.dateFormat}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FaClock className="text-gray-400" />
                            Timezone
                          </div>
                          <select
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="Asia/Colombo">(GMT+5:30) Asia/Colombo</option>
                            <option value="America/New_York">(GMT-5:00) America/New_York</option>
                            <option value="Europe/London">(GMT+0:00) Europe/London</option>
                            <option value="Asia/Tokyo">(GMT+9:00) Asia/Tokyo</option>
                            <option value="Australia/Sydney">(GMT+11:00) Australia/Sydney</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between rounded-b-xl">
                  <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium">
                    <FaUndo className="text-sm" />
                    Reset Changes
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                    <FaSave className="text-sm" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
