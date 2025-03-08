import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VendorDetails = () => {
  const { vendor_id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/vendor/details/${vendor_id}`);
        const data = await response.json();

        if (data.status === "success") {
          setVendor(data.data);
        } else {
          throw new Error(data.message || "Failed to load vendor details.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendor_id]);

  if (loading) return <p className="text-center text-gray-500">Loading vendor details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-pink-100 p-6"
      style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">{vendor.businessName}</h1>

        <div className="flex flex-col md:flex-row items-center md:items-start mt-6">
          {/* Profile Image */}
          <img
            src={vendor.profile_image || "/placeholder.jpg"}
            alt={vendor.businessName}
            className="w-56 h-56 object-cover rounded-lg shadow-md"
          />
          
          {/* Vendor Info */}
          <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left flex-1">
            <p className="text-gray-600"><strong>Type:</strong> {vendor.vendorType}</p>
            <p className="text-gray-600"><strong>Location:</strong> {vendor.location}</p>
            <p className="text-green-600 font-bold"><strong>Pricing:</strong> ${vendor.pricing}</p>
            <p className="text-gray-700 mt-2">{vendor.serviceDescription}</p>
            
            {/* Contact Info */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <p className="text-gray-600"><strong>Email:</strong> {vendor.email}</p>
              <p className="text-gray-600"><strong>Phone:</strong> {vendor.phone}</p>
            </div>

            {/* Request to Avail Button */}
            <button 
              className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition"
            >
              Request to Avail
            </button>
          </div>
        </div>

        {/* Service Images */}
        {vendor.service_images && vendor.service_images.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-center">Service Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
              {vendor.service_images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Service ${index + 1}`}
                  className="w-full h-40 object-cover rounded-md shadow"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDetails;