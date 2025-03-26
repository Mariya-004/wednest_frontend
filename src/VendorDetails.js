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
  const [isVendorAlreadyInCart, setIsVendorAlreadyInCart] = useState(false);

  useEffect(() => {
    const couple_id = localStorage.getItem("user_id");

    const fetchData = async () => {
      try {
        const vendorRes = await fetch(`${API_URL}/api/vendor/details/${vendor_id}`, {
          //headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }, // Add Authorization header
        });
        if (!vendorRes.ok) throw new Error(`HTTP error! Status: ${vendorRes.status}`);
        const vendorData = await vendorRes.json();
        if (vendorData.status !== "success") throw new Error("Failed to load vendor details.");
        setVendor(vendorData.data);

        if (couple_id) {
          // Fetch requests
          const requestRes = await fetch(`${API_URL}/api/couple/requests/${couple_id}`);
          if (requestRes.ok) {
            const requestData = await requestRes.json();
            if (requestData.status === "success") {
              const hasRequested = requestData.data.some((req) => req.vendor_id._id === vendor_id);
              setIsRequested(hasRequested);
            }
          }

          // Fetch cart and check if vendor is already in cart
          const cartRes = await fetch(`${API_URL}/api/cart/${couple_id}`);
          const cartData = await cartRes.json();
          if (cartData.status === "success") {
            setCart(cartData.data);
            const vendorInCart = cartData.data.some((item) => item.vendor_id._id === vendor_id);
            setIsVendorAlreadyInCart(vendorInCart);
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
          //Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add Authorization header
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

  const fetchRequestId = async (couple_id, vendor_id) => {
    const response = await fetch(
      `${API_URL}/api/request-id?couple_id=${couple_id}&vendor_id=${vendor_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add Authorization header
        },
      }
    );

    const data = await response.json();
    if (response.ok && data.status === "success") {
      return data.request_id;
    } else {
      throw new Error(data.message || "Request ID not found.");
    }
  };

  const handleAddToCart = async () => {
    setCartMessage(null);
    const couple_id = localStorage.getItem("user_id");

    if (!couple_id) {
      setCartMessage("You must be logged in to add items to your cart.");
      return;
    }

    if (isVendorAlreadyInCart) {
      setCartMessage("This vendor is already in your cart.");
      return;
    }

    try {
      const request_id = await fetchRequestId(couple_id, vendor._id);

      const requestBody = {
        couple_id,
        vendor_id: vendor._id,
        service_type: vendor.vendorType,
        price: vendor.pricing,
        request_id,
      };

      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add Authorization header
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.status === "success") {
        setCart([...cart, data.data]);
        setIsVendorAlreadyInCart(true);
        setCartMessage("Item added to cart successfully! 🛒");
      } else {
        throw new Error(data.message || "Failed to add item to cart.");
      }
    } catch (err) {
      setCartMessage(err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-500 pt-28">Loading vendor details...</p>;
  if (error) return <p className="text-center text-red-500 pt-28">{error}</p>;

  return (
    <div className="relative">
      <header className="bg-orange-300 h-24 p-6 flex justify-between items-center fixed w-full top-0 left-0 z-10 shadow-lg">
        <img src="/WEDNEST_LOGO.png" alt="WedNest Logo" className="h-20 w-auto" />
        <div className="flex gap-10 text-2xl">
          <button type="button" onClick={() => navigate("/couple-home")}>
            <img src="/Home.png" alt="home" className="h-5 w-auto" />
          </button>
          <button type="button" onClick={() => navigate("/Cart")} className="text-3xl">
            🛒
          </button>
          <button type="button" onClick={() => navigate("/couple-dashboard")} className="text-3xl">
            👤
          </button>
        </div>
      </header>

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

                  <button
                    type="button"
                    className={`mt-6 px-6 py-3 rounded-lg shadow-md transition ${
                      isRequested
                        ? "bg-yellow-500 text-black"
                        : "bg-pink-500 text-white hover:bg-pink-600"
                    }`}
                    onClick={handleRequest}
                    disabled={isRequested}
                  >
                    {isRequested ? "Requested" : "Request to Avail"}
                  </button>

                  {requestStatus && (
                    <p
                      className={`mt-4 text-center font-semibold ${
                        requestStatus.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {requestStatus.message}
                    </p>
                  )}

                  <button
                    type="button"
                    className={`mt-6 ml-4 px-6 py-3 ${
                      isVendorAlreadyInCart
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white rounded-lg shadow-md transition`}
                    onClick={handleAddToCart}
                    disabled={isVendorAlreadyInCart}
                  >
                    {isVendorAlreadyInCart ? "Already in Cart" : "Add to Cart 🛒"}
                  </button>

                  {cartMessage && (
                    <p className="mt-4 text-center font-semibold text-green-600">
                      {cartMessage}
                    </p>
                  )}
                </div>
              </div>

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
