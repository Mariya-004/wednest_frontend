import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CoupleDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [vendorRequests, setVendorRequests] = useState([]);
  const [countdown, setCountdown] = useState(""); // Add state for countdown
  const user_id = localStorage.getItem("user_id");
  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:3000").replace(/\/$/, "");

  // Fetch couple dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/couple/dashboard/${user_id}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching dashboard: ${errorText}`);
        }
        const data = await response.json();
        if (data.status === "success") {
          setDashboardData(data.data);
        } else {
          console.error("Error fetching dashboard:", data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    if (user_id) fetchDashboardData();
  }, [user_id]);

  // Fetch vendor requests and booking status
  useEffect(() => {
    const fetchVendorRequests = async () => {
      try {
        const response = await fetch(`${API_URL}/api/couple/requests/${user_id}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching vendor requests: ${errorText}`);
        }
        const data = await response.json();
        if (data.status === "success") {
          setVendorRequests(data.data);
        } else {
          console.error("Error fetching vendor requests:", data.message);
        }
      } catch (error) {
        console.error("API Error (Requests):", error);
      }
    };

    if (user_id) fetchVendorRequests();
  }, [user_id]);

  useEffect(() => {
    if (dashboardData?.wedding_date) {
      const interval = setInterval(() => {
        const now = new Date();
        const wedding = new Date(dashboardData.wedding_date);
        const timeDifference = wedding - now;

        if (timeDifference <= 0) {
          setCountdown("The wedding day is here!");
          clearInterval(interval);
        } else {
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dashboardData?.wedding_date]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/couple-profile");
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-blue-100 overflow-hidden">
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <header className="bg-orange-300 p-4 flex justify-between items-center fixed w-full top-0 left-0 z-10 shadow-lg">
          <img src="WEDNEST_LOGO.png" alt="WedNest Logo" className="h-24 w-auto" />
          <div className="flex gap-6">
            <button onClick={() => navigate("/couple-home")} className="text-lg">
              <img src="/Home.png" alt="Home" className="h-5 w-auto" />
            </button>
            <button onClick={() => navigate("/Cart")} className="text-3xl">🛒</button>
            <button onClick={() => navigate("/couple-dashboard")} className="text-3xl">👤</button>
          </div>
        </header>

        {/* Sidebar */}
        <div
          className="fixed left-0 top-[100px] w-1/5 h-[calc(100vh-100px)] flex flex-col items-center justify-center space-y-6 px-4 shadow-lg"
          style={{
            backgroundImage: "url('/sidebar.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backgroundBlendMode: "overlay",
          }}
        >
          <h2 className="text-lg font-semibold text-black">Welcome</h2>
          <div className="w-32 h-32 bg-gray-400 rounded-full">
            {dashboardData?.profile_image ? (
              <img
                src={
                  dashboardData.profile_image.startsWith("http")
                    ? dashboardData.profile_image.replace(/^http:/, "https:")
                    : `${API_URL}${dashboardData.profile_image}`
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full">
                No Image
              </div>
            )}
          </div>
          <p className="font-semibold text-black text-center">@{dashboardData?.username || "Username"}</p>
          <p className="text-black text-center">{dashboardData?.email || "user@example.com"}</p>
          <button onClick={handleEditProfile} className="bg-blue-500 text-white px-6 py-2 rounded">
            Edit Profile
          </button>

          {/* Wedding Countdown */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black">Wedding Countdown</h2>
            <p className="text-lg text-black mt-2">{countdown}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="pl-[22%] pt-[120px] pr-6">
          <div className="grid grid-cols-3 gap-6 p-6">
            {/* Budget and Welcome Back Section */}
            <div className="col-span-2 grid grid-cols-2 gap-6">
              {/* Budget Card */}
              <div
                className="p-6 rounded-lg text-black bg-cover bg-center flex flex-col items-center justify-center shadow-md"
                style={{
                  backgroundImage: "url('/bgcouple.jpg')",
                  height: "300px",
                  width: "100%",
                }}
              >
                <h2 className="text-xl font-semibold">Budget</h2>
                {dashboardData?.budget != null ? (
                  <p className="text-lg">Budget Set: ${dashboardData.budget}</p>
                ) : (
                  <p className="text-lg">Loading...</p>
                )}
              </div>

              {/* Welcome Back Card */}
              <div
                className="p-6 rounded-lg text-center text-black bg-cover bg-center flex flex-col items-center justify-center shadow-md"
                style={{
                  backgroundImage: "url('/bgcouple.jpg')",
                  height: "300px",
                  width: "100%",
                }}
              >
                <h2 className="text-xl font-semibold">
                  Welcome Back, {dashboardData?.username || "User"}!
                </h2>
                <p className="text-lg">
                  Your big day on:{" "}
                  {dashboardData?.wedding_date
                    ? new Date(dashboardData.wedding_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not Set"}
                </p>
              </div>
            </div>

            {/* Vendors Booked Section with status */}
            <div
              className="p-6 rounded-lg text-black bg-cover bg-center flex flex-col items-center justify-center shadow-md"
              style={{
                backgroundImage: "url('/bgcouple.jpg')",
                height: "300px",
                width: "100%",
                overflowY: "auto",
              }}
            >
              <h2 className="text-xl text-center font-semibold">Vendors Booked</h2>
              {vendorRequests.length > 0 ? (
                <ul className="text-center w-full">
                  {vendorRequests.map((request, index) => (
                    <li key={index} className="text-lg py-1 border-b border-gray-300">
                      <strong>{request.vendor_id.businessName}</strong> <br />
                      Service: {request.vendor_id.vendorType} <br />
                      Status: <span className="text-blue-700">{request.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg text-center">No vendors booked yet</p>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded shadow-md"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
