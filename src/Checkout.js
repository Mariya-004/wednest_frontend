import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
  const couple_id = sessionStorage.getItem("user_id");
  const authToken = sesionStorage.getItem("authToken");
  const navigate = useNavigate();

  const [lockedItems, setLockedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false); // New state

  useEffect(() => {
    const fetchLockedItems = async () => {
      try {
        const cartRes = await fetch(`${API_URL}/api/cart/${couple_id}`, {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${authToken}`,
          },
        });

        const cartData = await cartRes.json();

        if (cartData.status === "success" && cartData.data.length > 0) {
          const updatedCart = await Promise.all(
            cartData.data.map(async (item) => {
              try {
                const vendorRes = await fetch(
                  `${API_URL}/api/vendor/details/${item.vendor_id._id}`,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      // Authorization: `Bearer ${authToken}`,
                    },
                  }
                );
                const vendorData = await vendorRes.json();

                if (vendorData.status === "success") {
                  const requestIdRes = await fetch(
                    `${API_URL}/api/request-id?couple_id=${couple_id}&vendor_id=${item.vendor_id._id}`,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${authToken}`,
                      },
                    }
                  );
                  const requestIdData = await requestIdRes.json();

                  if (requestIdData.status === "success") {
                    const requestStatusRes = await fetch(
                      `${API_URL}/api/request/status/${requestIdData.request_id}`,
                      {
                        headers: {
                          "Content-Type": "application/json",
                          // Authorization: `Bearer ${authToken}`,
                        },
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

          const acceptedItems = updatedCart.filter(
            (item) =>
              item.status && item.status.trim().toLowerCase() === "accepted"
          );

          setLockedItems(acceptedItems);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLockedItems();
  }, [API_URL, couple_id, authToken]);

  const totalCost = lockedItems.reduce((acc, item) => acc + item.price, 0);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.jpg";
    return imgPath.startsWith("http") ? imgPath : `${API_URL}/${imgPath}`;
  };

  const handlePayNow = () => {
    // Simulate payment processing
    setPaymentConfirmed(true);
  };

  if (loading) {
    return <p className="text-center text-gray-500 pt-28">Loading checkout...</p>;
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
          <h1 className="text-3xl font-bold text-center mb-6">Checkout 🛒</h1>

          {lockedItems.length === 0 ? (
            <p className="text-center text-gray-600">No locked services to checkout.</p>
          ) : (
            <>
              <div className="grid gap-4">
                {lockedItems.map((item) => (
                  <div
                    key={item.vendor_id._id}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm"
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
              <h2 className="text-xl font-bold text-center mb-4">Order Summary</h2>
                <p className="text-center text-lg">Total: <span className="font-bold">${totalCost}</span></p>

                {!paymentConfirmed ? (
                  <div className="text-center mt-6">
                    <button
                      onClick={handlePayNow}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-600 transition"
                    >
                      Pay Now
                    </button>
                  </div>
                ) : (
                  <div className="text-center mt-6">
                    <h3 className="text-2xl font-bold text-green-600">Order Confirmed</h3>
                    <p className="text-lg text-gray-700 mt-2">
                      Thank you! Your special day is one step closer 💫
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;               
               

 