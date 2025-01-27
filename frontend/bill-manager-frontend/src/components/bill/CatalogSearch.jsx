import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const CatalogSearch = ({ options, onSelect, onClear }) => {
  const [query, setQuery] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mb-4    ">
      <label className="block mb-2">Select Catalog</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search Catalog..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 pl-10 pr-10 rounded-md bg-zinc-800"
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
      {filteredOptions.length > 0 && (
        <ul className="bg-zinc-600  mt-3 rounded-md max-h-40 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(option);
                setQuery(option); // Set the selected catalog as the query
              }}
              className="p-2 cursor-pointer hover:bg-blue-600"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CatalogSearch;