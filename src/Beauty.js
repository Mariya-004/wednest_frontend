import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Beauty = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000"; 
  useEffect(() => {
    fetch(`${API_URL}/api/vendors/type/Beauty`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") setVendors(data.data);
        else console.error("Error fetching vendors:", data.message);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 p-6"
      style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="max-w-6xl w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Beauty Vendors</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.length > 0 ? vendors.map((vendor) => (
            <div key={vendor._id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer bg-white"
              onClick={() => navigate(`/vendor/${vendor._id}`)}>
              <img src={vendor.service_images?.[0] || "/placeholder.jpg"} alt={vendor.businessName}
                className="w-full h-40 object-cover rounded-md mb-2"/>
              <h2 className="text-xl font-semibold">{vendor.businessName}</h2>
              <p className="text-gray-600">{vendor.location}</p>
              <p className="text-green-600 font-bold">${vendor.pricing}</p>
            </div>
          )) : (
            <p className="text-center text-gray-500 col-span-full">No vendors found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Beauty;