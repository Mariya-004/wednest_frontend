import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VendorDetails = () => {
  const { vendor_id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const couple_id = localStorage.getItem("user_id");

    const fetchData = async () => {
      try {
        const vendorRes = await fetch(`${API_URL}/api/vendor/details/${vendor_id}`);
        if (!vendorRes.ok) throw new Error(`HTTP error! Status: ${vendorRes.status}`);
        const vendorData = await vendorRes.json();
        if (vendorData.status !== "success") throw new Error("Failed to load vendor details.");
        setVendor(vendorData.data);

        // Load cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);

        // Check if already requested
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

  // Add to Cart Function
  const handleAddToCart = () => {
    if (!vendor) return;

    const newCart = [...cart, vendor];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert(`${vendor.businessName} added to cart!`);
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
          <button onClick={() => navigate("/cart")} className="text-3xl relative">
            🛒 
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white px-2 rounded-full text-xs">
                {cart.length}
              </span>
            )}
          </button>
          <button onClick={() => navigate("/couple-dashboard")} className="text-3xl">👤</button>
        </div>
      </header>

      {/* Vendor Details */}
      <div
        className="min-h-screen flex items-center justify-center bg-pink-100 p-8 pt-36"
        style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="max-w-5xl w-full bg-white p-10 rounded-lg shadow-md">
          {vendor && (
            <>
              <h1 className="text-3xl font-bold text-center">{vendor.businessName}</h1>

              <div className="flex flex-col md:flex-row items-center md:items-start mt-6">
                <img
                  src={vendor.profile_image || "/placeholder.jpg"}
                  alt={vendor.businessName}
                  className="w-56 h-56 object-cover rounded-lg shadow-md"
                />

                <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left flex-1">
                  <p className="text-gray-600">
                    <strong>Type:</strong> {vendor.vendorType}
                  </p>
                  <p className="text-gray-600">
                    <strong>Location:</strong> {vendor.location}
                  </p>
                  <p className="text-green-600 font-bold">
                    <strong>Pricing:</strong> ${vendor.pricing}
                  </p>
                  <p className="text-gray-700 mt-2">{vendor.serviceDescription}</p>

                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">Contact Information</h2>
                    <p className="text-gray-600">
                      <strong>Email:</strong> {vendor.email}
                    </p>
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {vendor.contactNumber}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                    onClick={handleAddToCart}
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>

              {/* Service Images Section */}
              {vendor.service_images && vendor.service_images.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-center">Service Images</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                    {vendor.service_images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Service ${index + 1}`}
                        className="w-full h-40 object-cover rounded-md shadow transition-transform hover:scale-105"
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
