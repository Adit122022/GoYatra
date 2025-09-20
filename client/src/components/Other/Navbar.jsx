import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Moon, PlaneTakeoff, Menu, X, History, User, LogOut, MessageSquare } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { THEMES } from "../Themes/index";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/clerk-react";

const CustomUserButton = () => {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  if (!user) return null;

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img src={user.imageUrl} alt="User profile" />
        </div>
      </label>
      <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
        <li>
          <button onClick={() => openUserProfile()} className="justify-between">
            <User className="w-4 h-4" />
            Manage Account
          </button>
        </li>
        <li>
          <Link to="/trip-history" className="justify-between">
             <History className="w-4 h-4" />
            History
          </Link>
        </li>
        <li>
          <button onClick={() => signOut({ redirectUrl: '/' })} className="justify-between">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

const MobileUserMenu = ({ toggleMenu }) => {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  if (!user) return null;

  return (
    <div className="w-full">
      <div className="flex items-center p-2 mb-2">
        <div className="avatar mr-4">
          <div className="w-10 rounded-full">
            <img src={user.imageUrl} alt="User profile" />
          </div>
        </div>
        <div>
          <div className="font-bold">{user.fullName}</div>
          <div className="text-sm opacity-50">{user.primaryEmailAddress.emailAddress}</div>
        </div>
      </div>
      <Link to="/trip-history" className="btn btn-ghost btn-block justify-start" onClick={toggleMenu}>
        <History className="w-4 h-4" />
        History
      </Link>
      <button onClick={() => { openUserProfile(); toggleMenu(); }} className="btn btn-ghost btn-block justify-start">
        <User className="w-4 h-4" />
        Manage Account
      </button>
      <button onClick={() => { signOut({ redirectUrl: '/' }); toggleMenu(); }} className="btn btn-ghost btn-block justify-start">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, changeTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-sm shadow-md">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost normal-case text-2xl font-bold gap-2">
            <PlaneTakeoff className="text-primary" />
            <span className="hidden sm:inline">GoYatra</span>
          </Link>
        </div>

        <div className="navbar-end flex items-center gap-2">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className="btn btn-ghost gap-2">
              <Home />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/chat" className="btn btn-ghost gap-2">
              <MessageSquare />
              <span className="hidden sm:inline">Customer Service</span>
            </Link>

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost gap-2">
                <Moon />
                <span className="hidden sm:inline">Themes</span>
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 mt-4">
                {THEMES.map((t, i) => (
                  <li key={i}>
                    <a onClick={() => changeTheme(t)}>{t}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <SignedIn>
              <CustomUserButton />
            </SignedIn>

            <SignedOut>
              <Link to="/sign-in" className="btn btn-primary">Sign In</Link>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="btn btn-ghost">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-base-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="btn btn-ghost btn-block justify-start" onClick={toggleMenu}>
              <Home />
              Home
            </Link>
            <Link to="/chat" className="btn btn-ghost btn-block justify-start" onClick={toggleMenu}>
              <MessageSquare />
              Customer Service
            </Link>

            <div className="collapse collapse-arrow">
                <input type="checkbox" /> 
                <div className="collapse-title btn btn-ghost btn-block justify-start -ml-3">
                  <Moon />
                  Themes
                </div>
                <div className="collapse-content flex flex-col items-start">
                  {THEMES.map((t, i) => (
                      <a key={i} onClick={() => {changeTheme(t); toggleMenu();}} className="btn btn-ghost w-full justify-start">{t}</a>
                  ))}
                </div>
            </div>
          
            <div className="border-t border-base-300 pt-4 mt-4">
              <SignedIn>
                <MobileUserMenu toggleMenu={toggleMenu} />
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in" className="btn btn-primary btn-block" onClick={toggleMenu}>Sign In</Link>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
