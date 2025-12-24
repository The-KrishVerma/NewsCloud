import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import userIcon from "../assets/user.png";
import { AuthContext } from '../Firebase/Provider/AuthProvider';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const handleLogOut = async () => {
    try {
      await logOut();
      alert('You logged out successfully');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 text-sm md:text-base font-medium transition-all duration-200 rounded-lg ${
      isActive
        ? 'font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/50'
        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 backdrop-blur-sm'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md shadow-lg border-b border-blue-900/30">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-3 gap-4">
        {/* User email */}
        <div className="hidden lg:block text-xs text-gray-500 truncate font-medium">
          {user ? `Welcome, ${user.email?.split('@')[0]}` : 'Guest User'}
        </div>

        {/* Login section */}
        <div className="login-btn flex gap-3 items-center order-1 md:order-2">
          <img
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-600 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/50"
            src={user?.photoURL || userIcon}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = userIcon;
            }}
            alt="User avatar"
          />
          {user ? (
            <button onClick={handleLogOut} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm md:text-base">
              Logout
            </button>
          ) : (
            <Link to="/auth/login" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm md:text-base">
              Login
            </Link>
          )}
        </div>

        {/* Navigation links */}
        <div className="nav flex gap-4 md:gap-5 text-gray-400 items-center flex-wrap justify-center order-2 md:order-1">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/newsfinder" className={navLinkClass}>
            NewsFinder
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
