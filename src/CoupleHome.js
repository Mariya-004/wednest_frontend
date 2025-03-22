import React from "react";
import { useNavigate } from "react-router-dom";

export default function CoupleHome() {
  const navigate = useNavigate();

  const services = [
    { name: "Venue", icon: "/icons/venue.png", path: "/venue" },
    { name: "Catering", icon: "/icons/catering.png", path: "/catering" },
    { name: "Photography", icon: "/icons/photography.png", path: "/photography" },
    { name: "Beauty & Wellness", icon: "/icons/beauty.png", path: "/beauty" },
    { name: "Designer", icon: "/icons/designer.png", path: "/designer" },
    { name: "Jewelry", icon: "/icons/jewellery.png", path: "/jewelry" },
    { name: "Car Dealers", icon: "/icons/car.png", path: "/car-dealers" },
    { name: "Events", icon: "/icons/event.png", path: "/events" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-pink-100 overflow-y-auto"
      style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <header className="bg-orange-300 p-4 flex justify-between items-center fixed w-full top-0 left-0 z-10 shadow-lg">
        <img src="WEDNEST_LOGO.png" alt="WedNest Logo" className="h-24 w-auto" />
        <div className="flex gap-10 text-2xl">
          <button onClick={() => navigate("/couple-home")} className="text-lg"><img src="/Home.png" alt="home" className="h-5 w-auto" /></button>
          <button onClick={() => navigate("/Cart")} className="text-3xl">🛒</button>
          <button onClick={() => navigate("/couple-dashboard")}className="text-3xl">👤</button>
        </div>
      </header>

      <div className="pt-56 px-4 md:px-6 text-center w-full">
        <h2 className="text-5xl font-extrabold mb-16 text-gray-800 font-serif tracking-wide">SERVICES</h2>
        <div className="max-w-screen-lg mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-20 pb-20">
          {services.map((service) => (
            <button 
              key={service.name} 
              className="flex flex-col items-center transform transition duration-300 hover:scale-110"
              onClick={() => navigate(service.path)}
            >
              <img
                src={service.icon}
                alt={service.name}
                className="w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-56 lg:h-56 object-contain shadow-2xl rounded-full"
              />
              <p className="text-xl font-semibold mt-6 text-gray-900">{service.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
