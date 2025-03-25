import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VendorDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!authToken || !email || userRole !== "Vendor") {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://wednest-backend-0ti8.onrender.com/api/vendor/dashboard/${user_id}`,
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
      <header className="bg-gradient-to-r from-orange-400 to-yellow-300 p-4 flex justify-between items-center shadow-md">
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
          className="p-6 w-1/4 text-center bg-cover bg-center shadow-xl flex flex-col justify-between min-h-screen"
          style={{ backgroundImage: "url('/bgdash.jpeg')" }}
        >
          <div className="w-32 h-32 mb-4 rounded-full mx-auto overflow-hidden border-4 border-white shadow-md">
            <img
              src={userData?.profile_image || "/profile.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="font-semibold text-lg text-black">@{userData?.username || "Loading..."}</p>
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
        <div
          className="flex flex-col w-3/4 p-6 relative"
          style={{
            backgroundImage: "url('/vendorbg.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="grid grid-cols-3 gap-6">
            <div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl text-black bg-cover bg-center shadow-lg h-[250px]"
              style={{ backgroundImage: "url('/bgcouple.jpg')" }}
            >
              <h2 className="text-xl font-semibold">What You Earned?</h2>
              <p className="text-3xl font-bold mt-2">${userData?.earnings || 0}</p>
            </div>

            <div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl text-center text-black bg-cover bg-center shadow-lg h-[250px]"
              style={{ backgroundImage: "url('/bgcouple.jpg')" }}
            >
              <h2 className="text-xl font-semibold">Coming Up</h2>
              <ul className="mt-2 text-lg">
                {userData?.upcoming_bookings?.length > 0 ? (
                  userData.upcoming_bookings.map((booking, index) => (
                    <li key={index} className="mt-2">
                      {booking}
                    </li>
                  ))
                ) : (
                  <p>No upcoming bookings</p>
                )}
              </ul>
            </div>

            <div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl text-black bg-cover bg-center shadow-lg h-[250px] flex flex-col justify-between"
              style={{ backgroundImage: "url('/bgcouple.jpg')" }}
            >
              <div>
                <h2 className="text-xl font-semibold">Bookings & Requests</h2>
                <p className="mt-2">Manage all your service requests</p>
              </div>
              <button
                onClick={() => navigate("/vendor-requests")}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
              >
                View Now
              </button>
            </div>
          </div>

          {/* Ratings & Service Images */}
          <div className="flex flex-col gap-6 mt-6 w-full">
            <div className="p-6 text-center border-4 border-gray-300 rounded-lg shadow-xl bg-white text-black">
              <h2 className="text-xl font-semibold">Ratings</h2>
              <div className="flex justify-center space-x-2 text-yellow-400 text-3xl">
                {"⭐".repeat(userData?.ratings || 0)}
                {"☆".repeat(5 - (userData?.ratings || 0))}
              </div>
            </div>

            <div className="p-6 text-center border-4 border-gray-300 rounded-lg shadow-xl bg-gray-100 text-black">
              <h2 className="text-xl font-semibold">Your Service Images</h2>
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

          {/* Floating Bookings & Requests button */}
          <button
            
            className="fixed bottom-6 right-6 bg-orange-500 text-white px-6 py-3 rounded-full shadow-xl hover:bg-orange-600 transition text-lg"
            onClick={() => navigate("/vendor-requests")}
          >
            Bookings & Requests
          </button>
        </div>
      </div>
    </div>
  );
}
