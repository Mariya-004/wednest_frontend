import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const vendor_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `https://wednest-backend-0ti8.onrender.com/api/vendor/requests/${vendor_id}`
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
  }, [vendor_id]);

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
          setRequests((prev) =>
            prev.map((req) =>
              req._id === requestId ? { ...req, status: "Declined" } : req
            )
          );
        }
        setMessage(`Request ${action}ed successfully!`);
      } else {
        console.error("Action failed:", data.message);
        setMessage(`Failed to ${action} request: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating request:", error);
      setMessage(`Error updating request: ${error.message}`);
    }
  };
  
  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Bookings and Requests</h1>
      {message && <p className="text-center text-red-500">{message}</p>}
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
                  <p>Date of event: {new Date(request.couple_id?.wedding_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {request.status === "Accepted" ? (
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                    disabled
                  >
                    Accepted
                  </button>
                ) : request.status === "Declined" ? (
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    disabled
                  >
                    Declined
                  </button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}