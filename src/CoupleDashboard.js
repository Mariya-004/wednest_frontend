import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

export default function CoupleDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [vendorRequests, setVendorRequests] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [countdown, setCountdown] = useState("");
  const user_id = localStorage.getItem("user_id");
  const couple_id = localStorage.getItem("couple_id");
  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:3000").replace(/\/$/, "");

  // Fetch dashboard data
  useEffect(() => {
    if (user_id) {
      fetch(`${API_URL}/api/couple/dashboard/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") setDashboardData(data.data);
        })
        .catch((err) => console.error(err));
    }
  }, [user_id]);

  // Fetch vendor requests
  useEffect(() => {
    if (user_id) {
      fetch(`${API_URL}/api/couple/requests/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") setVendorRequests(data.data);
        })
        .catch((err) => console.error(err));
    }
  }, [user_id]);

  // Fetch cart data
  useEffect(() => {
    if (couple_id) {
      fetch(`${API_URL}/api/cart/${couple_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") setCartData(data.data);
        })
        .catch((err) => console.error(err));
    }
  }, [couple_id]);

  // Countdown logic
  useEffect(() => {
    if (dashboardData?.wedding_date) {
      const interval = setInterval(() => {
        const now = dayjs();
        const weddingDate = dayjs(dashboardData.wedding_date);
        const diff = weddingDate.diff(now);
        const d = dayjs.duration(diff);
        setCountdown(`${d.days()}d ${d.hours()}h ${d.minutes()}m`);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [dashboardData]);

  const categorySpend = cartData
    ? cartData.items.reduce((acc, item) => {
        const category = item.vendor_id.vendorType;
        acc[category] = (acc[category] || 0) + item.price;
        return acc;
      }, {})
    : {};

  const pieData = Object.keys(categorySpend).map((key) => ({
    name: key,
    value: categorySpend[key],
  }));

  const totalSpent = cartData ? cartData.items.reduce((acc, item) => acc + item.price, 0) : 0;
  const remainingBudget = dashboardData?.budget ? dashboardData.budget - totalSpent : 0;

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
        <header className="bg-orange-300 p-4 flex justify-between items-center fixed w-full top-0 left-0 z-10 shadow-lg">
          <img src="WEDNEST_LOGO.png" alt="WedNest Logo" className="h-24 w-auto" />
          <div className="flex gap-6">
            <button onClick={() => navigate("/couple-home")}><img src="/Home.png" alt="Home" className="h-5" /></button>
            <button onClick={() => navigate("/Cart")} className="text-3xl">🛒</button>
            <button onClick={() => navigate("/couple-dashboard")} className="text-3xl">👤</button>
          </div>
        </header>

        {/* Sidebar */}
        <div className="fixed left-0 top-[100px] w-1/5 h-[calc(100vh-100px)] flex flex-col items-center justify-center space-y-6 px-4 shadow-lg"
          style={{
            backgroundImage: "url('/sidebar.jpeg')",
            backgroundSize: "cover",
            backgroundBlendMode: "overlay",
          }}>
          <h2 className="text-lg font-semibold text-gray-800">Welcome</h2>
          <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
            {dashboardData?.profile_image ? (
              <img
                src={dashboardData.profile_image.startsWith("http")
                  ? dashboardData.profile_image.replace(/^http:/, "https:")
                  : `${API_URL}${dashboardData.profile_image}`}
                alt="Profile" className="w-full h-full object-cover" />
            ) : <div className="w-full h-full flex items-center justify-center">No Image</div>}
          </div>
          <p className="font-semibold text-gray-800 text-center">@{dashboardData?.username}</p>
          <p className="text-gray-800 text-center">{dashboardData?.email}</p>
          <button onClick={handleEditProfile} className="bg-rose-400 text-white px-6 py-2 rounded shadow">Edit Profile</button>
        </div>

        {/* Main Content */}
        <div className="pl-[22%] pt-[120px] pr-6">
          <div className="grid grid-cols-3 gap-6 p-6">
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100 h-[300px]">
                <h2 className="text-2xl font-bold mb-4">Budget</h2>
                <p className="text-xl">Set Budget: ₹{dashboardData?.budget?.toLocaleString() || "Loading..."}</p>
                <p className="text-xl text-green-600">Remaining: ₹{remainingBudget.toLocaleString()}</p>
              </div>
              <div className="p-6 rounded-2xl text-center shadow-lg flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200 h-[300px]">
                <h2 className="text-2xl font-bold mb-4">Welcome Back, {dashboardData?.username}!</h2>
                <p>Your big day on: {dashboardData?.wedding_date ? new Date(dashboardData.wedding_date).toLocaleDateString() : "Not Set"}</p>
                <p className="text-xl mt-2 text-rose-500">Countdown: {countdown || "Calculating..."}</p>
              </div>
            </div>

            {/* Vendors Booked */}
            <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-pink-50 to-pink-200 h-[500px] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Vendors Booked</h2>
              {vendorRequests.length > 0 ? (
                <ul>
                  {vendorRequests.map((request, index) => (
                    <li key={index} className="text-lg py-2 border-b border-gray-300">
                      <strong>{request.vendor_id.businessName}</strong><br />
                      Service: {request.vendor_id.vendorType}<br />
                      Status: <span className="text-rose-600">{request.status}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-center text-lg">No vendors booked yet</p>}
            </div>
          </div>

          {/* Pie Chart Section */}
          <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-purple-50 to-purple-200 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Spending Distribution</h2>
            {pieData.length > 0 ? (
              <PieChart width={400} height={400}>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : <p className="text-center">No spending data yet.</p>}
          </div>

          <div className="text-center mt-6">
            <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded shadow-lg">Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
