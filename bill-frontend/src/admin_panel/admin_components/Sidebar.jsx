import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BsApple, BsArchiveFill, BsBriefcaseFill, BsUiChecks } from "react-icons/bs";
import { FaAddressCard, FaStar, FaTags } from "react-icons/fa";
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [activeLink, setActiveLink] = useState("");

  // Update activeLink based on the current path
  useEffect(() => {
    const pathToLabelMap = {
      "/home/dashboard": "Dashboard",
      "/home/client-profile": "View Parties",
      "/home/view-brands": "View Brands",
      "/home/view-catalogs": "View Catalogs",
      "/home/special-discount": "Special Discount",
      "/home/user-accounts": "User Accounts",
    };
    setActiveLink(pathToLabelMap[location.pathname] || ""); // Set active link based on the current path
  }, [location.pathname]);

  const handleNavItemClick = (label, path) => {
    setActiveLink(label);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
      alert("You are logged out successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.response?.data || error.message);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="p-5 text-gray-700 font-sans">
      {/* Logo */}
      <div className="flex items-justify ml-2 space-x-2 text-green-500 font-bold text-lg">
        <FaStar className="mt-1"/>
        <span>Girnar Fashion</span>
      </div>

      {/* User Profile */}
      <div className="flex flex-col items-center my-2">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-14 h-14 rounded-full border"
        />
        <p className="text-sm font-semibold mt-2">Hello Girnar!</p>
        <p className="text-xs text-gray-500">
          CEO, Girnar Fashion <span className="text-green-500">●</span>
        </p>
      </div>

      <nav className="mt-4 space-y-4">
        <NavItem
          icon={<MdDashboard />}
          label="Dashboard"
          active={activeLink === "Dashboard"}
          onClick={() => handleNavItemClick("Dashboard", "/home/dashboard")}
        />
        <NavItem
          icon={<BsBriefcaseFill />}
          label="View Parties"
          active={activeLink === "View Parties"}
          onClick={() => handleNavItemClick("View Parties", "/home/client-profile")}
        />
        <NavItem
          icon={<BsApple />}
          label="View Brands"
          active={activeLink === "View Brands"}
          onClick={() => handleNavItemClick("View Brands", "/home/view-brands")}
        />
        <NavItem
          icon={<BsArchiveFill />}
          label="View Catalogs"
          active={activeLink === "View Catalogs"}
          onClick={() => handleNavItemClick("View Catalogs", "/home/view-catalogs")}
        />
        <NavItem
          icon={<FaTags />}
          label="Special Discount"
          active={activeLink === "Special Discount"}
          onClick={() => handleNavItemClick("Special Discount", "/home/special-discount")}
        />
        <NavItem
          icon={<FaAddressCard />}
          label="User Accounts"
          active={activeLink === "User Accounts"}
          onClick={() => handleNavItemClick("User Accounts", "/home/user-accounts")}
        />        
      </nav>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => {
  return (
    <div
      className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
        active ? "bg-gray-100 text-green-500 font-semibold" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <span className="text-gray-600">{icon}</span>
      <span className="ml-3">{label}</span>
    </div>
  );
};

export default Sidebar;