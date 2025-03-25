import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const authToken = localStorage.getItem("authToken");
  console.log("Auth Token:", authToken); // Log the authToken
  const vendor_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!authToken || !vendor_id) {
      navigate("/login");
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `https://wednest-backend-0ti8.onrender.com/api/vendor/requests/${vendor_id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const data = await response.json();

        if (response.ok && data.status === "success") {
          setRequests(data.data);
        } else {
          console.error("Failed to fetch requests:", data.message);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [authToken, vendor_id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading requests...
      </div>
    );
  }
  const handleAction = async (requestId, action) => {
    try {
      const response = await fetch(`https://wednest-backend-0ti8.onrender.com/api/request/${requestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action === "accept" ? "Accepted" : "Declined" }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.status === "success") {
        if (action === "accept") {
          setRequests((prev) =>
            prev.map((req) =>
              req._id === requestId ? { ...req, status: "Accepted" } : req
            )
          );
        } else {
          setRequests((prev) => prev.filter((req) => req._id !== requestId));
        }
        alert(`Request ${action}ed successfully!`);
      } else {
        console.error("Action failed:", data.message);
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };
  
  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Bookings and Requests</h1>
      {requests.length === 0 ? (
        <p className="text-center">No pending requests!</p>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between bg-gray-200 p-4 rounded-lg shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src="/profile.png"
                  alt="Couple"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">Name: {request.couple_id?.username}</p>
                  <p>Date of event: {new Date(request.event_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(request._id, "accept")}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(request._id, "decline")}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}