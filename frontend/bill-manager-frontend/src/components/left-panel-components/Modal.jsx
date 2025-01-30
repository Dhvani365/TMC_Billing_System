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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-35 z-50">
      <div className="bg-black rounded-md p-6 w-3/4 max-h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-red-600 font-bold pr-[1%]">
            <span className="text-2xl">X</span>
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder={`Search ${title}`}
            value={search}
            onChange={handleSearchChange}
            className="text-black text-xl w-full px-4 py-2 pr-10 border border-gray-800 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-black-800" />
        </div>

        <div className="w-[100%] mb-4 flex justify-between items-center">
          {filteredItems.length > 0 ? (
            <ul className="w-[100%] bg-zinc-700 mt-2 rounded-md max-h-[100%] overflow-auto">
              {filteredItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleOnClose(item)} // Ensure this triggers the close and select item logic
                  className="pl-10 py-3 cursor-pointer hover:bg-blue-500 hover:text-black font-bold"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : search && filteredItems.length === 0 ? (
            <p className="mt-4 text-center text-xl text-[#F6AE2D]">
              No catalogs match your search.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Modal;
