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

    const fetchUpcomingBookings = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/vendor/requests/${user_id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const data = await response.json();

        if (response.ok && data.status === "success") {
          setUserData((prevData) => ({
            ...prevData,
            upcoming_bookings: data.data.map(
              (booking) =>
                `${booking.couple_id.username} | ${new Date(
                  booking.couple_id.wedding_date
                ).toLocaleDateString()}`
            ),
          }));
        } else {
          console.error("Failed to fetch upcoming bookings:", data.message);
        }
      } catch (error) {
        console.error("Error fetching upcoming bookings:", error);
      }
    };

    fetchUserData();
    fetchUpcomingBookings();
  }, [user_id, authToken, userRole, email, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-600">
        Loading vendor dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <header className="bg-gradient-to-r from-orange-300 to-pink-400 p-4 flex justify-between items-center shadow-md">
        <img src="/WEDNEST_LOGO.png" alt="WedNest Logo" className="h-20" />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-xl shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <div className="flex">
        <aside className="w-1/4 bg-white p-6 shadow-xl rounded-r-3xl flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-purple-300 overflow-hidden mb-4">
            <img
              src={userData?.profile_image || "/profile.png"}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-1">
            @{userData?.username}
          </h3>
          <p className="text-gray-500 text-sm">{userData?.email}</p>

          <div className="mt-6 text-center space-y-2">
            <p className="font-medium text-gray-700">Business: {userData?.business_name || "Not Set"}</p>
            <p className="font-medium text-gray-700">Vendor Type: {userData?.vendor_type || "Not Set"}</p>
          </div>

          <button
            onClick={() => navigate("/vendor-profile")}
            className="mt-6 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition shadow"
          >
            Edit Profile
          </button>
        </aside>

        <main className="w-3/4 p-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-yellow-100 to-pink-100 p-6 rounded-3xl shadow-xl flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Upcoming Bookings</h2>
              {userData?.upcoming_bookings?.length > 0 ? (
                <ul className="text-gray-600 space-y-2">
                  {userData.upcoming_bookings.map((booking, index) => (
                    <li key={index}>{booking}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No upcoming bookings</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-purple-200 p-6 rounded-3xl shadow-xl flex flex-col justify-center items-center text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Bookings & Requests</h2>
              <p className="text-gray-500">Manage all your service requests efficiently.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-10">
            <div className="bg-white p-6 rounded-3xl shadow-xl text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Ratings</h2>
              <div className="flex justify-center text-yellow-400 text-4xl">
                {"⭐".repeat(userData?.ratings || 0)}
                {"☆".repeat(5 - (userData?.ratings || 0))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl shadow-xl text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Service Images</h2>
              <div className="flex justify-center gap-3 flex-wrap">
                {userData?.service_images?.length > 0 ? (
                  userData.service_images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="service"
                      className="w-28 h-28 object-cover rounded-xl shadow"
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No images uploaded</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
