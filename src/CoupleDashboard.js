import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CoupleDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [vendorRequests, setVendorRequests] = useState([]);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/couple-profile");
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-blue-50 overflow-hidden">
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <header className="bg-rose-200 p-4 flex justify-between items-center fixed w-full top-0 left-0 z-10 shadow-lg">
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
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backgroundBlendMode: "overlay",
          }}
        >
          <h2 className="text-lg font-semibold text-gray-800">Welcome</h2>
          <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
            {dashboardData?.profile_image ? (
              <img
                src={
                  dashboardData.profile_image.startsWith("http")
                    ? dashboardData.profile_image.replace(/^http:/, "https:")
                    : `${API_URL}${dashboardData.profile_image}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                No Image
              </div>
            )}
          </div>
          <p className="font-semibold text-gray-800 text-center">@{dashboardData?.username || "Username"}</p>
          <p className="text-gray-800 text-center">{dashboardData?.email || "user@example.com"}</p>
          <button onClick={handleEditProfile} className="bg-rose-400 text-white px-6 py-2 rounded shadow">
            Edit Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="pl-[22%] pt-[120px] pr-6">
          <div className="grid grid-cols-3 gap-6 p-6">
            {/* Budget and Welcome Back Section */}
            <div className="col-span-2 grid grid-cols-2 gap-6">
              {/* Budget Card */}
              <div
                className="p-6 rounded-2xl text-gray-900 shadow-lg flex flex-col items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #fff1e6, #f8d7da)",
                  height: "300px",
                  width: "100%",
                }}
              >
                <h2 className="text-2xl font-bold mb-4">Budget</h2>
                {dashboardData?.budget != null ? (
                  <p className="text-xl">Budget Set: ${dashboardData.budget}</p>
                ) : (
                  <p className="text-xl">Loading...</p>
                )}
              </div>

              {/* Welcome Back Card */}
              <div
                className="p-6 rounded-2xl text-center text-gray-900 shadow-lg flex flex-col items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #fefefe, #f7e7ce)",
                  height: "300px",
                  width: "100%",
                }}
              >
                <h2 className="text-2xl font-bold mb-4">
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

            {/* Vendors Booked Section */}
            <div
              className="p-6 rounded-2xl text-gray-900 shadow-lg flex flex-col items-center"
              style={{
                background: "linear-gradient(135deg, #fdeff9, #fbd5d3)",
                height: "500px",
                width: "100%",
                overflowY: "auto",
              }}
            >
              <h2 className="text-2xl font-bold mb-4">Vendors Booked</h2>
              {vendorRequests.length > 0 ? (
                <ul className="text-center w-full">
                  {vendorRequests.map((request, index) => (
                    <li key={index} className="text-lg py-2 border-b border-gray-300">
                      <strong>{request.vendor_id.businessName}</strong> <br />
                      Service: {request.vendor_id.vendorType} <br />
                      Status: <span className="text-rose-600">{request.status}</span>
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
              className="bg-rose-500 text-white px-6 py-2 rounded shadow-lg"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
