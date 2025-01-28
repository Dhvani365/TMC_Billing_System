import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const ProductSearch = ({ options, onSelect, onClear, selectedValue }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(selectedValue);
  }, [selectedValue]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mb-4">
      <label className="block mb-2">Select Product</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search Product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 pl-10 pr-10 rounded-lg bg-[#011627] border border-[#F6AE2D]"
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
        <ul className="bg-[#0a2438] border border-[#F6AE2D] mt-2 rounded-lg max-h-40 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(option);
                setQuery(option); // Set the selected product as the query
              }}
              className="p-2 cursor-pointer hover:bg-[#F6AE2D]"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      {query && filteredOptions.length === 0 && (
        <p className="mt-4 text-center text-[#F6AE2D]">
          No products match your search.
        </p>
      )}
    </div>
  );
};

export default ProductSearch;