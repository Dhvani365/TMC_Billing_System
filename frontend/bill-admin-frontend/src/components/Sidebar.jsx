import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegChartBar, FaTable, FaUser, FaIcons, FaFolderOpen, FaDesktop } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { BsUiChecks, BsApple, BsArchiveFill, BsBriefcaseFill  } from "react-icons/bs";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState('Dashboard');
  const navigate = useNavigate();

  const handleNavItemClick = (label, path) => {
    setActiveLink(label);
    navigate(path);
  };

  const handleNewClientClick = () => {
    navigate('/add-client');
  };

  return (
    <div className="bg-white h-screen shadow-lg p-5 flex flex-col text-gray-700 font-sans">
      {/* Logo */}
      <div className="flex items-center ml-6 space-x-2 text-blue-500 font-bold text-lg">
        <FaStar />
        <span>TMC Admin</span>
      </div>
      
      {/* User Profile */}
      <div className="flex flex-col items-center my-2">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-14 h-14 rounded-full border" />
        <p className="text-sm font-semibold mt-2">Vinesh Ambani</p>
        <p className="text-xs text-gray-500">CEO, TMC <span className="text-green-500">●</span></p>
      </div>
      
      {/* New Project Button */}
      <button className="bg-green-500 text-white w-full py-2 rounded-md font-semibold mt-2" onClick={handleNewClientClick}>
        New Client +
      </button>
      
      {/* Navigation Menu */}
      <nav className="mt-4 space-y-4">
        <NavItem icon={<MdDashboard />} label="Dashboard" active={activeLink === 'Dashboard'} onClick={() => handleNavItemClick('Dashboard', '/dashboard')} />
        <NavItem icon={<BsApple />} label="Add Brands" active={activeLink === 'Add Brands'} onClick={() => handleNavItemClick('Add Brands', '/add-brands')} />
        <NavItem icon={<BsArchiveFill />} label="Add Catalogs" active={activeLink === 'Add Catalogs'} onClick={() => handleNavItemClick('Add Catalogs', '/add-catalogs')} />
        <NavItem icon={<BsBriefcaseFill />} label="Client Profile" active={activeLink === 'Client Profile'} onClick={() => handleNavItemClick('Client Profile', '/client-profile')} />
        <NavItem icon={<BsUiChecks />} label="Client Pricing" active={activeLink === 'Client Pricing'} onClick={() => handleNavItemClick('Client Pricing', '/client-pricing')} />
        <NavItem icon={<FaUser />} label="All Users' Details" active={activeLink === 'All Users\' Details'} onClick={() => handleNavItemClick('All Users\' Details', '/all-users-details')} hasArrow />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active, hasArrow, onClick }) => {
  return (
    <div 
      className={`flex justify-between items-center text-md px-3 py-2 rounded-md cursor-pointer ${active ? "text-blue-500 font-semibold bg-gray-200" : "hover:bg-gray-100"}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <span className="text-gray-600">{icon}</span>
        <span>{label}</span>
      </div>
      {hasArrow && <IoIosArrowForward className="text-gray-400" />}
    </div>
  );
};

export default Sidebar;