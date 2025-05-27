import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Context from "./components/context/Context.jsx";
import TripContext from "./components/context/TripContext.jsx";
import ThemeProvider from "./components/context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
 <ThemeProvider>
   <Context>
    <TripContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TripContext>
  </Context>
 </ThemeProvider>
);
