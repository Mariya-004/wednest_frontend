import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [role, setRole] = useState("Couple");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null); // Success/Error message
  const [messageType, setMessageType] = useState("error"); // 'error' or 'success'
  const navigate = useNavigate();

  // API Base URL from .env (Fallback to localhost for development)
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Reset message on new submission

    const data = { username, email, password, user_type: role };

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Account created successfully! Redirecting to login...");
        setMessageType("success");

        setTimeout(() => {
          navigate("/login"); // Redirect to Login Page after 1.5s
        }, 1500);
      } else {
        setMessage(result.message || "Something went wrong. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Server error, please try again later.");
      setMessageType("error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-pink-100"
      style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 px-4 py-2 rounded-lg text-sm ${
              messageType === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mt-6 space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === "Couple" ? "Full Name" : "Business Name"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              required
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Id"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              required
            />

            {/* Password Input with Toggle Visibility */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-700"
              >
                {showPassword ? "👁️" : "🙈"} {/* Toggle icon */}
              </button>
            </div>

            {/* Role Selection Dropdown */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            >
              <option value="Couple">Couple</option>
              <option value="Vendor">Vendor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition"
          >
            Register Now
          </button>
        </form>

        <p className="mt-4 text-gray-600">
          Already a member?{" "}
          <Link to="/login" className="text-pink-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
