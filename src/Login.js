import React, { useState } from "react"; // Fixed import statement
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("Couple");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:3000").replace(/\/$/, "");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
  
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setMessageType("error");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
  
      const data = await response.json();
      setLoading(false);
  
      if (response.ok && data.status === "success") {
        setMessage("Login successful! Redirecting...");
        setMessageType("success");
  
        // ✅ Store user details in localStorage
        localStorage.setItem("userEmail", email);
        localStorage.setItem("authToken", data.data?.token); // Changed storage key
        console.log("Auth Token:", authToken); // Added console.log
        localStorage.setItem("userRole", role);
        localStorage.setItem("user_id", data.data?.user_id || "");
        localStorage.setItem("user_type", data.data?.user_type || "");
  
        // ✅ Redirect immediately
        if (role === "Vendor") {  
          navigate("/vendor-dashboard"); // Fixed navigation path
        } else {  
          navigate("/couple-dashboard"); // Fixed navigation path
        }
      } else {
        setMessage(data.message || "Login failed. Please try again.");
        setMessageType("error");
  
    }
   } catch (error) {
      console.error("Login error:", error);
      setMessage("Network error. Please try again later.");
      setMessageType("error");
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100"
      style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 px-4 py-2 rounded-lg text-sm ${
            messageType === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mt-6 space-y-4">
            {/* Role Selection Dropdown */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            >
              <option value="Couple">Couple</option>
              <option value="Vendor">Vendor</option>
            </select>

            {/* Email Input */}
            <input
              type="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              required
            />

            {/* Password Input with Toggle Visibility */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-700"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-600 font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
