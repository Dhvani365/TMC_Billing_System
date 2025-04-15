import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import BillManager from "./BillManager";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Header = () => {
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [billManagerOpen, setBillManagerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);
  const selectedClient = useSelector((state) => state.client.selectedClient);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/party`);
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <header className="bg-[#F1F8E8] p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">TMC Billing</h1>
      
      {/* Show Selected Client */}
      {selectedClient && <span className="text-gray-800 font-semibold">{selectedClient.name}</span>}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setBillManagerOpen(true)}
        >
          Bill Manager
        </button>
        
        <button
          className="bg-white text-[#123524] px-4 py-2 rounded hover:bg-[#123524] hover:text-white"
          onClick={() => setClientModalOpen(true)}
        >
          Select Client
        </button>
      </div>

      {/* Client Selection Modal */}
      <Modal
        isOpen={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        title="Select Client"
        searchPlaceholder="Search Client"
        items={clients}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />
      
      {/* Bill Manager Component */}
      <BillManager 
        isOpen={billManagerOpen}
        onClose={() => setBillManagerOpen(false)}
        clients={clients}
      />
    </header>
  );
};

export default Header;
