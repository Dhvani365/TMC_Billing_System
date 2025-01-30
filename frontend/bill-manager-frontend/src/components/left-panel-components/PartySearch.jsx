import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import Modal from "./Modal";

const PartySearch = ({ parties, onSelect, onClear, selectedValue }) => {

  const [options, setOptions] = useState({});
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setQuery(selectedValue || "");
    const opts=parties.length > 0 ? parties.map((p) => p.client_name) : []
    setOptions(opts)
  }, [selectedValue]);

  const filteredOptions = options?.length
  ? options.filter((option) => option.toLowerCase().includes(query.toLowerCase()))
  : [];

  return (
    <div className="mb-4">
      <label className="block mb-2">Select Party</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search Party..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 pl-10 pr-5 rounded-lg bg-zinc-800"
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
      {filteredOptions.slice(0, 3).length > 0 && (
        <ul className="bg-zinc-700 mt-3 rounded-lg max-h-40 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(option);
                setQuery(option); // Set the selected party as the query
              }}
              className="p-2 cursor-pointer hover:bg-yellow-500 hover:text-black hover:font-bold text-lg"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      {query && filteredOptions.length === 0 && (
        <p className="mt-4 text-center text-[#F6AE2D]">
          No parties match your search.
        </p>
      )}
      {/* Show more button */}
      {filteredOptions.length > 3 && !selectedValue && (
          <div className="flex justify-center mt-3 bg-zinc-600 pt-2 pb-2 rounded-md w-[70%] mx-auto bg-blue-500">
            <button
              className="text-white underline hover:text-black"
              onClick={() => setShowModal(true)}
            >
              Show More...
            </button>
            </div>
          )}

          {/* Modal section */}
          {showModal && (
            <Modal
              title="All Parties"
              items={options}
              onSelect={onSelect}
              onClose={() => setShowModal(false)}
            />
          )}
    </div>
  );
};

export default PartySearch;