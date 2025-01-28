/* Modal.jsx */
import { Search } from 'lucide-react';
import { useState } from 'react';

const Modal = ({ title, items, onSelect, onClose }) => {
  const [search, setSearch] = useState("");
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleOnClose = (item) => {
    onSelect(item); // Call onSelect with the selected item
    setSearch(item); // Optionally set the search field to the selected item
    onClose(); // Close the modal after selecting the item
  };

  let filteredItems = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  if (!filteredItems.length && !search) {
    filteredItems = items;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-[#011627] rounded-lg p-6 w-3/4 max-h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-red-500 font-bold pr-[1%]">
            <span className="text-xl">X</span>
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder={`Search ${title}`}
            value={search}
            onChange={handleSearchChange}
            className="text-black w-full px-4 py-2 pr-10 border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-black-800" />
        </div>

        <div className="w-[100%] mb-4 flex justify-between items-center">
          {filteredItems.length > 0 ? (
            <ul className="w-[100%] bg-[#0a2438] border border-[#F6AE2D] mt-2 rounded-lg max-h-[100%] overflow-auto">
              {filteredItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleOnClose(item)} // Ensure this triggers the close and select item logic
                  className="pl-10 py-3 cursor-pointer hover:bg-[#F6AE2D]"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : search && filteredItems.length === 0 ? (
            <p className="mt-4 text-center text-[#F6AE2D]">
              No catalogs match your search.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Modal;
