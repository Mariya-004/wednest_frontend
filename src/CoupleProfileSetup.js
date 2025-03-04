import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:3000").replace(/\/$/, "");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    weddingDate: "",
    budgetRange: "",
    user_id: "", // Dynamically set this from localStorage/session
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Load user_id dynamically (assuming stored in localStorage)
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id"); // Adjust as needed
    if (storedUserId) {
      setFormData((prev) => ({ ...prev, user_id: storedUserId }));
    }
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.user_id) {
      setMessage("❌ User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", formData.user_id);
    formDataToSend.append("username", formData.name);
    formDataToSend.append("contactNumber", formData.contactNumber);
    formDataToSend.append("weddingDate", formData.weddingDate);
    formDataToSend.append("budgetRange", formData.budgetRange);

    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    try {
      const response = await fetch(`${API_URL}/api/couple/profile`, {
        method: "PUT",
        body: formDataToSend, // Don't manually set headers for multipart form-data
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => navigate("/couple-dashboard"), 1000);
      } else {
        setMessage(data.message || "❌ Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setMessage("⚠️ Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 to-purple-200 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
        <h2 className="text-center text-4xl font-bold text-white mb-6 bg-gradient-to-r from-red-400 to-orange-300 py-4 rounded-lg shadow-md">
          🎨 Set Your Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-8">
            {/* Left Section - Inputs */}
            <div className="w-1/2 flex flex-col space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm focus:ring-2 focus:ring-red-400"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm opacity-50 cursor-not-allowed"
              />
              <input
                type="tel"
                name="contactNumber"
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm focus:ring-2 focus:ring-red-400"
                required
              />
              <input
                type="date"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm focus:ring-2 focus:ring-red-400"
              />
              <input
                type="text"
                name="budgetRange"
                placeholder="Budget Range"
                value={formData.budgetRange}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* Right Section - Image Upload */}
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-red-300 shadow-md">
                {previewImage ? (
                  <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">📷 No Image</span>
                )}
              </div>
              <label className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer text-sm shadow-lg hover:bg-red-600 transition-all">
                Upload Your Picture
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-gradient-to-r from-orange-400 to-red-500 text-white py-3 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all"
            >
              {loading ? "🚀 Saving..." : "💾 Save Profile"}
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mt-4 text-center font-semibold ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}