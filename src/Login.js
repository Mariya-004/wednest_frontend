import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("Couple"); // Default role selection
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null); // State for displaying messages
  const [messageType, setMessageType] = useState("error"); // 'error' or 'success'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null); // Reset message on new submission

    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Login successful! Redirecting...");
        setMessageType("success");

        // ✅ Store login data in localStorage
        localStorage.setItem("userEmail", email);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", role);


        localStorage.setItem("user_id", data.data.user_id);
        localStorage.setItem("user_type", data.data.user_type); // ✅ Storing user_type
        

        // ✅ Redirect based on role
        setTimeout(() => {
          if (data.data.user_type==="Vendor") {
            navigate("/vendor-dashboard");
          } else {
            navigate("/couple-dashboard");
          }
        }, 1500); // Delay for showing success message before redirection
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error logging in", error);
      setMessage("An error occurred while logging in.");
      setMessageType("error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-pink-100"
      style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>

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
            />

            {/* Password Input with Toggle Visibility */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
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
          >
            Login
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
