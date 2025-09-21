import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

import Navbar from "./components/Other/Navbar";
import Hero from "./Pages/Hero";
import { useTheme } from "./components/context/ThemeContext";
import EnhancedTravelForm from "./Pages/TravelForm";
import TripPlanDisplay from "./Pages/TripPlanDisplay";
import Chat from "./Pages/Chat";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import TripHistory from "./Pages/TripHistory"; // Import TripHistory

const App = () => {
  const { theme } = useTheme();

  return (
    <div data-theme={theme} className="w-screen h-screen overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <SignedIn>
              <Navigate to="/travel-preferences" />
            </SignedIn>
            <SignedOut>
              <Hero />
            </SignedOut>
          </>
        } />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        <Route
          path="/travel-preferences"
          element={
            <SignedIn>
              <EnhancedTravelForm />
            </SignedIn>
          }
        />
        <Route
          path="/chat"
          element={<>
            <SignedIn>
              <Chat />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" />
            </SignedOut>
          </>}
        />
        <Route
          path="/trip-display/:tripId"
          element={
            <SignedIn>
              <TripPlanDisplay />
            </SignedIn>
          }
        />
        {/* Add the new route for trip history */}
        <Route
          path="/trip-history"
          element={
            <SignedIn>
              <TripHistory />
            </SignedIn>
          }
        />

        {/* Redirect users who are not signed in */}
        <Route
          path="/*"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
