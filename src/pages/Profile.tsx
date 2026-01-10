// pages/Profile.tsx
import { useState, type ChangeEvent, type FormEvent } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaEdit, FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaSave, FaTimes } from "react-icons/fa";

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+94 77 123 4567",
    location: "Colombo, Sri Lanka",
    bio: "Finance Enthusiast"
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+94 77 123 4567",
      location: "Colombo, Sri Lanka",
      bio: "Finance Enthusiast"
    });
    setIsEditing(false);
  };

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
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Profile</h1>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded bg-primary text-white flex items-center gap-2"
              >
                <FaEdit className="text-sm" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 flex items-center gap-2"
                >
                  <FaTimes className="text-sm" />
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded bg-green-600 text-white flex items-center gap-2 hover:bg-green-700"
                >
                  <FaSave className="text-sm" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                      {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90">
                      <FaCamera />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold mt-4">{formData.name}</h2>
                  <p className="text-gray-600">{formData.bio}</p>

                  {!isEditing ? (
                    <div className="w-full mt-6 space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <FaEnvelope className="text-gray-400" />
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <FaPhone className="text-gray-400" />
                        <span>{formData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{formData.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <FaCalendar className="text-gray-400" />
                        <span>Member since Jan 2025</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        />
                      </div>
                    </form>
                  )}
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