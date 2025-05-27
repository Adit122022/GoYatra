import { motion } from "framer-motion";
import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/Context";
import SplitText from "../ui/ReactBIt/SplitText";
import { axiosInstance } from "../Axios/axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // UI BASED REF
  const containerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { username, email, password };
      const response = await axiosInstance.post("/user/register", newUser, { withCredentials: true });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      navigate("/travel-preferences");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.error || error.message
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full h-[80vh] max-w-6xl mx-auto mt-10 p-4">

        

        {/* Left Side - Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2    backdrop-blur-md h-full shadow-2xl p-8 sm:p-10 md:p-12"
        >
          <div
            className="text-4xl font-bold text-center text-blue-700 mb-2"
            ref={containerRef}
            style={{ position: 'relative' }}
          >
           <SplitText
  text="Create Your Account"
  className="text-2xl font-semibold text-center custom-class"
  disabled={false} speed={3}  
/>
          </div>

          <p className="text-center  mb-4">
            Sign up to get started!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Username
              </label>
              <input
                type="text"
                required
                placeholder="yourusername"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Create a password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-3 rounded-lg font-semibold text-sm tracking-wide"
            >
              Register
            </button>

            {/* Login Link */}
            <p className="text-center  text-sm ">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </motion.div>
        {/* Rigth Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block lg:w-1/2 h-full"
        >
          <div
            className="h-full bg-cover bg-no-repeat bg-center shadow-lg"
            style={{
              backgroundImage: "url('https://i.pinimg.com/736x/63/48/ec/6348ec1fd94bfe103d9c69e212d95f5c.jpg')",
            }}
          ></div>
        </motion.div>
      </div>
    </div>
  );
}
