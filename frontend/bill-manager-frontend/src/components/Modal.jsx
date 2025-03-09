import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setSelectedClient } from "../store/clientSlice";

const Modal = ({ isOpen, onClose, title, searchPlaceholder, items, searchValue, onSearchChange }) => {
  const dispatch = useDispatch();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    setClients(items);
  }, [items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <FaTimes className="cursor-pointer text-gray-500" onClick={onClose} />
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="p-2 pl-10 w-full rounded-md border border-gray-300 outline-none"
            value={searchValue}
            onChange={onSearchChange}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>

        {/* Client List */}
        <ul className="mt-4 max-h-40 overflow-y-auto">
          {clients
            .filter((client) => client.name.toLowerCase().includes(searchValue.toLowerCase()))
            .map((client) => (
              <li
                key={client._id}
                className="p-2 cursor-pointer hover:bg-gray-200 rounded-md"
                onClick={() => {
                  dispatch(setSelectedClient(client)); // Dispatch selected client ID
                  onClose();
                }}
              >
                {client.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal;