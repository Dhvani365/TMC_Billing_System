import React from 'react';
import { FaHome, FaInfoCircle, FaUser } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <FaHome className="text-[#F6AE2D] w-7 h-7" />
        <h1 className="text-xl font-bold">My Bill</h1>
      </div>
      <div className="flex items-center space-x-4">
        <a href="#home" className="text-xl font-bold hover:text-[#F6AE2D]">Home</a>
        <a href="#about" className="text-xl font-bold hover:text-[#F6AE2D]">About</a>
        <a href="#profile" className="text-xl font-bold hover:text-[#F6AE2D]">Profile</a>
        <FaUser className="text-[#F6AE2D] w-6 h-6" />
      </div>
    </nav>
  );
};

export default Navbar;
// =======
//     return (
//       <nav className="fixed w-full bg-gray-900 text-white p-4 z-10">
//         <h1 className="text-l">My Bill</h1>
//       </nav>
//     );
//   };
  
//   export default Navbar;
  
// >>>>>>> main
