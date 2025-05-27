import { motion } from "framer-motion";
import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/Context";
import SplitText from "../ui/ReactBIt/SplitText";
import { axiosInstance } from "../Axios/axios";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
  
    // UI BASED REF
    const containerRef = useRef(null);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const userdata = { email, password };
        const response = await axiosInstance.post("/user/login", userdata );
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        console.log(response.data);
        navigate("/travel-preferences");
      } catch (error) {
        console.error("Login failed:", error.response?.data?.error || error.message);
      }
    };
  
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center w-full h-[80vh] max-w-6xl mt-10 mx-auto p-4">
  
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block lg:w-1/2 h-full "
          >
            <div
              className=" h-full bg-cover bg-no-repeat bg-center shadow-lg"
              style={{
                backgroundImage: "url('https://i.pinimg.com/736x/d0/5b/33/d05b33278b79e029a33fe543b03960fa.jpg')",
              }}
            ></div>
          </motion.div>
  
          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2  backdrop-blur-md h-full shadow-2xl p-8 sm:p-10 md:p-12"
          >
  
            <div
              className="text-4xl font-bold text-center text-blue-700 mb-2"
              ref={containerRef}
              style={{ position: 'relative', fontFamily: 'Poppins, sans-serif' }}
            >
              <SplitText
               text="Welcome Back" disabled={false} speed={3} className=' text-secondary custom-class' 
              />
            </div>
            <p className="text-center  mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Please login to your account
            </p>
  
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium  mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                <label className="block text-sm font-medium  mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
  
              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-3 rounded-lg font-semibold text-sm tracking-wide"
              >
                Sign In
              </button>
  
              {/* Register Link */}
              <p className="text-center text-sm mt-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                  Register now
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }
  