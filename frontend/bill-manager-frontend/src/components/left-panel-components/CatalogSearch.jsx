import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import Modal from "./Modal";

const CatalogSearch = ({ options, onSelect, onClear, selectedValue }) => {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Ensure selectedValue is a string
    setQuery(selectedValue?.catalog_name || selectedValue || "");
  }, [selectedValue]);

  console.log("Query:", query); // Debugging

  const filteredOptions = options.filter((option) =>
    option.catalog_name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mb-4">
      <label className="block mb-2 text-white">Select Catalog</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search Catalog..."
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

      {filteredOptions.length > 0 ? (
        <ul className="bg-[#0a2438] border border-[#F6AE2D] mt-2 rounded-lg max-h-40 overflow-auto">
          {filteredOptions.slice(0, 4).map((option) => (
            <li
              key={option.catalog_id}
              onClick={() => {
                onSelect(option); // Send full object for selection
                setQuery(option.catalog_name); // But store only the name for display
              }}
              className="p-2 cursor-pointer hover:bg-[#F6AE2D] hover:text-black text-white"
            >
              {option.catalog_name}
            </li>
          ))}
        </ul>
      ) : (
        query && (
          <p className="mt-4 text-center text-[#F6AE2D]">
            No catalogs match your search.
          </p>
        )
      )}

      {/* Show more button (only if there are more than 4 options) */}
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
          title="All Catalogs"
          items={options}
          onSelect={onSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CatalogSearch;
