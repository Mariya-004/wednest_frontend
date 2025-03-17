import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VendorDetails = () => {
  const { vendor_id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartMessage, setCartMessage] = useState(null);

  useEffect(() => {
    const couple_id = localStorage.getItem("user_id");

    const fetchData = async () => {
      try {
        const vendorRes = await fetch(`${API_URL}/api/vendor/details/${vendor_id}`);
        if (!vendorRes.ok) throw new Error(`HTTP error! Status: ${vendorRes.status}`);
        const vendorData = await vendorRes.json();
        if (vendorData.status !== "success") throw new Error("Failed to load vendor details.");
        setVendor(vendorData.data);

        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);

        if (couple_id) {
          const requestRes = await fetch(`${API_URL}/api/couple/requests/${couple_id}`);
          if (!requestRes.ok) throw new Error(`HTTP error! Status: ${requestRes.status}`);
          const requestData = await requestRes.json();
          if (requestData.status === "success") {
            const hasRequested = requestData.data.some((req) => req.vendor_id._id === vendor_id);
            setIsRequested(hasRequested);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendor_id, API_URL]);

  const handleRequest = async () => {
    setRequestStatus(null);
    const couple_id = localStorage.getItem("user_id");

    if (!couple_id) {
      setRequestStatus({ type: "error", message: "You must be logged in as a couple to request." });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ couple_id, vendor_id }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setRequestStatus({ type: "success", message: "Request sent successfully!" });
        setIsRequested(true);
      } else {
        throw new Error(data.message || "Failed to send request.");
      }
    } catch (err) {
      setRequestStatus({ type: "error", message: err.message });
    }
  };

  const handleAddToCart = () => {
    if (!vendor) return;

    const newCart = [...cart, vendor];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartMessage(`${vendor.businessName} has been added to your cart!`);

    setTimeout(() => {
      setCartMessage(null);
    }, 3000);
  };

  if (loading) return <p className="text-center text-gray-500 pt-28">Loading vendor details...</p>;
  if (error) return <p className="text-center text-red-500 pt-28">{error}</p>;

  return (
    <div className="relative">
      {/* Header */}
      <header className="bg-orange-300 h-24 p-6 flex justify-between items-center fixed w-full top-0 left-0 z-10 shadow-lg">
        <img src="/WEDNEST_LOGO.png" alt="WedNest Logo" className="h-20 w-auto" />
        <div className="flex gap-10 text-2xl">
          <button onClick={() => navigate("/couple-home")} className="text-lg">
            <img src="/Home.png" alt="home" className="h-5 w-auto" />
          </button>
          <button onClick={() => navigate("/cart")} className="text-3xl">🛒</button>
          <button onClick={() => navigate("/couple-dashboard")} className="text-3xl">👤</button>
        </div>
      </header>

      {/* Vendor Details */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8 pt-36">
        <div className="max-w-5xl w-full bg-white p-10 rounded-lg shadow-lg">
          {vendor && (
            <>
              <h1 className="text-4xl font-extrabold text-center text-gray-800">{vendor.businessName}</h1>

              <div className="flex flex-col md:flex-row items-center md:items-start mt-8">
                <img
                  src={vendor.profile_image || "/placeholder.jpg"}
                  alt={vendor.businessName}
                  className="w-60 h-60 object-cover rounded-lg shadow-md"
                />

                <div className="md:ml-10 mt-4 md:mt-0 text-center md:text-left flex-1">
                  <p className="text-lg text-gray-600">
                    <strong>Type:</strong> {vendor.vendorType}
                  </p>
                  <p className="text-lg text-gray-600">
                    <strong>Location:</strong> {vendor.location}
                  </p>
                  <p className="text-lg text-green-600 font-bold">
                    <strong>Pricing:</strong> ${vendor.pricing}
                  </p>
                  <p className="text-gray-700 mt-4">{vendor.serviceDescription}</p>

                  <div className="mt-6">
                    <h2 className="text-xl font-semibold">Contact Information</h2>
                    <p className="text-gray-600">
                      <strong>Email:</strong> {vendor.email}
                    </p>
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {vendor.contactNumber}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex flex-col gap-4">
                    <button
                      className={`px-6 py-3 rounded-lg shadow-md text-lg font-semibold transition ${
                        isRequested ? "bg-yellow-500 text-black" : "bg-pink-500 text-white hover:bg-pink-600"
                      }`}
                      onClick={handleRequest}
                      disabled={isRequested}
                    >
                      {isRequested ? "Requested" : "Request to Avail"}
                    </button>

                    <button
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md text-lg font-semibold hover:bg-blue-600 transition"
                      onClick={handleAddToCart}
                    >
                      Add to Cart 🛒
                    </button>
                  </div>

                  {requestStatus && (
                    <p
                      className={`mt-4 text-center text-lg font-semibold ${
                        requestStatus.type === "success" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {requestStatus.message}
                    </p>
                  )}

                  {cartMessage && (
                    <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-md text-center font-semibold">
                      {cartMessage}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
