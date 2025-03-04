import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VendorProfileSetup = () => {
  const navigate = useNavigate();

  const [vendorData, setVendorData] = useState({
    businessName: "",
    vendorType: "",
    contactNumber: "",
    email: "",
    location: "",
    pricing: "",
    serviceDescription: "",
    user_id: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);

  const [serviceImages, setServiceImages] = useState([]);
  const [previewServiceImages, setPreviewServiceImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Load user_id from localStorage once
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setVendorData((prev) => ({ ...prev, user_id: storedUserId }));
    }
  }, []);

  // ✅ Fetch Vendor Profile Data
  useEffect(() => {
    if (!vendorData.user_id) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/vendor/profile/${vendorData.user_id}`);
        const result = await response.json();

        if (result.status === "success") {
          setVendorData((prev) => ({
            ...prev,
            businessName: result.data.businessName || "",
            vendorType: result.data.vendorType || "",
            contactNumber: result.data.contactNumber || "",
            email: result.data.email || "",
            location: result.data.location || "",
            pricing: result.data.pricing || "",
            serviceDescription: result.data.serviceDescription || "",
          }));

          if (result.data.profile_image) {
            setPreviewProfileImage(result.data.profile_image);
          }

          if (result.data.service_images) {
            setPreviewServiceImages(result.data.service_images);
          }
        }
      } catch (error) {
        console.error("Error fetching vendor profile:", error);
      }
    };

    fetchProfile();
  }, [vendorData.user_id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  // ✅ Handle profile image selection
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewProfileImage(URL.createObjectURL(file));
    }
  };

  // ✅ Handle service images selection (multiple files)
  const handleServiceImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setServiceImages(files);
      setPreviewServiceImages(files.map((file) => URL.createObjectURL(file)));
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!vendorData.user_id) {
      setMessage("❌ User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("user_id", vendorData.user_id);
    formData.append("businessName", vendorData.businessName);
    formData.append("vendorType", vendorData.vendorType);
    formData.append("contactNumber", vendorData.contactNumber);
    formData.append("location", vendorData.location);
    formData.append("pricing", vendorData.pricing);
    formData.append("serviceDescription", vendorData.serviceDescription);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    serviceImages.forEach((image) => {
      formData.append("serviceImages", image);
    });

    try {
      const response = await fetch("http://localhost:3000/api/vendor/profile", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => navigate("/vendor-dashboard"), 1000);
      } else {
        setMessage(result.message || "❌ Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setMessage("⚠️ Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-200 to-orange-300 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
        <h2 className="text-center text-4xl font-bold text-white mb-6 bg-gradient-to-r from-yellow-500 to-orange-400 py-4 rounded-lg shadow-md">
          🏪 Vendor Profile Setup
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-8">
            {/* Left Section - Inputs */}
            <div className="w-1/2 flex flex-col space-y-4">
              <input type="text" name="businessName" placeholder="Business Name" value={vendorData.businessName} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm" required />
              {/* Vendor Type Dropdown */}
              <select name="vendorType" value={vendorData.vendorType} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm" required>
                <option value="">Select Vendor Type</option>
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Beauty and Wellness">Beauty and Wellness</option>
                <option value="Events">Events</option>
                <option value="Photography">Photography</option>
                <option value="Car Dealers">Car Dealers</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Designer">Designer</option>
              </select>
              <input type="tel" name="contactNumber" placeholder="Contact Number" value={vendorData.contactNumber} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm" required />
              <input type="text" name="location" placeholder="Business Location" value={vendorData.location} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm" required />
              <textarea name="serviceDescription" placeholder="Service Description" value={vendorData.serviceDescription} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm" />
            </div>

            {/* Right Section - Profile & Service Images */}
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-yellow-400 shadow-md">
                {previewProfileImage ? <img src={previewProfileImage} alt="Profile Preview" className="w-full h-full object-cover" /> : <span className="text-gray-500">📷 No Image</span>}
              </div>

              <label className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-600 transition">
                📸 Choose Profile Image
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
              </label>

              <label className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition">
                📂 Choose Service Images
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleServiceImagesChange} />
              </label>

              <div className="flex gap-2 mt-2 flex-wrap">
                {previewServiceImages.map((img, index) => (
                  <img key={index} src={img} alt={`Service ${index}`} className="w-16 h-16 object-cover rounded-lg border-2 border-orange-400 shadow-sm" />
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg mt-6 hover:bg-orange-600 transition">
            {loading ? "🚀 Saving..." : "💾 Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorProfileSetup;