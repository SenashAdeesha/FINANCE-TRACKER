import { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaShieldAlt,
  FaBriefcase,
  FaEdit,
  FaCamera,
  FaTimes,
  FaSave,
  FaTrash
} from "react-icons/fa";

import PageLayout from "../components/PageLayout";

const API_BASE_URL = 'http://localhost:3001/api';

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    dateOfBirth: "",
    occupation: "",
    bio: ""
  });

  const [initialData, setInitialData] = useState(profileData);
  const [initialProfilePicture, setInitialProfilePicture] = useState<string | null>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Profile picture must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePicture(base64String);
        setProfilePicPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePic = () => {
    setProfilePicture(null);
    setProfilePicPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 1;

      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();

      const mappedData = {
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        country: data.country || "",
        postalCode: data.postal_code || "",
        dateOfBirth: data.date_of_birth ? data.date_of_birth.split('T')[0] : "",
        occupation: data.occupation || "",
        bio: data.bio || ""
      };

      setProfileData(mappedData);
      setInitialData(mappedData);
      setProfilePicture(data.profile_picture || null);
      setProfilePicPreview(data.profile_picture || null);
      setInitialProfilePicture(data.profile_picture || null);
      
      // Update localStorage with profile picture for navbar
      const updatedUser = { ...user, profile_picture: data.profile_picture };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 1;

      const body = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        country: profileData.country,
        postal_code: profileData.postalCode,
        date_of_birth: profileData.dateOfBirth,
        occupation: profileData.occupation,
        bio: profileData.bio,
        profile_picture: profilePicture
      };

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedData = await response.json();
      const mappedData = {
        firstName: updatedData.user.first_name || "",
        lastName: updatedData.user.last_name || "",
        email: updatedData.user.email || "",
        phone: updatedData.user.phone || "",
        address: updatedData.user.address || "",
        city: updatedData.user.city || "",
        country: updatedData.user.country || "",
        postalCode: updatedData.user.postal_code || "",
        dateOfBirth: updatedData.user.date_of_birth ? updatedData.user.date_of_birth.split('T')[0] : "",
        occupation: updatedData.user.occupation || "",
        bio: updatedData.user.bio || ""
      };

      setProfileData(mappedData);
      setInitialData(mappedData);
      setInitialProfilePicture(updatedData.user.profile_picture || null);
      
      // Update localStorage with new profile picture for navbar
      const updatedUser = { ...user, profile_picture: updatedData.user.profile_picture, first_name: profileData.firstName, last_name: profileData.lastName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Dispatch custom event to notify Navbar of profile update
      window.dispatchEvent(new Event('profileUpdated'));
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error('Error updating profile:', err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(initialData);
    setProfilePicture(initialProfilePicture);
    setProfilePicPreview(initialProfilePicture);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      title="Profile"
      subtitle="Manage your account information and personal details"
      headerActions={!isEditing && !loading ? (
        <button
          onClick={() => setIsEditing(true)}
          className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-105 flex items-center gap-3 border-2 border-blue-400"
        >
          <FaEdit className="text-lg" />
          Edit Profile
        </button>
      ) : undefined}
    >
      {loading && !profileData.email ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-bold text-lg mb-2">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/90 via-blue-50/40 to-purple-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>

              <div className="flex flex-col items-center relative z-10">
                <div className="relative">
                  {profilePicPreview ? (
                    <img 
                      src={profilePicPreview} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 flex gap-1">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 shadow-lg transition-colors"
                      >
                        <FaCamera size={16} />
                      </button>
                      {profilePicPreview && (
                        <button 
                          onClick={removeProfilePic}
                          className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 shadow-lg transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-2xl font-bold mt-4 text-gray-800">{profileData.firstName} {profileData.lastName}</h2>
                <p className="text-gray-600 mt-1">{profileData.occupation}</p>

                <div className="w-full mt-6 pt-6 border-t border-gray-200/50 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 shadow-md">
                      <FaEnvelope className="text-blue-600" />
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                    <FaShieldAlt className="text-white" size={14} />
                  </div>
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Account Type</span>
                    <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-xl font-bold shadow-lg shadow-blue-500/30">Premium</span>
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
            <div className="bg-gradient-to-br from-white/90 via-blue-50/40 to-purple-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 relative overflow-hidden h-full">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl -z-10"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
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
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3 border-2 border-blue-400"
                      >
                        <FaSave size={16} />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6 flex-1">
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="pt-6 border-t border-gray-200/50">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div className="pt-6 border-t border-gray-200/50">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all shadow-sm hover:shadow-md font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="pt-6 border-t border-gray-200/50">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                      About
                    </h3>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none transition-all shadow-sm hover:shadow-md font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default Profile;