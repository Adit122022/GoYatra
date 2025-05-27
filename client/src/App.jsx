import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Other/Navbar";
import Register from "./components/Auth/Register";
import LoginForm from "./components/Auth/LoginForm";

import Hero from "./Pages/Hero";

import { useTheme } from "./components/context/ThemeContext";

import EnhancedTravelForm from "./Pages/TravelForm";
import TripPlanDisplay from "./Pages/TripPlanDisplay";
import Chat from "./Pages/Chat";

const App = () => {
  const { theme } = useTheme();
  return (
    <div data-theme={theme} className="w-screen h-screen overflow-x-hidden">
      {/* <Loader/> */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
     
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/travel-preferences" element={<EnhancedTravelForm />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/trip-display/:tripId" element={<TripPlanDisplay />} />

      </Routes>
    </div>
  );
};

export default App;
