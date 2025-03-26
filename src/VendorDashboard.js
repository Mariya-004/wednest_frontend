import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user_id = localStorage.getItem("user_id");
  const email = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/vendor/dashboard/${user_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await response.json();

        if (response.ok && data.status === "success") {
          setUserData(data.data);
        } else {
          console.error("Failed to fetch vendor data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    const fetchUpcomingBookings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/vendor/requests/${user_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await response.json();

        if (response.ok && data.status === "success") {
          const bookings = data.data.map((booking) => {
            if (booking.couple_id) {
              return `${booking.couple_id.username} - ${booking.couple_id.email} - ${new Date(
                booking.couple_id.wedding_date
              ).toLocaleDateString()}`;
            }
            return "Invalid booking data";
          });

          setUserData((prevData) => ({
            ...prevData,
            upcoming_bookings: bookings,
          }));
        } else {
          console.error("Failed to fetch upcoming bookings:", data.message);
        }
      } catch (error) {
        console.error("Error fetching upcoming bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadData = async () => {
      await fetchUserData();
      await fetchUpcomingBookings();
    };

    loadData();
  }, [user_id, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNavigateToRequests = () => {
    navigate("/vendor-requests");
  };

  if (loading || !userData) {
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
        <img
          src="/WEDNEST_LOGO.png"
          alt="WedNest Logo"
          className="h-20 w-auto"
        />
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
        <div className="flex flex-col w-3/4 p-6 bg-gradient-to-b from-white to-blue-50 min-h-screen">
          <div className="grid grid-cols-2 gap-8">
            <div
              className="p-6 rounded-3xl text-black shadow-xl transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #ffffff, #ffe8d9)",
              }}
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Coming Up</h2>
              {userData?.upcoming_bookings?.length > 0 ? (
                <div className="grid gap-4">
                  {userData.upcoming_bookings.map((booking, index) => {
                    const [name, email, date] = booking.split(" - ");
                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl shadow p-4 hover:bg-orange-50 transition"
                      >
                        <p className="text-lg font-semibold text-gray-700">
                          {name}
                        </p>
                        <p className="text-sm text-gray-500">{email}</p>
                        <p className="text-sm text-gray-600 font-medium">
                          Wedding: {date}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500">No upcoming bookings</p>
              )}
            </div>

            <button
              onClick={handleNavigateToRequests}
              className="p-6 rounded-3xl text-black shadow-xl flex flex-col items-center justify-center transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #fdf0f4, #faf1ff)",
                height: "250px",
              }}
            >
              <h2 className="text-2xl font-bold mb-3">Bookings & Requests</h2>
              <p className="text-center text-md">
                Manage all your service requests easily
              </p>
            </button>
          </div>

          <div className="flex flex-col gap-8 mt-10">
            <div className="p-6 text-center border-4 border-gray-200 rounded-3xl shadow-xl bg-gray-50 text-black">
              <h2 className="text-2xl font-bold mb-4">Your Service Images</h2>
              <div className="flex justify-center gap-4 flex-wrap">
                {userData?.service_images?.length > 0 ? (
                  userData.service_images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Service"
                      className="w-36 h-36 object-cover rounded-xl shadow-md transition-transform hover:scale-105"
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
