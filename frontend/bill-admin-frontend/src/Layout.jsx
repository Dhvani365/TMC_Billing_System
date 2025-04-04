import React from "react";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="w-[15%] bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;