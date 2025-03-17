import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const budget = 530000; // Example budget

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleRemove = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="min-h-screen bg-pink-100 p-6" style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover" }}>
      {/* Header */}
      <header className="bg-orange-300 h-20 p-4 flex justify-between items-center fixed w-full top-0 left-0 z-10 shadow-md">
        <img src="/WEDNEST_LOGO.png" alt="WedNest Logo" className="h-16 w-auto" />
        <div className="flex gap-8 text-lg">
          <button onClick={() => navigate("/couple-home")} className="text-lg">Home</button>
          <button onClick={() => navigate("/settings")} className="text-lg">Settings</button>
          <button className="text-lg">🛒</button>
          <button onClick={() => navigate("/couple-dashboard")} className="text-lg">👤</button>
        </div>
      </header>

      {/* Budget Display */}
      <div className="pt-24 flex justify-end pr-10">
        <span className="bg-purple-500 text-white px-4 py-2 rounded-md text-lg font-bold">Budget: {budget.toLocaleString()} Rs</span>
      </div>

      {/* Cart Items */}
      <div className="max-w-5xl mx-auto mt-6">
        <h1 className="text-3xl font-bold text-center mb-6">Wedding Cart</h1>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="bg-white shadow-md p-4 rounded-lg flex items-center gap-4 mb-4">
              <img src={item.image || "/placeholder.jpg"} alt={item.businessName} className="w-32 h-32 object-cover rounded-lg" />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{item.businessName}</h2>
                <p>City: {item.location}</p>
                <p>Price: ${item.pricing}</p>
                <p>{item.details}</p>
              </div>
              <div>
                <span
                  className={`px-4 py-2 rounded-md text-white font-bold ${
                    item.status === "Confirmed" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {item.status === "Confirmed" ? "Confirmed by Vendor" : "Waiting for Confirmation"}
                </span>
                <button
                  onClick={() => handleRemove(index)}
                  className="mt-2 block w-full bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
                >
                  {item.status === "Confirmed" ? "Remove" : "Remove Request"}
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
