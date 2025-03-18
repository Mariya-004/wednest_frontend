import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const coupleId = localStorage.getItem("couple_id");
  const [cartItems, setCartItems] = useState([]);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coupleId) {
      fetchCartAndBudget();
    }
  }, [coupleId]);

  const fetchCartAndBudget = async () => {
    setLoading(true);
    try {
      const cartRes = await fetch(`/api/cart/${coupleId}`);
      const cartData = await cartRes.json();

      console.log("Fetched cart data:", cartData);

      const budgetRes = await fetch(`/api/couple/budget/${coupleId}`);
      const budgetData = await budgetRes.json();

      if (cartData.status === "success" && Array.isArray(cartData.data)) {
        setCartItems(cartData.data);
      } else {
        setCartItems([]);
      }

      if (budgetData.status === "success") {
        setBudget(budgetData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleRemove = async (vendorId, status) => {
    if (status === "Confirmed by Vendor") {
      alert("Cannot remove item confirmed by vendor.");
      return;
    }

    if (window.confirm("Are you sure you want to remove this request?")) {
      try {
        const response = await fetch("/api/cart/remove", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ couple_id: coupleId, vendor_id: vendorId }),
        });

        const data = await response.json();
        if (data.status === "success") {
          alert("Item removed.");
          fetchCartAndBudget();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Remove error:", error);
      }
    }
  };

  const totalSpend = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const remainingBudget = budget - totalSpend;

  return (
    <div
      className="min-h-screen bg-pink-100 p-6"
      style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundAttachment: "fixed" }}
    >
      <header className="bg-white/70 backdrop-blur-lg h-20 p-4 flex justify-between items-center fixed w-full top-0 left-0 z-10 shadow-xl rounded-b-xl">
        <img src="/WEDNEST_LOGO.png" alt="WedNest Logo" className="h-16 w-auto" />
        <div className="flex gap-8 text-lg font-semibold">
          <button onClick={() => navigate("/couple-home")}>Home</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
          <button>🛒</button>
          <button onClick={() => navigate("/couple-dashboard")}>👤</button>
        </div>
      </header>

      <div className="pt-28 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-4xl font-bold text-purple-700">Your Wedding Cart</h1>
          <div className="text-right">
            <p className="bg-purple-500 text-white px-4 py-2 rounded-md text-lg font-bold">
              Budget: {budget.toLocaleString()} Rs
            </p>
            <p className="text-gray-700 mt-1">Total Spend: {totalSpend.toLocaleString()} Rs</p>
            <p
              className={`mt-1 font-semibold ${
                remainingBudget < 0 ? "text-red-500" : "text-green-600"
              }`}
            >
              Remaining: {remainingBudget.toLocaleString()} Rs
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading your cart...</p>
        ) : cartItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <img src="/empty-cart.png" alt="Empty" className="w-40 mx-auto mb-4" />
            Your cart is empty.
          </div>
        ) : (
          cartItems.map((item, index) => (
            <div
              key={index}
              className="bg-white/90 shadow-lg hover:shadow-2xl transition-all p-4 rounded-xl flex items-center gap-6 mb-6"
            >
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.vendor_id?.businessName || "Vendor"}
                className="w-32 h-32 object-cover rounded-xl border-2 border-purple-300"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-purple-800">{item.vendor_id?.businessName || "Unknown Vendor"}</h2>
                <p className="text-gray-600">Type: {item.vendor_id?.vendorType || "N/A"}</p>
                <p className="text-gray-700">City: {item.location || "N/A"}</p>
                <p className="text-gray-700 font-semibold">Price: {item.price?.toLocaleString() || 0} Rs</p>
                <p className="text-gray-500 mt-1">{item.details || "No additional details."}</p>
              </div>
              <div className="text-center">
                <span
                  className={`px-4 py-1 rounded-md text-white font-bold text-sm ${
                    item.status === "Confirmed by Vendor" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {item.status}
                </span>
                <button
                  onClick={() => handleRemove(item.vendor_id?._id, item.status)}
                  className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
                  disabled={!item.vendor_id?._id}
                >
                  {item.status === "Confirmed by Vendor" ? "Locked" : "Remove Request"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
