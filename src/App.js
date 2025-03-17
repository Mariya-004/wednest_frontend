import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeddingLandingPage from "./WeddingLandingPage";
import Login from "./Login";
import Signup from "./Signup";
import VendorDashboard from "./VendorDashboard";
import CoupleDashboard from "./CoupleDashboard"; // Import the Couple Dashboard
import CoupleProfileSetup from "./CoupleProfileSetup";
import VendorProfileSetup from "./VendorProfileSetup";
import CoupleHome from "./CoupleHome";
import Venue from "./Venue";
import Catering from "./Catering";
import Photography from "./Photography";
import Beauty from "./Beauty";
import Designer from "./Designer";
import Jewelry from "./Jewelry";
import Cars from "./Cars";
import Events from "./Events";
import VendorDetails from "./VendorDetails"; 
import Cart from "./Cart";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeddingLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/couple-dashboard" element={<CoupleDashboard/>}/>
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/couple-profile" element={<CoupleProfileSetup/>}/>
        <Route path="/vendor-profile" element={<VendorProfileSetup />} />
        <Route path="/couple-home" element={<CoupleHome />} />
        <Route path="/venue" element={<Venue />} />
        <Route path="/catering" element={<Catering />} />
        <Route path="/photography" element={<Photography/>} />
        <Route path="/beauty" element={<Beauty/>} />
        <Route path="/designer" element={<Designer />} />
        <Route path="/jewelry" element={<Jewelry/>} />
        <Route path="/car-dealers" element={<Cars/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/vendor/:vendor_id" element={<VendorDetails/>} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
