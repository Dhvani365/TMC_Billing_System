import React, { useState } from "react";
import { useSelector } from "react-redux";
import Modal from "./Modal";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedClient = useSelector((state) => state.client.selectedClient);

  const clients = ["Dhvani Maktuporia", "Devanshu Mangal", "Deep Gadhiya", "Kuldeep Kevat", "Malhar Mangtani"];

  return (
    <header className="bg-[#F1F8E8] p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold ">TMC Billing</h1>

      {/* Show Selected Client */}
      {selectedClient && <span className="text-gray-800 font-semibold">{selectedClient}</span>}

      {/* New Client Button */}
      <button
        className="bg-white text-[#123524] px-4 py-2 rounded hover:bg-[#123524] hover:text-white"
        onClick={() => setModalOpen(true)}
      >
        New Client
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
