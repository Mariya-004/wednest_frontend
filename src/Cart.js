import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
  const couple_id = localStorage.getItem("user_id");
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchCartWithVendorDetails = async () => {
      try {
        const [cartRes, budgetRes] = await Promise.all([
          fetch(`${API_URL}/api/cart/${couple_id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch(`${API_URL}/api/couple/budget/${couple_id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        const cartData = await cartRes.json();
        const budgetData = await budgetRes.json();

        if (budgetData.status === "success") {
          setBudget(budgetData.data);
        }

        if (cartData.status === "success" && cartData.data.length > 0) {
          const updatedCart = await Promise.all(
            cartData.data.map(async (item) => {
              try {
                const vendorRes = await fetch(
                  `${API_URL}/api/vendor/details/${item.vendor_id._id}`,
                  {
                    headers: { Authorization: `Bearer ${authToken}` },
                  }
                );
                const vendorData = await vendorRes.json();

                if (vendorData.status === "success") {
                  const requestIdRes = await fetch(
                    `${API_URL}/api/request-id?couple_id=${couple_id}&vendor_id=${item.vendor_id._id}`,
                    {
                      headers: { Authorization: `Bearer ${authToken}` },
                    }
                  );
                  const requestIdData = await requestIdRes.json();

                  if (requestIdData.status === "success") {
                    const requestStatusRes = await fetch(
                      `${API_URL}/api/request/status/${requestIdData.request_id}`,
                      {
                        headers: { Authorization: `Bearer ${authToken}` },
                      }
                    );
                    const requestStatusData = await requestStatusRes.json();

                    return {
                      ...item,
                      vendor_id: vendorData.data,
                      status: requestStatusData.data.status || "Declined",
                    };
                  } else {
                    return {
                      ...item,
                      vendor_id: vendorData.data,
                      status: "Declined",
                    };
                  }
                }
              } catch (error) {
                console.error("Error fetching vendor details: ", error);
              }
              return item;
            })
          );

          setCartItems(updatedCart);
        }
      } catch (err) {
        console.error("Error fetching cart or budget:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartWithVendorDetails();
  }, [API_URL, couple_id, authToken]);

  const handleRemoveItem = async (vendor_id) => {
    try {
      const res = await fetch(`${API_URL}/api/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ couple_id, vendor_id }),
      });

      const data = await res.json();
      if (data.status === "success") {
        setCartItems((prev) =>
          prev.filter((item) => item.vendor_id._id !== vendor_id)
        );
        setMessage({ type: "success", text: "Item removed from cart." });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error removing item." });
    }
  };

  const totalCost = cartItems.reduce((acc, item) => acc + item.price, 0);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.jpg";
    return imgPath.startsWith("http") ? imgPath : `${API_URL}/${imgPath}`;
  };

  if (loading) {
    return <p className="text-center text-gray-500 pt-28">Loading cart...</p>;
  }

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
        className="min-h-screen bg-pink-100 pt-36 pb-10 px-4 sm:px-8"
        style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover" }}
      >
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">Your Cart 🛒</h1>

          {message && (
            <div
              className={`text-center mb-4 font-semibold ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <div className="grid gap-4">
                {cartItems.map((item) => (
                  <div
                    key={item.vendor_id._id}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => navigate(`/vendor/${item.vendor_id._id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(item.vendor_id.service_images && item.vendor_id.service_images[0])}
                        alt={item.vendor_id.businessName}
                        className="w-16 h-16 object-cover rounded-full shadow"
                      />
                      <div>
                        <p className="text-lg font-semibold">
                          {item.vendor_id.businessName}
                        </p>
                        <p className="text-gray-600">{item.vendor_id.vendorType}</p>
                        <p className="text-green-600 font-bold">${item.price}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Status: {item.status}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.vendor_id._id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                      disabled={item.status === "Confirmed by Vendor"}
                    >
                      {item.status === "Confirmed by Vendor" ? "Locked" : "Remove"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="text-xl font-bold text-center mb-4">Cart Summary</h2>
                <p className="text-lg text-center">
                  Total Cost: <span className="font-bold">${totalCost}</span>
                </p>
                <p className="text-lg text-center mt-2">
                  Your Budget: <span className="font-bold">${budget}</span>
                </p>
                {totalCost > budget && (
                  <p className="text-center text-red-600 mt-2 font-semibold">
                    Warning: You are over budget by ${totalCost - budget}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
