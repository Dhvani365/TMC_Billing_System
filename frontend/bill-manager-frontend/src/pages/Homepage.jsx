import React from 'react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-[#011627] text-[#FDFFFC] flex">
      {/* Left Sidebar 1 */}
      <div className="w-1/5 bg-[#011627] border-r border-[#F6AE2D] flex flex-col">
        <div className="p-4 flex-1 border-b border-[#F6AE2D]">
          <h2 className="text-xl font-bold">Left Sidebar 1</h2>
          <ul className="space-y-2">
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item 1</li>
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item 2</li>
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item 3</li>
          </ul>
        </div>
        <div className="p-4 flex-1">
          <h2 className="text-xl font-bold">Left Sidebar 2</h2>
          <ul className="space-y-2">
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item A</li>
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item B</li>
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item C</li>
          </ul>
        </div>
      </div>

      {/* Left Sidebar 2 */}
      <div className="w-1/5 bg-[#011627] border-r border-[#F6AE2D] flex flex-col">
        <div className="p-4 flex-1 border-b border-[#F6AE2D]">
          <h2 className="text-xl font-bold">Left Sidebar 3</h2>
          <ul className="space-y-2">
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item X</li>
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item Y</li>
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item Z</li>
          </ul>
        </div>
        <div className="p-4 flex-1">
          <h2 className="text-xl font-bold">Left Sidebar 4</h2>
          <ul className="space-y-2">
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item M</li>
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item N</li>
            <li className="hover:text-[#F6AE2D] cursor-pointer">Menu Item O</li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-3/5 flex-grow p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to the HomePage</h1>
        <p className="text-lg">
          This is the central content area. It adjusts based on the screen size and remains responsive.
        </p>
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="bg-[#F6AE2D] p-4 rounded-lg text-[#011627]">
            <h3 className="font-bold">Card 1</h3>
            <p>Responsive content block.</p>
          </div>
          <div className="bg-[#F6AE2D] p-4 rounded-lg text-[#011627]">
            <h3 className="font-bold">Card 2</h3>
            <p>Responsive content block.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage; 