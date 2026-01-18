// pages/Signup.tsx
import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone, FaMapMarkerAlt, FaCalendar, FaBriefcase, FaCamera, FaArrowRight } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [wantsProfilePic, setWantsProfilePic] = useState<boolean | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    occupation: "",
    city: "",
    country: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Check if user wants profile pic but hasn't uploaded one
    if (wantsProfilePic && !profilePicture) {
      setError("Please upload a profile picture or select 'No'");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        ...(profilePicture ? { profile_picture: profilePicture } : {})
      };

      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 bg-white bg-opacity-20 rounded-2xl mb-4 backdrop-blur-lg shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-500 animate-glow">
            <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-100 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl font-black animate-bounce" style={{ animationDuration: '2s' }}>
                💰
              </span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg animate-slide-in-left">Create Your Account</h1>
          <p className="text-white text-opacity-95 text-lg font-medium animate-slide-in-right">
            Join Finance Tracker and start managing your finances smartly
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-scale-in hover:shadow-purple-500/20 hover:shadow-3xl transition-all duration-500">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-bold text-gray-800 mb-2">First Name *</label>
                <div className="relative group">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-all duration-300 group-hover:scale-110" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-purple-300 hover:shadow-lg"
                  />
                </div>
              </div>
              <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-bold text-gray-800 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-purple-300 hover:shadow-lg"
                />
              </div>
            </div>

            <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-bold text-gray-800 mb-2">Email Address *</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-all duration-300 group-hover:scale-110" />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-purple-300 hover:shadow-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
              <div className="relative">
                <FaCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
              <div className="relative">
                <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="occupation"
                  placeholder="Software Engineer"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    placeholder="Colombo"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Sri Lanka"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Profile Picture Section */}
            <div className="border-t-2 border-gray-200 pt-5 mt-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                📸 Do you want to add a profile picture?
              </label>
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setWantsProfilePic(true);
                    setError("");
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-sm ${
                    wantsProfilePic === true
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105 animate-glow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:scale-105"
                  }`}
                >
                  Yes, Add Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWantsProfilePic(false);
                    setProfilePicture(null);
                    setError("");
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-sm ${
                    wantsProfilePic === false
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105 animate-glow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:scale-105"
                  }`}
                >
                  No, Skip
                </button>
              </div>

              {wantsProfilePic === true && (
                <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 animate-scale-in">
                  <div className="relative mb-3">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl animate-fade-in"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl animate-pulse">
                        {formData.firstName.charAt(0) || "?"}{formData.lastName.charAt(0) || "?"}
                      </div>
                    )}
                    <label
                      htmlFor="profile-pic-input"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-xl cursor-pointer hover:bg-purple-50 transition-all duration-300 border-4 border-white transform hover:scale-125 hover:rotate-12 animate-bounce"
                      style={{ animationDuration: '2s' }}
                    >
                      <FaCamera className="text-purple-600 text-lg" />
                      <input
                        id="profile-pic-input"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-purple-700 font-semibold text-center animate-fade-in">
                    Click the camera icon to upload
                    <br />
                    <span className="text-xs text-purple-600">(Max size: 5MB)</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500 mt-1"
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-purple-500 hover:text-purple-600 font-semibold">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-500 hover:text-purple-600 font-semibold">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed mt-6 relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? "Creating Account..." : "Create Account →"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <div className="mt-7 text-center">
            <p className="text-sm text-gray-700 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 font-bold hover:text-purple-700 hover:underline transition-all"
              >
                Sign in here →
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-opacity-95 text-sm mt-8 font-medium">
          © 2026 Finance Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Signup;
