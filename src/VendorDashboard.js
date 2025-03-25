import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const user_id = localStorage.getItem("user_id");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/vendor/dashboard/${user_id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const data = await response.json();

        if (response.ok && data.status === "success") {
          setUserData(data.data);
        } else {
          console.error("Failed to fetch vendor data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user_id, authToken, userRole, email, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-orange-300 p-4 flex justify-between items-center shadow-md">
        <img src="/WEDNEST_LOGO.png" alt="WedNest Logo" className="h-20 w-auto" />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div
          className="p-6 w-1/4 text-center bg-cover bg-center shadow-lg flex flex-col justify-between min-h-screen"
          style={{ backgroundImage: "url('/bgdash.jpeg')" }}
        >
          <div className="w-32 h-32 mb-4 rounded-full mx-auto overflow-hidden">
            <img
              src={userData?.profile_image || "/profile.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="font-semibold text-lg text-black">
            @{userData?.username || "Loading..."}
          </p>
          <p className="text-black">{userData?.email || "No email found"}</p>
          <p className="text-lg font-semibold mt-4 text-black">Business Name</p>
          <p className="text-black">{userData?.business_name || "Not Set"}</p>
          <p className="text-lg font-semibold mt-4 text-black">Vendor Type</p>
          <p className="text-black">{userData?.vendor_type || "Not Set"}</p>

          <button
            onClick={() => navigate("/vendor-profile")}
            className="mt-6 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-3/4 p-6 bg-blue-50 min-h-screen">
          {/* Dashboard Tiles */}
          <div className="grid grid-cols-3 gap-6">
          

            <div
              className="p-6 rounded-2xl text-black shadow-lg flex flex-col items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #fefefe, #f8e1c7)",
                height: "250px",
              }}
            >
              <h2 className="text-xl font-bold">Coming Up</h2>
              <ul className="mt-2 text-lg text-center">
                {userData?.upcoming_bookings?.length > 0 ? (
                  userData.upcoming_bookings.map((booking, index) => (
                    <li key={index} className="mt-1">
                      {booking}
                    </li>
                  ))
                ) : (
                  <p>No upcoming bookings</p>
                )}
              </ul>
            </div>

            <div
              className="p-6 rounded-2xl text-black shadow-lg flex flex-col justify-center items-center"
              style={{
                background: "linear-gradient(135deg, #fce4ec, #fdeff9)",
                height: "250px",
              }}
            >
              <h2 className="text-xl font-bold">Bookings & Requests</h2>
              <p className="mt-2 text-center">Manage all your service requests</p>
            </div>
          </div>

          {/* Ratings & Service Images */}
          <div className="flex flex-col gap-6 mt-6 w-full">
            <div className="p-6 text-center border-4 border-gray-300 rounded-2xl shadow-lg bg-white text-black">
              <h2 className="text-xl font-bold">Ratings</h2>
              <div className="flex justify-center space-x-2 text-yellow-400 text-3xl mt-2">
                {"⭐".repeat(userData?.ratings || 0)}
                {"☆".repeat(5 - (userData?.ratings || 0))}
              </div>
            </div>

            <div className="p-6 text-center border-4 border-gray-300 rounded-2xl shadow-lg bg-gray-100 text-black">
              <h2 className="text-xl font-bold">Your Service Images</h2>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {userData?.service_images?.length > 0 ? (
                  userData.service_images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Service"
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                  ))
                ) : (
                  <p>No service images uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
