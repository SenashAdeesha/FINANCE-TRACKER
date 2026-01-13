// pages/Profile.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  FaEdit, 
  FaCamera, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaUser, 
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaBriefcase
} from "react-icons/fa";

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+94 77 123 4567",
    address: "123 Main Street",
    city: "Colombo",
    country: "Sri Lanka",
    postalCode: "00300",
    dateOfBirth: "1990-05-15",
    occupation: "Software Engineer",
    bio: "Financial enthusiast focused on building wealth and achieving financial independence."
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar 
          onToggleSidebar={() => setSidebarOpen((s) => !s)} 
          pageTitle="Profile"
          underlineColor="bg-gradient-to-r from-orange-500 to-pink-600"
        />

        <main className="p-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-600 text-sm">Manage your account information and personal details</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all hover:scale-105 flex items-center gap-3 border-2 border-orange-400"
              >
                <FaEdit className="text-lg" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white/90 via-orange-50/40 to-pink-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 relative overflow-hidden">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>
                
                <div className="flex flex-col items-center relative z-10">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 shadow-lg transition-colors">
                        <FaCamera size={16} />
                      </button>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mt-4 text-gray-800">{profileData.firstName} {profileData.lastName}</h2>
                  <p className="text-gray-600 mt-1">{profileData.occupation}</p>

                  <div className="w-full mt-6 pt-6 border-t border-gray-200/50 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center flex-shrink-0 shadow-md">
                        <FaEnvelope className="text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Email</p>
                        <p className="font-bold text-gray-800 break-all">{profileData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0 shadow-md">
                        <FaPhone className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Phone</p>
                        <p className="font-bold text-gray-800">{profileData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center flex-shrink-0 shadow-md">
                        <FaMapMarkerAlt className="text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Location</p>
                        <p className="font-bold text-gray-800">{profileData.city}, {profileData.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0 shadow-md">
                        <FaCalendar className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Member Since</p>
                        <p className="font-bold text-gray-800">January 2025</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-md">
                      <FaShieldAlt className="text-white" size={14} />
                    </div>
                    Account Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Account Type</span>
                      <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs rounded-xl font-bold shadow-lg shadow-orange-500/30">Premium</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Verification</span>
                      <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs rounded-xl font-bold flex items-center gap-1 shadow-md">
                        <FaShieldAlt size={10} />
                        Verified
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Status</span>
                      <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs rounded-xl font-bold shadow-md">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-white/90 via-orange-50/40 to-pink-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 relative overflow-hidden">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl -z-10"></div>
                
                <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <FaUser className="text-white" size={18} />
                    </div>
                    Account Details
                  </h2>
                  {isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <FaTimes size={16} />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-xl shadow-orange-500/30 hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3 border-2 border-orange-400"
                      >
                        <FaSave size={16} />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-pink-600 rounded-full"></div>
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profileData.dateOfBirth}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaBriefcase className="inline mr-2 text-gray-400" size={14} />
                          Occupation
                        </label>
                        <input
                          type="text"
                          name="occupation"
                          value={profileData.occupation}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="pt-6 border-t border-gray-200/50">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-pink-600 rounded-full"></div>
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaEnvelope className="inline mr-2 text-gray-400" size={14} />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaPhone className="inline mr-2 text-gray-400" size={14} />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div className="pt-6 border-t border-gray-200/50">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-pink-600 rounded-full"></div>
                      <FaMapMarkerAlt className="text-gray-400" size={14} />
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={profileData.postalCode}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={profileData.country}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="pt-6 border-t border-gray-200/50">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-pink-600 rounded-full"></div>
                      About
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none transition-all shadow-sm hover:shadow-md font-medium"
                      />
                    </div>
                  </div>
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