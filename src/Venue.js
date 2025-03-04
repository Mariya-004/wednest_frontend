import React, { useEffect, useState } from "react";

const Venue = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/vendors/type/Venue")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setVendors(data.data);
        } else {
          console.error("Error fetching vendors:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Venue Vendors</h1>
      {/* Removed Search Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <div
              key={vendor._id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              {/* Display service images */}
              <img
                src={vendor.service_images[0] || "/placeholder.jpg"}
                alt={vendor.businessName}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h2 className="text-xl font-semibold">{vendor.businessName}</h2>
              <p className="text-gray-600">{vendor.location}</p>
              <p className="text-green-600 font-bold">${vendor.pricing}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No vendors found</p>
        )}
      </div>
    </div>
  );
};

export default Venue;
