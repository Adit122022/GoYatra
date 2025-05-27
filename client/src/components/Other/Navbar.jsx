import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  LogIn,
  LogOut,
  Moon,
  PhoneCall,
  PlaneTakeoff,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { THEMES } from "../Themes/index";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme, changeTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
          <PlaneTakeoff className="text-primary-300" />
          <h1 className="text-xl md:text-2xl font-bold">TRAWOMIND</h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/" className="btn btn-ghost gap-2">
            <Home className="text-primary-300" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link to="/chat" className="btn btn-ghost gap-2">
            <PhoneCall className="text-primary-300" />
            <span className="hidden sm:inline">Customer Service</span>
          </Link>

          {/* Theme Dropdown */}
          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
              <Moon className="text-primary-300" />
              <span className="hidden sm:inline">Themes</span>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56 max-h-64 overflow-y-auto"
            >
              {THEMES.map((t) => (
                <li key={t}>
                  <button
                    className={`flex flex-col items-start w-full p-2 rounded-lg text-sm ${
                      theme === t ? "bg-base-200" : "hover:bg-base-200/50"
                    }`}
                    onClick={() => changeTheme(t)}
                    data-theme={t}
                  >
                    <div className="flex gap-1 w-full">
                      <div className="w-4 h-4 rounded bg-primary" />
                      <div className="w-4 h-4 rounded bg-secondary" />
                      <div className="w-4 h-4 rounded bg-accent" />
                      <div className="w-4 h-4 rounded bg-neutral" />
                    </div>
                    <span className="text-xs mt-1">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {isAuthenticated ? (
            <button className="btn btn-ghost gap-2" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link to="/login" className="btn btn-ghost">
              <LogIn className="text-primary-300" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden btn btn-ghost" onClick={toggleMenu}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-base-100 border-t border-base-300">
          <div className="flex flex-col items-start p-4 gap-2">
            <Link to="/" className="btn btn-ghost w-full justify-start" onClick={toggleMenu}>
              <Home className="mr-2 text-primary-300" /> Home
            </Link>
            <Link to="/chat" className="btn btn-ghost w-full justify-start" onClick={toggleMenu}>
              <PhoneCall className="mr-2 text-primary-300" /> Customer Service
            </Link>

           {/* Theme Dropdown */}
<div className="dropdown">
  <button
    tabIndex={0}
    className="btn btn-ghost gap-2"
    onClick={() => setIsMenuOpen(!isMenuOpen)}
  >
    <Moon className="text-primary-300" />
    <span className=" inline">Themes</span>
  </button>
  {isMenuOpen && (
    <div
      tabIndex={0}
      className="dropdown-content z-[1] menu p-4 shadow bg-base-100 rounded-box w-60 max-h-64 overflow-y-auto mt-2"
    >
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map((t) => (
          <button
            key={t}
            className={`flex flex-col items-center p-2 rounded-lg text-xs ${
              theme === t ? "bg-base-200" : "hover:bg-base-200/50"
            }`}
            onClick={() => {
              changeTheme(t);
              setIsMenuOpen(false);
            }}
            data-theme={t}
          >
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-primary" />
              <div className="w-4 h-4 rounded bg-secondary" />
            </div>
            <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
          </button>
        ))}
      </div>
    </div>
  )}
</div>


            {isAuthenticated ? (
              <button className="btn btn-ghost w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 text-primary-300" /> Logout
              </button>
            ) : (
              <Link to="/login" className="btn btn-ghost w-full justify-start" onClick={toggleMenu}>
                <LogIn className="mr-2 text-primary-300" /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
