// pages/Profile.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaEdit, FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: "Total Income", value: "Rs. 120,000", change: "+12%", positive: true },
    { label: "Total Expenses", value: "Rs. 75,000", change: "+8%", positive: false },
    { label: "Net Savings", value: "Rs. 45,000", change: "+18%", positive: true },
    { label: "Active Goals", value: "4", change: "+1", positive: true },
  ];

  const recentActivity = [
    { action: "Added income", detail: "Salary - Rs. 85,000", date: "2 hours ago" },
    { action: "Created goal", detail: "Emergency Fund", date: "1 day ago" },
    { action: "Updated budget", detail: "Groceries category", date: "2 days ago" },
    { action: "Added expense", detail: "Grocery Shopping - Rs. 12,500", date: "3 days ago" },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} pageTitle="Profile" />

        <main className="p-6">
          <div className="mb-6">
            <Link to="/settings?tab=general" className="px-4 py-2 rounded bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-colors">
              <FaEdit className="text-sm" />
              Edit Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                      JD
                    </div>
                    <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90">
                      <FaCamera />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold mt-4">John Doe</h2>
                  <p className="text-gray-600">Finance Enthusiast</p>

                  <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <FaEnvelope className="text-gray-400" />
                      <span>john.doe@example.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FaPhone className="text-gray-400" />
                      <span>+94 77 123 4567</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>Colombo, Sri Lanka</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FaCalendar className="text-gray-400" />
                      <span>Member since Jan 2025</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">Account Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-semibold text-primary">Premium</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="p-4 border rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className={`text-xs mt-1 ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                        {stat.change} from last month
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-gray-600">{activity.detail}</div>
                        <div className="text-xs text-gray-400 mt-1">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Achievements</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="text-xs text-center font-medium">Budget Master</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="text-xs text-center font-medium">Saving Streak</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-xs text-center font-medium">Goal Achiever</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-xs text-center font-medium">Data Tracker</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;