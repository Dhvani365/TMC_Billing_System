import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BsApple, BsArchiveFill, BsBriefcaseFill, BsUiChecks } from "react-icons/bs";
import { FaAddressCard , FaStar, FaTags  } from "react-icons/fa";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("View Parties");
  const navigate = useNavigate();

  const handleNavItemClick = (label, path) => {
    setActiveLink(label);
    navigate(path);
  };

  return (
    <div className="p-5 text-gray-700 font-sans">
      {/* Logo */}
      <div className="flex items-center ml-6 space-x-2 text-green-500 font-bold text-lg">
        <FaStar />
        <span>TMC Admin</span>
      </div>
      
      {/* User Profile */}
      <div className="flex flex-col items-center my-2">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-14 h-14 rounded-full border" />
        <p className="text-sm font-semibold mt-2">Vinesh Ambani</p>
        <p className="text-xs text-gray-500">CEO, TMC <span className="text-green-500">●</span></p>
      </div>

      <nav className="mt-4 space-y-4">
        <NavItem
          icon={<MdDashboard />}
          label="Dashboard"
          active={activeLink === "Dashboard"}
          onClick={() => handleNavItemClick("Dashboard", "/dashboard")}
        />
        <NavItem
          icon={<BsBriefcaseFill />}
          label="View Parties"
          active={activeLink === "View Parties"}
          onClick={() => handleNavItemClick("View Parties", "/client-profile")}
        />
        <NavItem
          icon={<BsApple />}
          label="View Brands"
          active={activeLink === "View Brands"}
          onClick={() => handleNavItemClick("View Brands", "/view-brands")}
        />
        <NavItem
          icon={<BsArchiveFill />}
          label="View Catalogs"
          active={activeLink === "View Catalogs"}
          onClick={() => handleNavItemClick("View Catalogs", "/view-catalogs")}
        />      
        <NavItem
          icon={<FaTags />}
          label="Special Discount"
          active={activeLink === "Special Discount"}
          onClick={() => handleNavItemClick("Special Discount", "/special-discount")}
        />  
        <NavItem
          icon={<FaAddressCard  />}
          label="User Accounts"
          active={activeLink === "User Accounts"}
          onClick={() => handleNavItemClick("User Accounts", "/user-accounts")}
        />  
      </nav>
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