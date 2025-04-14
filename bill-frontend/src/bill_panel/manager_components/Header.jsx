import React, { useState, useEffect} from "react";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Header = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);
  const selectedClient = useSelector((state) => state.client.selectedClient);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/party`, {
          withCredentials: true,
        });
        setClients(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

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
    <header className="bg-[#F1F8E8] p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold ">TMC Billing</h1>
      
      <div className="flex items-center space-x-4">
        {/* Show Selected Client */}
        {selectedClient && <span className="text-gray-800 font-semibold">{selectedClient.name}</span>}

        {/* Select Parties Button */}
        <button
          className="bg-white text-[#123524] px-4 py-2 rounded hover:bg-[#123524] hover:text-white"
          onClick={() => setModalOpen(true)}
        >
          Select Parties
        </button>
      </div>

      {/* Logout Button */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 ml-4"
        onClick={handleLogout}
      >
        Logout
      </button>

      {/* Modal Component */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Select Client"
        searchPlaceholder="Search Client"
        items={clients}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />
    </header>
  );
};

export default Header;