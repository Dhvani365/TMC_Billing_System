import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import Modal from "./Modal";

const ProductSearch = ({ options, onSelect, onClear, selectedValue }) => {
  const [query, setQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  // Ensure query is updated when selectedValue changes
  useEffect(() => {
    setQuery(selectedValue || ""); // Avoid setting null/undefined
  }, [selectedValue]);

  // Filter products safely
  const filteredOptions = options.filter(
    (option) => option && option.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mb-4">
      <label className="block mb-2 text-white">Select Product</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search Product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 pl-10 pr-10 rounded-lg bg-[#011627] border border-[#F6AE2D] text-white"
        />
        <FaSearch className="absolute left-3 top-3 text-[#F6AE2D]" />
        {query && (
          <FaTimes
            className="absolute right-3 top-3 text-[#F6AE2D] cursor-pointer"
            onClick={() => {
              setQuery("");
              onClear();
            }}
          />
        )}
      </div>

      {/* Display the list only if there are filtered results */}
      {filteredOptions.length > 0 && (
        <ul className="bg-[#0a2438] border border-[#F6AE2D] mt-2 rounded-lg max-h-40 overflow-auto">
          {filteredOptions.slice(0, 4).map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(option);
                setQuery(option); // Show selected product in input
              }}
              className="p-2 cursor-pointer hover:bg-[#F6AE2D] hover:text-black text-white"
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {/* No matches message */}
      {query && filteredOptions.length === 0 && (
        <p className="mt-4 text-center text-[#F6AE2D]">
          No products match your search.
        </p>
      )}

      {/* Show More button */}
      {options.length > 4 && (
        <div className="flex justify-center mt-2">
          <button
            className="text-white underline hover:text-yellow-500"
            onClick={() => setShowModal(true)}
          >
            Show More...
          </button>
        </div>
      )}

      {/* Modal section */}
      {showModal && (
        <Modal
          title="All Products"
          items={options}
          onSelect={onSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ProductSearch;
